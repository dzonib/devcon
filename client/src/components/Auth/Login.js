import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {loginUser} from '../../redux/actions/authActions'
import TextFieldGroup from '../common/TextFieldGroups'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.onChangeHandler = this
      .onChangeHandler
      .bind(this)
    this.onSubmitHandler = this
      .onSubmitHandler
      .bind(this)
  }

  onChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmitHandler(e) {
    e.preventDefault()
    const {email, password} = this.state;

    const user = {
      email,
      password
    }

    this
      .props
      .loginUser(user)
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this
        .props
        .history
        .push('/dashboard')
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      nextProps
        .history
        .push('/dashboard')
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
                <TextFieldGroup
                  type='email'
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChangeHandler}
                  error={email}
                  />
                <TextFieldGroup
                  type='password'
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChangeHandler}
                  error={password}
                  />
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
  return {auth: state.auth, errors: state.errors}
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

export default connect(mapStateToProps, {loginUser})(Login)