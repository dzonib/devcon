import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {loginUser} from '../../redux/actions/oathActions';
import classnames from 'classnames'
import errorFunc from './errorFunc';


class Login extends Component {
  constructor() {
    super();
    this.state={
      email: '',
      password: '',
      errors: {}
    }

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChangeHandler(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmitHandler(e) {
    e.preventDefault();
    const {email, password} = this.state;
  
    const user = {
      email, password
    }

    this.props.loginUser(user);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      nextProps.history.push('/dashboard')
    }

    if (nextProps.errors) {
      return {errors: nextProps.errors}
    }
  }

  render() {
    const {email, password} = this.state.errors;
    
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form onSubmit={this.onSubmitHandler}>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': email
                      })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.value}
                    onChange={this.onChangeHandler}
                    />
                    {errorFunc(email)}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': password
                      })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangeHandler}
                    />
                    {errorFunc(password)}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

export default connect(mapStateToProps, {loginUser})(Login)