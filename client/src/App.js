import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import {setCurrentUser, logoutUser} from './redux/actions/oathActions';

import setAuthToken from './utils/setAuthToken';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './components/Layout/Landing';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import store from './redux/store';
import './App.css';



// not gona deleate from ls anymore
// Check for token
if (localStorage.jwtToken) {
	// set the auth token header auth
	setAuthToken(localStorage.jwtToken);
	// decode token and get user info and exp
	const decoded = jwt_decode(localStorage.jwtToken);
	// set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	// check for expired token
	const currentTime = Date.now() / 1000;


	if (decoded.exp > currentTime) {
		// logout user
		store.dispatch(logoutUser());
		//TODO: clear current profile
		// redirect to login
		window.location.href = '/login'
	}
}


class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route path="/register" component={Register} />
							<Route path="/login" component={Login} />
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
