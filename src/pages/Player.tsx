import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import api from '../api';
import utils from '../utils';

const Player = () => {
    const [player, setPlayer] = React.useState<any>();
    const [matches, setMatches] = React.useState<any[]>();

    const { id }: any = useParams();
    const history: any = useHistory();

    const init = async () => {
        const playerData: any = await api.getPlayerInfo({ id })
        const playerMatches: any[] = await api.getPlayerMatches({ id })
        .then((matches: any[]) => utils.convertMatches(matches))


        setPlayer(playerData);
        setMatches(playerMatches);
    }

    React.useEffect(() => {
        init();
    }, [])

    if(!player || !matches) return null;
    

    return (
        <div className="page">
            <div className="container">
                <span>{player.nickname}</span>
            </div>
        </div>
    )
}

export default Player;