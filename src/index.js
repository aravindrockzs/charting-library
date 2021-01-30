import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Chart from './chart/chart.component'



class App extends Component {
  render() {
    return (
      <>
        <Chart />
      </>

    )
  }
}


ReactDOM.render(<App />, document.getElementById('root'))

