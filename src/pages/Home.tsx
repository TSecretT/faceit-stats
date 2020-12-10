import React from 'react';
import '../App.css';
import { useHistory } from 'react-router-dom';
import {config} from '../config';

import { Input, Button } from 'antd';

const Home = () => {
    const [id, setId] = React.useState<String | null>();

    const history = useHistory();

    const search = () => {
        if(id) history.push('/match/' + id)
    }

    return (
        <div className="page">
            <span className="title">FACEIT TIPS</span>
            <div className="container">
                <span className="text">Analyze matches</span>
                <Input bordered={false} placeholder="Match ID" className="input" onChange={e => { setId(e.target.value) }}/>
                <Button className="button" type="text" onClick={search}>Analyze</Button>
            </div>
            <span className="version">Closed Beta v{config.VERSION}</span>
        </div>
    )
}

export default Home;