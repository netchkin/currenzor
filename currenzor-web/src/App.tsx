import * as React from 'react';
import './App.css';

import logo from './logo.svg';

class App extends React.Component<{}, {users: string[]}> {
  constructor() {
    super({})
    this.state = { users: [] }
  }

  public componentDidMount() {
    fetch('/graphql', {
      body: JSON.stringify({
        query: '{ users }'
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
      .then(res => res.json())
      .then(gql => {
        this.setState({ users: gql.data.users })
      })
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Users via rest</h1>
        </header>
        {this.state.users.map(u => <div key={u}>{u}</div>)}
      </div>
    )
  }
}

export default App
