import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import utils from '../utils';
import config from '../config';

const Settings = () => {
    const [username, setUsername] = React.useState<string>('');

    const navigate: NavigateFunction = useNavigate();

    const save = () => {
        localStorage.setItem("nickname", username)
    }

    React.useEffect(() => {
        setUsername(localStorage.nickname)
    }, [])

    return (
        <div className="page">
            <div className="col container">
                <span className="header">Settings</span>
                {/* <Input bordered={false} placeholder="Faceit username" value={username} className="input" onChange={(e: any) => setUsername(e.target.value)} /> */}
                {/* <Button className="button" type="ghost" onClick={save}>Save</Button> */}
                {/* <Button className="button back" type="ghost" href="/">Back</Button> */}

            </div>
        </div>
    )
}

export default Settings;