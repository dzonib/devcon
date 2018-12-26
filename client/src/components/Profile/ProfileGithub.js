import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ProfileGithub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clientId: 'f5e2b8e4a426ad3f97ae',
      clientSecret: '27c35490a4bf172b02e70f9dac14b638a1ad8de5 ',
      count: 5,
      sort: 'created: asc',
      repos: []
    }
  }

  async componentDidMount() {
    try {
      const {username} = this.props
      const {count, sort, clientId, clientSecret} = this.state

      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      const data = await res.json()
      if (this.refs.myRef) {
        this.setState({repos: data})
      }
    } catch (e) {
      console.log(e)
    }
  }
  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
            <a href={repo.html_url} className="text-info">{repo.name}</a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

export default ProfileGithub