import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

import { notification , Button } from 'antd';
import { MatchStatus, mapsImages, maps } from '../constants';
import api from '../api';
import utils from '../utils';

import { Divider } from 'antd';

import { PlayerCard } from '../components';

import { MatchStat } from '../types';


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

    const [myMatches, setMyMatches] = React.useState<string[]>();
    const [findings, setFindings] = React.useState<any>();

    const [parseTime, setParseTime] = React.useState<string>();

    const { id } = useParams<ParamTypes>();
    const history: any = useHistory();

    const init = async () => {
        const match = await api.fetchMatch(id);
        if(!match) return setError("Match ID is invalid")
        setMatch(match);
        const voting = await api.fetchVoting(id, 'map');
        setVoting(voting);
        await parseMaps(match);
        setLoaded(true);
    }

    const parseMaps = async (match: any) => {
        if(!match) return;

        const startTime: number = new Date().getTime();

        const players: any[] = utils.extractPlayers(match, true, false);
        const playersInfo: any[] = await api.getPlayerInfo({ ids: players });
        const playersMatches: MatchStat[][] = await api.getPlayerMatches({ ids: players })
        const playersMatchesAverage: any[] = playersMatches.map((matches: any[]) => utils.averageOfMatches(utils.convertMatches(matches)));
        const toReturn: any[] = playersInfo.map((playerInfo: any, index: number) => { return { ...playerInfo, matches: playersMatchesAverage[index] } })
        setPlayers(toReturn);

        setMyMatches(playersMatches.find((matches: MatchStat[]) => matches[0].nickname === localStorage.nickname)?.map((match: MatchStat) => match.matchId));
        
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

        const parseTime: string = ((new Date().getTime() - startTime) / 1000).toFixed(3)
        setParseTime(parseTime)
        return
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

    const findPlayedPlayers = async () => {
        if (!localStorage.nickname) return;
        const thisMatchPlayers: any = utils.extractPlayers(match, true, true)
        .filter((player: string) => player !== localStorage.nickname);
        
        const matches: any[] = await api.getMultipleMatchDetails(myMatches)
        const myID: string = players.find((player: any) => player.nickname === localStorage.nickname)?.guid;

        const playersAllData: any[] = players;

        let findings: any = {};
        
        let myParty: any[] = [];
        for(const partyID in match.entityCustom.parties){
            if (match.entityCustom.parties[partyID].includes(myID)){
                myParty = match.entityCustom.parties[partyID].map((playerID: string) => playersAllData.find((player: any) => player.guid === playerID).nickname);
                break;
            }
        }

        matches.forEach((match: any) => {
            if (match.id === id ) return;
            const players: any = utils.extractPlayers(match, false, true);

            findings[match.id] = {
                matchID: match.id,
                time: moment(Date.parse(match.startedAt)).format("HH:mm DD/MM/YY"), 
                won: players[match.summaryResults.winner].includes(localStorage.nickname),
                players: []
            }
            
            for(const playerName of thisMatchPlayers){
                if (!myParty.includes(playerName)){
                    if ( (players.faction1.includes(playerName) && players.faction1.includes(localStorage.nickname))
                    || (players.faction2.includes(playerName) && players.faction2.includes(localStorage.nickname)) ){
                        findings[match.id].players.push({  name: playerName, teammate: true });
                    } else if ( (players.faction1.includes(playerName) && players.faction2.includes(localStorage.nickname))
                    || (players.faction2.includes(playerName) && players.faction1.includes(localStorage.nickname)) ){
                        findings[match.id].players.push({  name: playerName, teammate: false });
                    }
                }
            }

        })

        findings = Object.keys(findings).map((matchID: string) => findings[matchID]).filter((match: any) => match.players.length > 0)
        setFindings(findings);
    }

    const checkUsername = () => {
        if (localStorage.nickname) return;
        notification.open({
            message: 'No username saved',
            description:
            'You have not set your Faceit username in settings. It is needed to get some extra usefull information like players you have played with before. Click on this window to add your username',
            onClick: () => { history.push("/settings")},
        })
    }

    React.useEffect(() => {
        init();
        checkUsername();
    }, [])

    React.useEffect(() => {
        if(match && players && myMatches) findPlayedPlayers()
    }, [match, players, myMatches])

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
                            
                        <Divider />
                        <span className="header">Notable players</span>
                        {findings?.length? findings.map((data: any) => {
                            if(data.players.length === 0) return null;
                            
                            const playedWith: string[] = data.players.filter((data: any) => data.teammate).map((data: any) => data.name)
                            const playedVS: string[] = data.players.filter((data: any) => !data.teammate).map((data: any) => data.name)
                            
                            return <>
                                <div className="row player-with-container" key={data.matchID} onClick={()=> window.open(`https://www.faceit.com/en/csgo/room/${data.matchID}/scoreboard`, "_blank")}>
                                    <span className="text">{data.time}</span>
                                    
                                    <span className={`result ${data.won? 'winner' : 'loser'}`}>{data.won? "Win" : "Loss"}</span>

                                    {playedWith.length > 0 && <span className="text">With {playedWith.map((name: string) => <strong>{name} </strong> )}</span> }
                                    {playedVS.length > 0 && <span className="text">Versus {playedVS.map((name: string) => <strong>{name} </strong> )}</span> }

                                    
                                </div>
                            </>
                        }) : localStorage.nickname? <>
                        <span className="text">{localStorage.nickname} have not played with these played before</span>
                        </>
                        : <span className="text">Enter you Faceit username in settings to see</span>}

                        <Divider />
                    </>
                )
                : null}


                {loaded && <span className="description">Parsed in {parseTime} seconds</span>}
                <Button className="button back" type="ghost" href="/">Back</Button>
            </div>
        </div>
    )
}

export default Match;