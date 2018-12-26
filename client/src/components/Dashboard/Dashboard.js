import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentProfile, deleteAccount} from '../../redux/actions/profileActions'
import Spinner from '../common/Spinner'
import ProfileActions from './ProfileActions'
import Experience from './Experience'
import Education from './Education';


class Dashboard extends Component {

  state = {
    change: false
  }

  componentDidMount() {
    this.props.getCurrentProfile()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.auth.isAuthenticated) {
        return {
          change: true
        }
    }
    return {
      change: false
    }
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    if (this.state.change) {
      this.props.history.push('/login')
    }

    

    const {user} = this.props.auth
    const {profile, loading} = this.props.profile

    let dashboardContent;

    if (profile === null || loading === true) {
      dashboardContent = <Spinner />
    } else {
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome <Link 
              to={`/profile/${profile.handle}`}>{user.name}</Link></p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div style={{ marginBottom: '60px' }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account
            </button>
          </div>
        )
      } else {
        // user is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>

          </div>
        )
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row"><div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            {dashboardContent}
          </div></div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    profile: state.profile,
    auth: state.auth
  }
}
export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)