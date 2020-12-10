const axios = require('axios');
const { config } = require('./config');

let headers = {"Authorization": config.FACEIT_USER_TOKEN}

const getFaceitMatches = async (game = "csgo", region = "EU", state = "ONGOING") => {
    return await axios.get('https://api.faceit.com/match/v1/matches/list', { params: {game, region, state}})
    .then(res => res.data.payload)
    .catch(error => { console.log(error) })
}

const getWebhookSettings = async () => {
    return await axios.get('https://api.faceit.com/webhooks/v1/subscriptions', {params:{ app_id: config.FACEIT_APP_ID }, headers })
    .then(res => res.data.payload.find(settings => settings.name === "Users") )
    .catch(error => { console.log(error.response.statusText) })
}

const setWebhookSettings = async (data) => {
    return await axios.put('https://api.faceit.com/webhooks/v1/subscriptions/' + config.FACEIT_USERS_WEBHOOK_TOKEN, {...data}, {headers})
    .then(res => res.data.payload)
    .catch(error => { console.log(error.response.data) })
}

module.exports = { getFaceitMatches, getWebhookSettings, setWebhookSettings }