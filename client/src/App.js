import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './components/Layout/Landing';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing}/>
          <div className="container">
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
