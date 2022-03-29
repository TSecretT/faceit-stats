import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home, Player, Match, Settings, Auth } from './pages';

import config from './config';

const App = () => {

	return (
		<Router>
			<Routes>
				<Route path="/" element={ <Home /> } />
				<Route path="/match/:id" element={ <Match /> } />
				{/* <Route path="/player/:id" element={Player} /> */}
				{/* <Route path="/settings" element={Settings} /> */}
				<Route path="/auth" element={ <Auth /> } />
			</Routes>
		</Router>
	);
	}

export default App;
