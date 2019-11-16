import React, { Component } from 'react';
import './App.css';
import Graph from './Graph';
import { sampleGraph } from './sampleGraph';

const emptyGraph = {
  "nodes": [ 
  ],
  "links": [
  ]
};

// change this if running with server
const SERVER_ON = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: (SERVER_ON ? emptyGraph : sampleGraph)
    };

    if (SERVER_ON) {
      this.eventSource = new EventSource('http://localhost:5000/graph');
    }
  }

  componentDidMount() {
    if (SERVER_ON) {
      this.eventSource.addEventListener(
        'onUpdate', (e) => this.updateGraph(JSON.parse(e.data)));
    }
  }

  updateGraph(data) {
    if (data != 'no updates') { // this is bad, change to constant later
      this.setState({data: data});
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.data.nodes.length >= 1 &&
       <Graph data={this.state.data}/>}
      </div>
    );
  }
}

export default App;
