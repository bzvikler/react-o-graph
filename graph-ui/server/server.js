const express = require('express');
const app = express();

// Graph structure stored in server
var nodes = [];
var id = 1;
var pendingUpdates = 1;

// This endpoint is used by the client as an EventSource
// Client retrieves tree structure through this endpoint
app.get('/graph', (req, res) => {
  
  res.set({'Connection': 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'});

  if (pendingUpdates >= 1) {
    var graph = {
      "nodes": nodes,
      "links": []
    }
    var data = JSON.stringify(graph);
    const msg = 'id: 1\nevent: onUpdate\ndata: ' + data + '\n\n';
    pendingUpdates--;
    res.send(msg);
  }
  else {
    res.send('no updates');
  }
});

// TODO: add endpoints for analysis API here!

// ==================================================
// this endpoint is for UI testing purposes only!!
// it's bad and hacky so dont ask me about it - susan
app.get('/addRandomNode', (req, res) => {
  res.set({'Access-Control-Allow-Origin': '*'});
  // add node
  var nodeTypes = ["a", "b", "c", "d"];
  var vals = [1, 4, 2, 6];
  var idx = Math.floor(Math.random() * 4)

  var node = { 
    "id": id.toString(),
    "name": nodeTypes[idx],
    "val": vals[idx],
    "cycle": 0,
  }

  nodes.push(node);
  id++;
  pendingUpdates++;
  res.send(nodes.length.toString());
})
// ========================================================

app.listen(5000, () => console.log('Server listening on port 5000!'));