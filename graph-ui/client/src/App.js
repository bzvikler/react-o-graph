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
const SERVER_ON = false;

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
    console.log(data);
    if (data != '') {
      this.setState({data: data});
    }
  }

  render() {
    return (
      <div className="App">
       <Graph data={this.state.data}/>
      </div>
    );
  }
}

export default App;
