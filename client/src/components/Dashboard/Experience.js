import React, { Component } from 'react'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { deleteExperience } from '../../redux/actions/profileActions'

class Experience extends Component {
  render() {
    const experience = this.props.experience.map( exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="DD/MM/YYYY">
            {exp.from}
          </Moment> -
          {exp.to === null ? ' Now' :
          <Moment format=" DD/MM/YYYY">
            {exp.to}
          </Moment>}
        </td>
        <td><button className="btn btn-danger" 
          onClick={() => this.props.deleteExperience(exp._id, this.props.history)}>Delete</button></td>
      </tr>
    ))
    return (
      <div className="">
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Years</th>
            <th></th>
          </tr>
            {experience}
          </thead>
        </table>
      </div>
    )
  }
}


export default connect(null, {deleteExperience})(Experience)