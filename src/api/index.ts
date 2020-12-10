import Axios from "axios";

const axios = require('axios');


export const fetchMatch = async (id: String) => {
    return await axios.get(`https://api.faceit.com/match/v2/match/${id}`)
    .then((res: { data: any; }) => res.data.payload)
    .catch((error: {response: any}) => { console.log(error) })
}

export const fetchVoting = async (id: String, entity_type: String) => {
    return await axios.get(`https://api.faceit.com/democracy/v1/match/${id}/history`)
    .then((res: {data: any}) => {
        let entity = res.data.payload.tickets.find((entity: { entity_type: string; }) => entity.entity_type === entity_type)
        return entity.entities;
    })
    .catch((error: {response: any}) => {console.log(error)})
}

export const getPlayerInfo = async ({nickname, id, nicknames, ids}: any) => {
    if(nickname){
        return await axios.get(`https://api.faceit.com/core/v1/nicknames/${nickname}`)
        .then((res: { data: { payload: any; }; }) => res.data.payload)
        .catch((error: any) => {console.log(error);})
    } else if(id){
        return await axios.get(`https://api.faceit.com/core/v1/users/${id}`)
        .then((res: { data: any; }) => res.data)
        .catch((error: any) => {console.log(error)})
    } else if(nicknames){
        let promises = nicknames.map((nickname: any) => axios.get(`https://api.faceit.com/core/v1/nicknames/${nickname}`))
        return await axios.all(promises)
        .then(axios.spread((...responses: any[]) => {
            return responses.map(response => response.data.payload)
        }))
    } else if(ids){
        let promises = ids.map((id: any) => axios.get(`https://api.faceit.com/core/v1/users/${id}`))
        return await axios.all(promises)
        .then(axios.spread((...responses: any[]) => {
            return responses.map(response => response.data.payload)
        }))
    }
}

export const getPlayerMatches = async ({id, ids}: any) => {
    if(id){
        return await axios.get(`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/csgo`)
        .then((res: { data: any; }) => res.data)
        .catch((error: any) => {console.log(error);})
    } else {
        let promises = ids.map((id: any) => axios.get(`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/csgo`))
        return await axios.all(promises)
        .then(axios.spread((...responses: any[]) => {
            return responses.map(response => response.data)
        }))
    }
}