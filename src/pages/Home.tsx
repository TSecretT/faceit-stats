import React from 'react';
import '../App.scss';
import { useHistory } from 'react-router-dom';
import config from '../config';

import { Input, Button, Alert } from 'antd';
import utils from '../utils';

const Home = () => {
    const [url, setURL] = React.useState<string>("");

    const history = useHistory();

    const search = () => {
        if (!url) return;
        const id = utils.trimURL(url);
        history.push('/match/' + id)
        utils.addLastSearched(id);
    }

    return (
        <div className="page">
            <span className="title tracking-in-expand">FACEIT TIPS</span>
            <div className="col container">
                <Alert className="alert" message={config.WELCOME_MESSAGE} />
                <Input bordered={false} placeholder="Match ID or URL" className="input" onChange={e => { setURL(e.target.value) }}/>
                <Button className="button" type="text" onClick={search}>Analyze</Button>

                <Button className="button" type="ghost" href="/settings">Settings</Button>
            </div>
            <span className="version">Beta v{config.VERSION}</span>
        </div>
    )
}

export default Home;