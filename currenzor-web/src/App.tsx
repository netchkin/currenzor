import * as React from 'react'
import './App.css'
import logo from './logo.svg'

const welcomeMessage = "Enter stuff and press Convert"

interface Error { type: "error", reason: string }
interface Result { type: "result", value: string }
interface NothingYet { type: "nothing yet" }
type ResultOrError = Result | Error | NothingYet

interface ConvertorInputState {
  conversionResult: ResultOrError
  sourceCurrency: string
  targetCurrency: string
  value: string
}

const defaultConvertorInputState: ConvertorInputState = {
  conversionResult: { type: "nothing yet" },
  sourceCurrency: "CZK",
  targetCurrency: "USD",
  value: "",
}

class App extends React.Component<{}, ConvertorInputState> {
  constructor() {
    super({})
    this.state = defaultConvertorInputState
    this.tryCalculateConversion = this.tryCalculateConversion.bind(this)
  }
  
  public render() {
    const successOrLabel = (this.state.conversionResult.type === "result") ? <span>result: {this.state.conversionResult.value}</span> : (
      (this.state.conversionResult.type === "error") ? <span className="error">{this.state.conversionResult.reason}</span> : welcomeMessage
    )

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Currenzor</h1>
        </header>
        from: <input type="text" onChange={this.change.bind(this, "sourceCurrency")} />
        to: <input type="text" onChange={this.change.bind(this, "targetCurrency")}/>
        amount: <input type="text" onChange={this.change.bind(this, "value")} />
        <button onClick={this.tryCalculateConversion}>Convert</button>
        { successOrLabel }
      </div>
    )
  }

  private change(statePart: keyof(ConvertorInputState), event: React.ChangeEvent<HTMLInputElement>) {
    const stateChange = {}
    stateChange[statePart] = event.target.value
    this.setState(stateChange)
  }

  private tryCalculateConversion() {
    const { value, sourceCurrency, targetCurrency } = this.state
    fetch('/graphql', {
        body: JSON.stringify({
        query: `{ convert(value: ${value}, sourceCurrency: "${sourceCurrency}", targetCurrency: "${targetCurrency}") }`
      }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      })
        .then(res => res.json())
        .then(gql => { this.setState({ conversionResult: { type: "result", value: gql.data.convert } }) })
        // tslint:disable-next-line:no-console
        .catch(e => { console.error(e); this.setState({ conversionResult: { type: "error", reason: "Most likely invalid input" } }) })
  }
}

export default App