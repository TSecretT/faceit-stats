import React from 'react'

import { Tooltip } from 'antd';

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
import { useHistory } from 'react-router-dom';

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

const PlayerCard = ({ player, side }: any) => {

    const history: any = useHistory();

    return <div className="player-container">
        <div className="nickname-container" style={{ flexDirection: side === "left"? "row" : "row-reverse" }}>
            <div className="row" style={{ flexDirection: side === "left"? "row" : "row-reverse" }}>
                <Tooltip title={player.country.toUpperCase()}>
                    <img src={`https://www.countryflags.io/${player.country}/flat/64.png`} alt="flag" className="flag" />
                </Tooltip>
                <span className="player-name" onClick={() => history.push(`/player/${player.guid}`)}>{player.nickname}</span>
            </div>
            <div className="level" style={{ flexDirection: side === "left"? "row" : "row-reverse" }}>
                <span className="elo">{player.games.csgo.faceit_elo}</span>
                <img src={levels[player.csgo_skill_level]} alt="level" className="level-icon" />
            </div>
        </div>
        <div className="stats">
            {Object.keys(player.matches).map((stat: any, i: number) => 
                <div className="stat-container" key={i}>
                    <span className="stat-name"><u>{stat}</u></span>
                    <span className="stat-value">{player.matches[stat]}</span>
                </div>
            )}
        </div>
    </div>
}

export default PlayerCard;