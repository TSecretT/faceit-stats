import React from 'react';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';

import API from '../api';
import { PlayerCard } from '../components';
import { mapsImages } from '../constants';
import { Match as MatchType, Player as PlayerType, Team as TeamType } from '../types';

// 1-7ed1e9e2-314a-4fe9-af1b-773416688c58

const Team = ({ team, side, stats }: { team: TeamType, side: string, stats: any }) => {

    const findLeaderName = (id: string) => {
        return team.roster.find((player: PlayerType) => player.id === id)?.nickname;
    }

    return <div className="col">
        <p>{findLeaderName(team.leader)}</p>
        <div className="divider" />
        {team.roster.map((player: PlayerType, i: number) => <PlayerCard key={i} player={player} side={side} stats={stats} /> )}
    </div>
}

const Match = () => {
    const [error, setError] = React.useState<string | null>();
    const [loading, setLoading] = React.useState<boolean>(true);

    const [match, setMatch] = React.useState<MatchType>();
    const [stats, setStats] = React.useState<any>();

    const { id } = useParams<any>();
    const navigate: NavigateFunction = useNavigate();

    const init = async () => {
        if (!id) return setLoading(false);
        const data: any = await API.analyze(id);
        setMatch(data.match);
        setStats(data.stats);

        setLoading(false);
    }

    React.useEffect(() => {
        init();
    }, [])

    if (loading) return <p>Loading</p>
    if (!match) return null;

    return (
        <div className="page">
            <div className="match-container">
                <h1>Match analysis</h1>
                <p>MATCH ID: {match.id}</p>
                <div className="flex flex-row items-center">
                    <div className="badge badge-accent m-2">{match.game.toUpperCase()}</div>
                    <div className="badge badge-accent m-2">{match.entity.name.toUpperCase()}</div>
                    <div className="badge badge-accent m-2">{match.region.toUpperCase()}</div>
                    {match.locations?.length && <img alt="server-location" className='rounded-sm m-2 w-10 h-5' src={match.locations[0].image_sm}/>}
                </div>

                <div className="divider" />

                <div className="flex flex-row">
                    { Object.values(match.teams).map((team: TeamType, i:number) => <Team key={i} team={team} side={i === 0? "left" : "right"} stats={stats.avg} />) }
                </div>

                <div className="divider" />

                <div className="w-full flex flex-row flex-wrap justify-center">
                    { Object.keys(stats).map((map: string, i: number) => {
                        if (map === 'avg') return null;
                        const stat: any = stats[map];
                        return <div className="card w-60 bg-base-100 shadow-xl m-2 col">
                                <figure><img src={mapsImages[map]} alt="Shoes" /></figure>
                                <div className="card-body">
                                <h3 className="card-title">{map}</h3>

                                <div className="row">
                                    <div className="col mx-1">
                                        {Object.keys(stat.faction1).map((key: string, j: number,) => <p key={j}>{key}</p>)}
                                    </div>
                                    {Object.keys(stat).map((faction: string, i: number) => 
                                        <div className="col mx-1">
                                            {Object.keys(stat[faction]).map((key: string, j: number,) => <p key={j}>{stat[faction][key]}</p>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p>6 - 3</p>
                        </div>
                    })
                }
                </div>

                <div className='divider' />
                
                <a href="/" className="btn btn-wide">Back</a>
            </div>
        </div>
    )
}

export default Match;