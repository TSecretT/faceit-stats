/* eslint-disable */
const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
const app = require('express')();
const cors = require('cors');
const axios = require('axios');
const { getListFromSnapshot } = require('./utils.js');
const { getFaceitMatches, getWebhookSettings, setWebhookSettings } = require('./api.js');
const {config} = require('./config');

firebase.initializeApp(config.FIREBASE_CONFIG);
admin.initializeApp();
app.use(cors({ origin: true }));

const db = firebase.firestore();
const realDB = firebase.database();

const auth = (req, res, next) => {
    next();
}

let headers = {"Authorization": config.FACEIT_USER_TOKEN}

const getMatchDetails = async (id) => {
    return await axios.get(`https://api.faceit.com/match/v2/match/${id}`)
    .then(res => res.data)
    .catch(error => error)
}

app.post("/hooks/add", async (req, res) => {
    // console.log("New hook", req.query)
    // let hook = req.body;

    // if(hook.event === 'match_object_created'){
    //     realDB.ref(`matches/${hook.payload.id}`).set({ createdAt: new Date().toISOString() })
    // }

    // await realDB.ref(`hooks/${hook.event_id}`).set(req.body)
    // .then(() => { return res.status(200).json() })
    // .catch(error => { console.log(error); return res.status(500).json({error: "Server Error"})})
})

app.post('/hooks/delete', auth, async (req, res) => {
    let { all, id } = req.body;
    if(all){
        await realDB.ref('hooks').remove()
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({error: "Server Error"}) })
    } else {
        await realDB.ref(`hooks/${id}`).remove()
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({error: "Server Error"}) })
    }
})

app.get('/hooks/settings', auth, async (req, res) => {
    axios.get('https://api.faceit.com/webhooks/v1/subscriptions', {params:{ app_id: "dd3b8614-b1a9-438f-9ab0-a24269620738" }, headers})
    .then(response => { return res.status(200).json(response.data.payload)})
    .catch(error => { console.log(error); return res.status(500).json({ error: "Server Error" })})
})

// Get user list that are in listen list
app.get('/users', auth, async (req, res) => {
    let users = await realDB.ref('users').once('value')
    .then(snapshot => getListFromSnapshot(snapshot))
    .error(error => { console.log(error) })
    
    if(users){
        return res.status(200).json(users)
    } else {
        return res.status(500).json({ error: "Server error" })
    }
})

app.get('/users/includes', auth, async (req, res) => {
    let { id } = req.query;
    let users = await realDB.ref('users').once('value')
    .then(snapshot => getListFromSnapshot(snapshot))
    .catch(error => { console.log(error) })
    users = users.map(user => user.id)
    let includes = users.includes(id)
    return res.status(200).json(includes)
})

// Add new user to listen list
app.post('/users/add', auth, async (req, res) => {
    let { id } = req.body;
    let settings = await getWebhookSettings();

    if(!settings) return res.status(500).json({ error: "Server Error" })

    let ids = settings.restrictions.map(user => user.value)
    if(!ids.includes(id)){
        settings.restrictions.push({
            "type":"user",
            "value": id
        })

        // Update settings on Faceit Hooks Settings
        await axios.put('https://api.faceit.com/webhooks/v1/subscriptions/abe878d4-088f-4f0b-b79e-927df28bcf72', {...settings},  {headers})
        .then(response => {
            if(response.data.payload.restrictions.map(user => user.value).includes(id)){
                return res.status(200).json()
            } else {
                console.log("User was not added"); return res.status(500).json({ error: "User was not added"})
            }
        })
        .catch(error => { console.log(error); return res.status(500).json({ error: "Server Error"})})

        // Create new user ref
        return await realDB.ref(`users/${id}`).set({
            id,
            created_at: new Date().getTime(),
            last_searched_at: new Date().getTime()
        })
    } else {
        return res.status(200).json()
    }
})

app.post('/users/delete', auth, async (req, res) => {
    let { all, id } = req.body;
    if(all){
        await realDB.ref('users').remove()
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({error: "Server Error"}) })
    } else {
        await realDB.ref(`users/${id}`).remove()
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({error: "Server Error"}) })
    }
})

app.post('/users/sync', auth, async (req, res) => {
    let db_users = await realDB.ref('users').once('value')
    .then(snapshot => getListFromSnapshot(snapshot))
    db_user = db_users.map(user => user.id)
    
    let settings = await axios.get('https://api.faceit.com/webhooks/v1/subscriptions', { params: { app_id: "dd3b8614-b1a9-438f-9ab0-a24269620738" }, headers })
    .then(response => response.data.payload.find(settings => settings.name === 'Users') )
    let settings_users = settings.restrictions.map(item => item.value)
    
    console.log(db_users);
    console.log(settings_users);

    let updates = {};
    settings_users.forEach(user => { if(!db_users.includes(user.value)) updates[`users/${user}`] = {id: user} }) 

    await realDB.ref().update(updates)
    .then(() => { return res.status(200).json() })
    .catch(error => { console.log(error) })
})

app.post('/users/generate', auth, async (req, res) => {
    let settings = await getWebhookSettings();
    let live_matches = await getFaceitMatches();
    let settings_users = settings.restrictions.map(user => user.value)
    let old_users = settings.restrictions.length;

    live_matches.forEach(match => {
        for(var i of [1, 2]){
            match.teams[`faction${i}`].roster.forEach(player => {
                if(!settings_users.includes(player.id)){
                    settings.restrictions.push({ type: "user", value: player.id })
                }
            })
        }
    })

    let updated_settings = await setWebhookSettings(settings);
    if(updated_settings){
        let updates = {};
        updated_settings.restrictions.forEach(user => { updates[`users/${user.value}`] = { id: user.value, created_at: new Date().getTime(), last_searched_at: new Date().getTime() } })
        realDB.ref().update(updates);
    }
    return res.status(200).json({old: old_users, new: updated_settings.restrictions.length});
})

app.post('/matches/create', auth, async (req, res) => {
    let { match, matches } = req.body;
    if(matches){
        let updates={};
        matches.forEach(match => {
            updates[`matches/${match.id}`] = match
        })
        await realDB.ref().update(updates)
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({ error: "Server Error" })})
    } else {
        await realDB.ref(`matches/${match.id}`).set(match)
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({ error: "Server Error" })})
    }
})

app.post('/matches/check', auth, async (req, res) => {
    // Get match_object_created hooks
    let hooks = await realDB.ref('hooks')
    .orderByChild('event')
    .equalTo('match_object_created')
    .once('value')
    .then(snapshot => getListFromSnapshot(snapshot))

    // Get all matches
    let matches = await realDB.ref('matches')
    .once('value')
    .then(snapshot => Object.keys(snapshot))

    // Returns ids which were not parsed
    hooks = hooks.filter(hook => !matches.includes(hook.payload.id))
    hooks = hooks.map(hook => hook.payload.id)

    return res.status(200).json(hooks);
})

app.post('/matches/delete', auth, async (req, res) => {
    let { all, id } = req.body;
    if(all){
        await realDB.ref('matches').remove()
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({ error: "Server error" }) })
    } else {
        await realDB.ref(`matches/${id}`).remove()
        .then(() => { return res.status(200).json() })
        .catch(error => { console.log(error); return res.status(500).json({error: "Server Error"}) })
    }
})

app.post('/matches/clear', auth, async (req, res) => {
    let matches = await realDB.ref('matches').once('value')
    .then(snapshot => {
        let matches = [];
        snapshot.forEach(match => {matches.push(match.val())})
        return matches;
    })

    let hooks = await realDB.ref('hooks').once('value')
    .then(snapshot => {
        let hooks = [];
        snapshot.forEach(hook => {hooks.push(hook.val())})
        return hooks;
    })

    let updates = {};
    matches.forEach(match => {
        if( new Date().getTime() - new Date(match.createdAt).getTime() >= (4 * 60 * 60 * 1000)){
            updates[`matches/${match.id}`] = null;
            let match_hooks = hooks.filter(hook => hook.payload.id === match.id)
            match_hooks.forEach(hook => { updates[`hooks/${hook.event_id}`] = null; })
        }
    })

    await realDB.ref().update(updates)
    .then(() => { return res.status(200).json(); })
    .catch(error => { console.log(error) })
})

app.get('/stats', auth, async (req, res) => {
    let hooks = await realDB.ref('hooks').once('value')
    .then(snapshot => getListFromSnapshot(snapshot))

    let matches = await realDB.ref('matches').once('value')
    .then(snapshot => getListFromSnapshot(snapshot))

    let users = await realDB.ref('users').once('value')
    .then(snapshot => getListFromSnapshot(snapshot))

    return res.status(200).json({hooks, matches, users})
})

app.post('/captcha', async (req, res) => {
    let {value} = req.body;
    let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.CAPTCHA_SECRET}&response=${value}`)
    .then(response => response.data)
    .catch(error => { console.log(error) })

    if(response && response.success){
        return res.status(200).json(response.success)
    } else {
        return res.status(400).json({ error: "Captcha Invalid" })
    }
})

app.post('/feedback/create', async (req, res) => {
    let newKey = realDB.ref().child('feedbacks').push().key;
    await realDB.ref(`feedbacks/${newKey}`).set(req.body)
    .then(() => { res.status(200).json() })
    .catch(error => { console.log(error); res.status(500).json({ error: "Server Error" })})
})

exports.api = functions.https.onRequest(app);
