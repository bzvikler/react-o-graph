import React, { Component } from 'react';
import './App.css';
import Graph from './Graph';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
       <Graph />
      </div>
    );
  }
}

export default App;
