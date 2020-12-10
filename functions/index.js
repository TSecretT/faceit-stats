/* eslint-disable */
const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
const app = require('express')();
const cors = require('cors');
const axios = require('axios');
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
