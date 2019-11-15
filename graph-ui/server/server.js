const express = require('express');
const app = express();

// Graph structure stored in server
var nodes = [];
var edges = [];
var id = 1;
var pendingUpdates = false;

// This endpoint is used by the client as an EventSource
// Client retrieves tree structure through this endpoint
app.get('/graph', (req, res) => {
  
  res.set({'Connection': 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'});

  if (pendingUpdates) {
    var graph = {
      "nodes": nodes,
      "links": edges
    }
    var data = JSON.stringify(graph);
    const msg = 'id: 1\nevent: onUpdate\ndata: ' + data + '\n\n';
    pendingUpdates = false;
    res.send(msg);
  }
  else {
    res.send('');
  }
});

// TODO: add endpoints for analysis API here!

// ==================================================
// this endpoint is for UI testing purposes only!!
// it's bad and hacky so dont ask me about it - susan
app.get('/addRandomNode', (req, res) => {
  // add node
  var node = { 
    "id": id.toString(),
    "name": "node",
    "val": 1
  }
  // add edge
  var edge = null;
  if (nodes.length > 0) {
    var node2 = nodes[Math.floor(Math.random()*nodes.length)];
    edge = {
      "source": node2.id,
      "target": id.toString(),
    }
    edges.push(edge);
  }

  nodes.push(node);
  id++;
  pendingUpdates = true;
  res.send(nodes.length.toString());
})
// ========================================================

app.listen(5000, () => console.log('Server listening on port 5000!'));