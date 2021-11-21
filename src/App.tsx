import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Home, Player, Match, Settings } from './pages';
import './App.scss';

import firebase from './api/firebase';

import config from './config';
axios.defaults.baseURL = window.location.hostname === "faceit.tips"? config.SERVER_URL : config.SERVER_LOCAL_URL

const App = () => {

	console.log(firebase.analytics.app.name)

	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/match/:id" component={Match} />
				<Route exact path="/player/:id" component={Player} />
				<Route exact path="/settings" component={Settings} />
			</Switch>
		</Router>
	);
	}

export default App;
