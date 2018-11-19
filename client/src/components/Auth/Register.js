import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/actions/authActions'
import TextFieldGroup from '../common/TextFieldGroups'



class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }

    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onSubmitHandler = this.onSubmitHandler.bind(this)
  }

  onChangeHandler(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  async onSubmitHandler(e) {
    e.preventDefault();

    const {name, email, password, password2} = this.state;

    const newUser = {
      name,
      email,
      password,
      password2
    }

    this.props.registerUser(newUser, this.props.history)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.errors) {
  //     this.setState({errors:nextProps.errors})
  //   }
  // }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
   
     return nextProps.errors && {errors: nextProps.errors}
    
  }

  render() { 
    const {email, name, password, password2} = this.state.errors;

    // const {user} = this.props.auth;
    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">
                  Create your DevConnector account
                </p>
                <form onSubmit={this.onSubmitHandler}>
                <TextFieldGroup
                  type='text'
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChangeHandler}
                  error={name}
                />

                
                <TextFieldGroup
                  type='email'
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChangeHandler}
                  error={email}
                  info="This site uses Gravatar so if you want a profile image,
                      use a Gravatar email"
                />
                
                <TextFieldGroup
                  type='password'
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChangeHandler}
                  error={password}
                />
                
                <TextFieldGroup
                  type='password'
                  placeholder="Confirm Password"
                  name="password2"
                  value={this.state.password2}
                  onChange={this.onChangeHandler}
                  error={password2}
                />
             
                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = ({auth, errors}) => {
  return {
    auth,
    errors
  };
}

export default connect(mapStateToProps, {registerUser})(withRouter(Register));
