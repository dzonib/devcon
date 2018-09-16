import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import errorFunc from './errorFunc';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/actions/oathActions'

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

    this.props.registerUser(newUser)

  //   try {
  //     const res = await axios.post('/api/users/register', newUser);
  //     console.log(res)
  //   } catch(e) {
  //     this.setState({errors: e.response.data})
  //   }
  }


  render() { 
    const {email, name, password, password2} = this.state.errors;

    const {user} = this.props.auth;
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
                  <div className="form-group">
                    <input
                      type="text"
                      className={classnames('form-control form-control-lg', {
                        'is-invalid': name
                      })}
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChangeHandler}
                    />
                    {errorFunc(name)}
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className={classnames('form-control form-control-lg', {
                        'is-invalid': email
                      })}
                      placeholder="Email Address"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeHandler}
                    />
                    {errorFunc(email)}
                    <small className="form-text text-muted">
                      This site uses Gravatar so if you want a profile image,
                      use a Gravatar email
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={classnames('form-control form-control-lg', {
                        'is-invalid': password2
                      })}
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangeHandler}
                    />
                    {errorFunc(password)}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={classnames('form-control form-control-lg', {
                        'is-invalid': password2
                      })}
                      placeholder="Confirm Password"
                      name="password2"
                      value={this.state.password2}
                      onChange={this.onChangeHandler}
                    />
                    {errorFunc(password2)}
                  </div>
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
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, {registerUser})(Register);
