import * as React from 'react';
import './App.css';

import logo from './logo.svg';

class App extends React.Component<{}, {users: string[], foundUsers: string[]}> {
  constructor() {
    super({})
    this.state = { users: [], foundUsers: [] }
  }

  public componentDidMount() {
    fetch('/graphql', {
      body: JSON.stringify({
        query: '{ users, search(namePart: "a") }'
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
      .then(res => res.json())
      .then(gql => {
        this.setState({ users: gql.data.users, foundUsers: gql.data.search })
      })
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Users via GraphQL</h1>
        </header>
        {this.state.users.map(u => <div key={u}>{u}</div>)}
        <h2>found</h2>
        {this.state.foundUsers.map(u => <div key={u}>{u}</div>)}
      </div>
    )
  }
}

export default App
