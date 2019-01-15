import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import jwt_decode from 'jwt-decode'
import {setCurrentUser, logoutUser} from './redux/actions/authActions'
import setAuthToken from './utils/setAuthToken'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Landing from './components/Layout/Landing'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import store from './redux/store'
import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import {clearCurrentProfile} from './redux/actions/profileActions'
import CreateProfile from './components/create-profile/CreateProfile'
import EditProfile from './components/EditProfile/EditProfile'
import AddExperience from './components/AddCredentials/AddExperience'
import AddEducation from './components/AddCredentials/AddEducation'
import PrivateRoute from './components/common/PrivateRoute'
import Profiles from './components/Profiles/Profiles'
import Profile from './components/Profile/Profile'
import NotFound from './components/not-found/NotFound'
import Posts from './components/Posts/Posts'
import Post from './components/Post/Post'

// not gona deleate from ls anymore when refreshed Check for token
if (localStorage.jwtToken) {
		// set the auth token header auth
		setAuthToken(localStorage.jwtToken)
		// decode token and get user info and exp
		const decoded = jwt_decode(localStorage.jwtToken)
		// set user and isAuthenticated
		store.dispatch(setCurrentUser(decoded))
		// check for expired token
		const currentTime = Date.now() / 1000

		if (decoded.exp < currentTime) {
				// logout user
				store.dispatch(logoutUser())
				// clear current profile
				store.dispatch(clearCurrentProfile())
				// redirect to login
				window.location.href = '/'
		}
}

class App extends Component {
		render() {
				return (
						<Provider store={store}>
								<Router>
										<div className="App">
												<Navbar/>
												<Route exact path="/" component={Landing}/>
												<div className="container">
														<Route exact path="/register" component={Register}/>
														<Route exact path="/login" component={Login}/>
														<Route exact path="/profiles" component={Profiles}/>
														<Route exact path="/profile/:handle" component={Profile}/>
														<Switch>
																<PrivateRoute exact path="/dashboard" component={Dashboard}/>
														</Switch>
														<Switch>
																<PrivateRoute exact path="/edit-profile" component={EditProfile}/>
														</Switch>
														<Switch>
																<PrivateRoute exact path="/create-profile" component={CreateProfile}/>
														</Switch>
														<Switch>
																<PrivateRoute exact path="/add-experience" component={AddExperience}/>
														</Switch>
														<Switch>
																<PrivateRoute exact path="/add-education" component={AddEducation}/>
														</Switch>
														<Switch>
																<PrivateRoute exact path="/feed" component={Posts}/>
														</Switch>
														<Switch>
																<PrivateRoute exact path="/post/:id" component={Post}/>
														</Switch>

														<Route path='/not-found' component={NotFound}/>

												</div>

												<Footer/>
										</div>
								</Router>
						</Provider>
				)
		}
}

export default App
