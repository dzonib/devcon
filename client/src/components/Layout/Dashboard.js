import React from 'react';
import {connect} from 'react-redux';


// Just for testing

const Dashboard = (props) => {

  console.log(props)
  return <div>
    {props.auth.isAuthenticated ? 
    <p>Hi Mr.{props.auth.user.name}</p> : 
    <p>Login to see greeting nigga</p>
    }
  </div>
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Dashboard);