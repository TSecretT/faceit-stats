import { Match } from '../types';
import { FaceitIndex, average_allowed } from '../constants';


const trimURL = (url: string): string => url.split('/')[url.split('/').length - 1]

// Convert snapshot to list
const getListFromSnapshot = (snapshot: any) => {
    let items: any[] = [];
    snapshot.forEach((item: { val: () => any; key: any; }) => { items.push( {...item.val(), key: item.key} )  })
    return items;
}

// Sort matches by date created
const sortMatches = (matches: any[]) => {
    return matches.sort((a: { createdAt: string | number | Date; },b: { createdAt: string | number | Date; }) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) ? 1 : ((new Date(b.createdAt).getTime() > new Date(a.createdAt).getTime()) ? -1 : 0)); 
}

// Returns true if player id is in match
const checkMyselfInMatch = (match: any, id: String) => {
    if(match && match.teams){
        let players = [];
        for (const [key, value] of Object.entries(match.teams)){
            for(var i in match.teams[key].roster){
                players.push(match.teams[key].roster[i].id)
            }
        }
        return players.includes(id)
    } else {
        return false;
    }
}

const convertMatches = (matches: any[]) => {
    let indexes = Object.keys(FaceitIndex)
    return matches.map((match: any) => {
        for(const [key, value] of Object.entries(match)){
            if(indexes.includes(key)){
                match[FaceitIndex[key]] = value;
                delete match[key];
            }
        }
        return match;
    })
}

const average = (array: any[]) => {
    return +(array.reduce((a: string, b: string) => parseFloat(a) + parseFloat(b)) / array.length).toFixed(2);
}

const averageOfMatches = (matches: any[]) => {
    let average: any = {};
    average_allowed.forEach((key: string | number) => {
        let matches_ = matches.map((match: { [x: string]: any; }) => match[key]);
        average[key] = matches_.length > 0? +(matches_.reduce((a: string,b: string) => parseFloat(a) + parseFloat(b)) / matches_.length).toFixed(2) : 0
    })
    return average; 
}

const countPoints = (data: any) => {
    for(const [map, overall_stats] of Object.entries(data)){
        let stats:any = overall_stats;
        let team1 = 0;
        let team2 = 0;
        for(var key of average_allowed){
            if(stats['faction1'][key] > stats['faction2'][key] && key !== 'Deaths'){
                team1++;
            } else if(stats['faction1'][key] < stats['faction2'][key] && key !== 'Deaths') {
                team2++;
            } else if(key === 'Deaths' && stats['faction1'][key] > stats['faction2'][key]){
                team2++;
            } else if(key === 'Deaths' && stats['faction1'][key] < stats['faction2'][key]){
                team1++;
            } else {
                team1++;
                team2++;
            }
        }
        data[map]['team1'] = team1;
        data[map]['team2'] = team2;
    }
    return data;
}

const getLastSearched = () => {
    const lastSearched: any = localStorage.last_searched;
    if(!lastSearched) return []
    return JSON.parse(lastSearched)
}

const addLastSearched = (id: string) => {
    let lastSearched: string[] = getLastSearched();
    lastSearched = [id, ...lastSearched]
    if(lastSearched.length > 5) lastSearched = lastSearched.slice(0, 5)
    localStorage.setItem("last_searched", JSON.stringify(lastSearched))
}

const extractPlayers = (match: Match) => {
    let players = [];
    try{
        if(match.teams){
            for(const i in match.teams){
                players.push(...match.teams[i].roster.map(user => user.id))
            }
        }
    } catch(err){
        console.log(`Match ${match.id} error - ${err}`)
    }
    return players;
}


export default {
    trimURL,
    getListFromSnapshot,
    sortMatches,
    checkMyselfInMatch,
    convertMatches,
    average,
    averageOfMatches,
    countPoints,
    getLastSearched,
    addLastSearched,
    extractPlayers
};