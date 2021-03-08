import React from 'react';
import '../App.scss';
import { useParams } from 'react-router-dom';
import config from '../config';

import { Input, Button } from 'antd';
import { fetchMatch, fetchVoting, getPlayerInfo, getPlayerMatches } from '../api';
import { MatchStatus, mapsImages, maps } from '../constants';
import { convertMatches, averageOfMatches, countPoints } from '../utils';

import { Divider } from 'antd';

import {
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
    level10
} from '../assets';

const levels: {[index: string]:any} = {
    1: level1,
    2: level2,
    3: level3,
    4: level4,
    5: level5,
    6: level6,
    7: level7,
    8: level8,
    9: level9,
    10: level10,
}

interface ParamTypes{
    id: string;
}

const Match = () => {
    const [error, setError] = React.useState<string | null>();
    const [loaded, setLoaded] = React.useState<Boolean>(false);
    const [match, setMatch] = React.useState<any>();
    const [voting, setVoting] = React.useState<any>();
    const [players, setPlayers] = React.useState<any>();
    const [data, setData] = React.useState<any>();

    const { id } = useParams<ParamTypes>();

    const init = async () => {
        const match = await fetchMatch(id);
        if(!match) return setError("Match ID is invalid")
        setMatch(match);
        let voting = await fetchVoting(id, 'map');
        setVoting(voting);
        parseMaps(match);
        console.log(match)
        console.log(voting)
        setLoaded(true);
    }

    const parseMaps = async (match: any) => {
        let data: any = {};
        let players: any = {faction1: {}, faction2: {}};
        // Create each map empty object
        maps.forEach(map => {data[map] = {}})
        if(match){
            for (var i of [1, 2]){
                // Get ids of players from 1 team
                let ids = match.teams[`faction${i}`].roster.map((player: any) => player.id);
                // Get basic info
                let players_info = await getPlayerInfo({ ids });
                // Get past 100 matches
                let players_stats = await getPlayerMatches({ ids });
                players[`faction${i}`] = {players_info, players_stats}
                // Filter matches and get average stats
                for(var j in maps){
                    let team_data = ids.map((id: string, k: number) => {
                        let map_matches = players_stats[k].filter((match: any) => match['i1'] === maps[j]);
                        map_matches = convertMatches(map_matches);
                        map_matches = averageOfMatches(map_matches);
                        return map_matches;
                    })
                    data[maps[j]][`faction${i}`] = averageOfMatches(team_data);
                }
            }
        }
        data = countPoints(data);
        setData(data);
        processPlayers(players);
    }

    const processPlayers = (players: any) => {
        let to_return: any = {faction1: [], faction2: [] };
        for(var team in players){
            let player = {}; // Should be { ... playerinfo, matches: [] }
            // Get average of player's maps
            players[team].players_stats.forEach((player_matches: any, i: number) => {
                let matches = convertMatches(player_matches);
                matches = averageOfMatches(matches);
                to_return[team].push({...players[team].players_info[i], matches})
            })
            
        }
        setPlayers(to_return);
    }

    React.useEffect(() => {
        init();
    }, [])

    return (
        <div className="page">
            <div className="col container" style={{ paddingBottom: 100 }}>
                <span className="header">Match</span>
                {!loaded && !error? <span>Loading ...</span>
                :!loaded && error? <span className="error">{error}</span>
                : loaded && match? (
                    <>
                        <div className="row" style={{ justifyContent: "center" }}>
                            <span className="text">{match.status}  •  {match.game}  •  {match.region}</span>
                        </div>

                        {match.status !== MatchStatus.FINISHED? <span className="header">Current Score</span> : null }
                        {match.results && match.status !== MatchStatus.FINISHED? (
                            <div className="row">
                                <div className="col">
                                    <span className="text">{match.results[0].factions.faction1.score}</span>
                                </div>
                                <div className="col">
                                    <span className="text">{match.results[0].factions.faction1.score}</span>
                                </div>
                            </div>

                        ) : null}

                        <Divider />

                        {match.teams?.faction1?.stats && (
                            <div className="col">
                                <span className="header">Win Probability</span>
                                <div className="row" style={{ justifyContent: "space-evenly" }}>
                                    <span className="text">{(match.teams.faction1.stats.winProbability * 100).toFixed(2)}%</span>
                                    <span className="text">{(match.teams.faction2.stats.winProbability * 100).toFixed(2)}%</span>
                                </div>
                                <Divider />
                            </div>
                        )}

                        <div className="header">Teams Overview</div>
                        <div className="row">
                            {Object.keys(match.teams).map((team: any, i) => {
                                team = match.teams[team]
                                let winner;
                                if(match.results){
                                    winner = match.results[0].winner === `faction${i+1}`
                                }
                                return(
                                <div className="col" key={i} style={{ flex: 1, alignItems: "center" }}>
                                    <span className="team-name">{team.name}</span>
                                    {match.status === MatchStatus.FINISHED && match.results? <span className={winner? "winner" : "loser"}>{winner? "Winner" : "Loser"}</span> : null}
                                    {players? players[`faction${i+1}`].map((player:any, j: number) => {
                                        return(
                                        <div key={j} className="player-container">
                                            <div className="nickname-container" style={{ flexDirection: i === 0? "row" : "row-reverse" }}>
                                                <span className="player-name">{player.nickname}</span>
                                                <div className="level" style={{ flexDirection: i === 0? "row" : "row-reverse" }}>
                                                    <span className="elo">{player.games.csgo.faceit_elo}</span>
                                                    <img src={levels[player.csgo_skill_level]} alt="level" className="level-icon" />
                                                </div>
                                            </div>
                                            <div className="stats">
                                                {Object.keys(player.matches).map((stat, k) => {return(
                                                    <div className="stat-container" key={k}>
                                                        <span className="stat-name"><u>{stat}</u></span>
                                                        <span className="stat-value">{player.matches[stat]}</span>
                                                    </div>
                                                )})}
                                            </div>
                                        </div>
                                    )}): null}
                                </div>
                            )})}
                        </div>

                        {data && (
                            <>
                            <Divider />
                            <div className="header">Map Analysis</div>
                            <div className="maps">
                                {Object.keys(data).map((map, i) => {
                                    let vote = voting.find((MAP: any) => MAP.properties.guid === map)
                                    let banned = vote.status === 'drop';
                                    let picked = vote.status === 'pick';
                                    return(
                                        <div className={`map ${picked? "picked" : banned? "banned" : null}`}>
                                            <div key={i}>
                                                <span className="points">{data[map].team1}</span>
                                                <img src={mapsImages[map]} alt="map" className="mapImage" />
                                                <span className="points">{data[map].team2}</span>
                                            </div>
                                            <div className="col">
                                                {Object.keys(data[map].faction1).map((key, i) => {return(
                                                    <div className="row">
                                                        <span className="key">{key}:</span>
                                                        <span> {data[map].faction1[key]} - {data[map].faction2[key]}</span>
                                                    </div>
                                                )})}
                                            </div>
                                        </div>
                                )})}
                            </div>
                            </>
                        )}
                    </>
                )
                : null}
                <Button className="button back" type="ghost" href="/">Back</Button>
            </div>
        </div>
    )
}

export default Match;