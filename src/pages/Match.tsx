import React from 'react';
import '../App.scss';
import { useParams } from 'react-router-dom';

import { Input, Button } from 'antd';
import { MatchStatus, mapsImages, maps } from '../constants';
import api from '../api';
import utils from '../utils';
import config from '../config';

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
import { PlayerCard } from '../components';

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
    const [mapsData, setMaps] = React.useState<any>();

    const { id } = useParams<ParamTypes>();

    const init = async () => {
        const match = await api.fetchMatch(id);
        if(!match) return setError("Match ID is invalid")
        setMatch(match);
        const voting = await api.fetchVoting(id, 'map');
        setVoting(voting);
        parseMaps(match);
        setLoaded(true);
    }

    const parseMaps = async (match: any) => {
        if(!match) return;
        // let data: any = {};
        // let players: any = {faction1: {}, faction2: {}};
        // // Create each map empty object
        // maps.forEach(map => {data[map] = {}})
        // for (var i of [1, 2]){
        //     // Get ids of players from 1 team
        //     const ids = match.teams[`faction${i}`].roster.map((player: any) => player.id);
        //     // Get basic info
        //     const players_info = await getPlayerInfo({ ids });
        //     // Get past 100 matches
        //     const players_stats = await getPlayerMatches({ ids });
        //     players[`faction${i}`] = {players_info, players_stats}
        //     // Filter matches and get average stats
        //     for(const j in maps){
        //         let team_data = ids.map((id: string, k: number) => {
        //             let map_matches = players_stats[k].filter((match: any) => match['i1'] === maps[j]);
        //             map_matches = convertMatches(map_matches);
        //             map_matches = averageOfMatches(map_matches);
        //             return map_matches;
        //         })
        //         data[maps[j]][`faction${i}`] = averageOfMatches(team_data);
        //     }
        // }
        // data = countPoints(data);
        // setData(data);
        // processPlayers(players);

        const players: any[] = utils.extractPlayers(match);
        const playersInfo: any[] = await api.getPlayerInfo({ ids: players });
        const playersMatches: any[] = await api.getPlayerMatches({ ids: players })
        const playersMatchesAverage: any[] = playersMatches.map((matches: any[]) => utils.averageOfMatches(utils.convertMatches(matches)));
        const toReturn: any[] = playersInfo.map((playerInfo: any, index: number) => { return { ...playerInfo, matches: playersMatchesAverage[index] } })
        setPlayers(toReturn);

        let mapsData: any = {}
        maps.forEach((map: string) => {
            mapsData[map] = { faction1: [], faction2: [] }
            playersMatches.forEach((matches: any[], i:number) => {
                const matchesOnMap: any[] = matches.filter((match: any) => match['Map'] === map)
                let mapStats: any = utils.averageOfMatches(utils.convertMatches(matchesOnMap));
                mapsData[map][`faction${i < 5? 1 : 2}`].push(mapStats);
            })
            mapsData[map].faction1 = utils.averageOfMatches(mapsData[map].faction1)
            mapsData[map].faction2 = utils.averageOfMatches(mapsData[map].faction2)
        })
        mapsData = utils.countPoints(mapsData)
        setMaps(mapsData)
    }

    const processPlayers = (players: any) => {
        let toReturn: any[] = [];

        // for(const faction in players){
        //     console.log(players[faction].player_stats.map((stats: any) => {
        //         let matches = convertMatches(stats);
        //         matches = averageOfMatches(matches);
        //         toReturn.push({ ...players[team].players_info[i], matches })
        //     } ))
        // }

        // players[team].players_stats.forEach((player_matches: any, i: number) => {
        //     let matches = convertMatches(player_matches);
        //     matches = averageOfMatches(matches);
        //     to_return.push({...players[team].players_info[i], matches})
        // })

        // console.log(to_return);
        // setPlayers(to_return);
    }

    const renderTeams = () => {
        if(!players) return null;
        return <>
            <div className="header">Teams Overview</div>
                <div className="row">
                    <div className="col">
                        {players.slice(0, 5).map((player: any, i: number) => <PlayerCard player={player} side="left" key={i} />)}
                    </div>
                    <div className="col">
                        {players.slice(5).map((player: any, i: number) => <PlayerCard player={player} side="right" key={i} />)}
                    </div>
                </div>
        </>
    }

    const renderMaps = () => {
        if(!mapsData) return null;
        return <>
        <Divider />
        <div className="header">Map Analysis</div>
            <div className="maps">
                {Object.keys(mapsData).map((mapName: string, i: number) => {
                    let banned: boolean = false;
                    let picked: boolean = false;
                    if(voting){
                        const vote = voting.find((MAP: any) => MAP.properties.guid === mapName)
                        if(!vote) return;
                        banned = vote.status === 'drop';
                        picked = vote.status === 'pick';
                    }
                    return( 
                        <div key={mapName} className={`map ${banned && "banned"} ${picked && "picked"}`}>
                            <div>
                                <span className="points">{mapsData[mapName].team1}</span>
                                <img src={mapsImages[mapName]} alt="map" className="mapImage" />
                                <span className="points">{mapsData[mapName].team2}</span>
                            </div>
                            <div className="col">
                                {Object.keys(mapsData[mapName].faction1).map((key: string, j: number) => {return(
                                    <div className="row" key={j}>
                                        <span className="key">{key}:</span>
                                        <span> {mapsData[mapName].faction1[key]} - {mapsData[mapName].faction2[key]}</span>
                                    </div>
                                )})}
                            </div>
                        </div>
                )})}
            </div>
        </>
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
                            <span className="text">Status: {match.status}  •  Game: {match.game}  •  Region: {match.region}</span>
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
                            </div>
                        )}
                        <Divider />

                        {renderTeams()}
                        
                        {renderMaps()}
                            
                    </>
                )
                : null}
                <Button className="button back" type="ghost" href="/">Back</Button>
            </div>
        </div>
    )
}

export default Match;