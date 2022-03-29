import React from 'react'


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
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { Player } from '../types';

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

const PlayerCard = ({ player, side, stats }: { player: Player, side: string, stats: any }) => {

    const navigate: NavigateFunction = useNavigate();

    return <div className={`player-container ${side === "right" ? "flex-row-reverse" : ""} my-2`}>
        
        <div className="col justify-evenly h-full">
            <img src={levels[player.gameSkillLevel]} className='w-10 m-1' alt="level" />
            <img src={`https://flagcdn.com/kz.svg`} className='w-10 m-1' alt="flag" />
        </div>

        <div className={`col w-96 mx-1 ${side === 'right'? "items-end" : "items-start"} p-2`}>
            <div className={`row justify-between w-full ${side === "right" ? "flex-row-reverse" : ""}`}>
                <p className="mx-2">{player.nickname}</p>
                <p className="mx-2">2012</p>
            </div>
            <table className="table table-compact w-full mx-2">
                <thead>
                    <tr>
                        {Object.keys(stats[player.id]).map((keyName: string, i: number) => <th key={i}>{keyName}</th>)}
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        {Object.keys(stats[player.id]).map((keyName: string, i: number) => 
                            <td >{stats[player.id][keyName]}</td>
                        )}
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}

export default PlayerCard;