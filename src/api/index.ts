import axios, { AxiosResponse } from 'axios';
import config from '../config';

axios.defaults.baseURL = config.BASE_URL

const analyze = async (id: string) => {
    return await axios.post("/analyze/" + id)
    .then((res: AxiosResponse) => res.data)
}

// const fetchMatch = async (id: String) => 
//     await axios.get(`https://api.faceit.com/match/v2/match/${id}`)
//     .then((res: { data: any; }) => res.data.payload)
//     .catch((error: {response: any}) => { console.log(error) })

// const fetchVoting = async (id: String, entity_type: String) =>
//     await axios.get(`https://api.faceit.com/democracy/v1/match/${id}`)
//     .then((res: any) => res.data.payload.tickets.find((entity: { entity_type: string; }) => entity.entity_type === entity_type).entities)
//     .catch((error: {response: any}) => {console.log(error)})

// const getPlayerInfo = async ({nickname, id, nicknames, ids}: any) => {
//     if(nickname){
//         return await axios.get(`https://api.faceit.com/users/v1/nicknames/${nickname}`)
//         .then((res: { data: { payload: any; }; }) => res.data.payload)
//         .catch((error: any) => {console.log(error);})
//     } else if(id){
//         return await axios.get(`https://api.faceit.com/users/v1/users/${id}`)
//         .then((res: { data: any; }) => res.data.payload)
//         .catch((error: any) => {console.log(error)})
//     } else if(nicknames){
//         let promises = nicknames.map((nickname: any) => axios.get(`https://api.faceit.com/users/v1/nicknames/${nickname}`))
//         return await axios.all(promises)
//         .then(axios.spread((...responses: any[]) => {
//             return responses.map(response => response.data.payload)
//         }))
//     } else if(ids){
//         let promises = ids.map((id: any) => axios.get(`https://api.faceit.com/users/v1/users/${id}`))
//         return await axios.all(promises)
//         .then(axios.spread((...responses: any[]) => {
//             return responses.map(response => response.data.payload)
//         }))
//     }
// }

// const getPlayerMatches = async ({id, ids}: any) => {
//     if(id){
//         return await axios.get(`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/csgo`)
//         .then((res: { data: any; }) => res.data)
//         .catch((error: any) => {console.log(error);})
//     } else {
//         let promises = ids.map((id: any) => axios.get(`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/csgo`))
//         return await axios.all(promises)
//         .then(axios.spread((...responses: any[]) => {
//             return responses.map(response => response.data)
//         }))
//     }
// }

// const getMultipleMatchDetails = async (ids: any) => {
//     const promises = ids.map((id: any) => fetchMatch(id))
//     return await axios.all(promises)
//     .then(axios.spread((...responses: any[]) => {
//         return responses.map(response => response)
//     }))
// }

const API = {
    analyze
}

export default API;