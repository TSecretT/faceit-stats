import React from 'react';
import '../App.scss';
import { useHistory } from 'react-router-dom';
import config from '../config';

import { Input, Button, Alert } from 'antd';
import utils from '../utils';

const Home = () => {
    const [url, setURL] = React.useState<string>("");
    const [lastSearched, setLastSearched] = React.useState<String | null>();

    const history = useHistory();

    const search = () => {
        const id = utils.trimURL(url);
        history.push('/match/' + id)
        utils.addLastSearched(id);
    }

    React.useEffect(() => {
        const lastSearched = localStorage.getItem('last_searched');
        if(lastSearched) setLastSearched(lastSearched);
    }, [])

    return (
        <div className="page">
            <span className="title tracking-in-expand">FACEIT TIPS</span>
            <div className="col container">
                <Alert className="alert" message={config.WELCOME_MESSAGE} />
                <Input bordered={false} placeholder="Match ID or URL" className="input" onChange={e => { setURL(e.target.value) }}/>
                <Button className="button" type="text" onClick={search}>Analyze</Button>

                {/* <div className="last-searched-container">
                    <span>Last searched match: </span>
                </div> */}
            </div>
            <span className="version">Closed Beta v{config.VERSION}</span>
        </div>
    )
}

export default Home;