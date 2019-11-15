import React, { Component } from 'react';
import './App.css';
import Tree from './Tree';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        "nodes": [ 
        ],
        "links": [
        ]
      }
    };

    this.eventSource = new EventSource('http://localhost:5000/graph');
  }

  componentDidMount() {
    this.eventSource.addEventListener(
      'onUpdate', (e) => this.updateGraph(JSON.parse(e.data)));
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
       <Tree data={this.state.data}/>
      </div>
    );
  }
}

export default App;
