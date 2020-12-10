const { FaceitIndex, average_allowed } = require('../constants');

// Convert snapshot to list
export const getListFromSnapshot = (snapshot: any) => {
    let items: any[] = [];
    snapshot.forEach((item: { val: () => any; key: any; }) => { items.push( {...item.val(), key: item.key} )  })
    return items;
}

// Sort matches by date created
export const sortMatches = (matches: any[]) => {
    return matches.sort((a: { createdAt: string | number | Date; },b: { createdAt: string | number | Date; }) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) ? 1 : ((new Date(b.createdAt).getTime() > new Date(a.createdAt).getTime()) ? -1 : 0)); 
}

// Returns true if player id is in match
export const checkMyselfInMatch = (match: any, id: String) => {
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

export const convertMatches = (matches: any[]) => {
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

export const average = (array: any[]) => {
    return +(array.reduce((a: string, b: string) => parseFloat(a) + parseFloat(b)) / array.length).toFixed(2);
}

export const averageOfMatches = (matches: any[]) => {
    let average: any = {};
    average_allowed.forEach((key: string | number) => {
        let matches_ = matches.map((match: { [x: string]: any; }) => match[key]);
        average[key] = matches_.length > 0? +(matches_.reduce((a: string,b: string) => parseFloat(a) + parseFloat(b)) / matches_.length).toFixed(2) : 0
    })
    return average; 
}

export const countPoints = (data: any) => {
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