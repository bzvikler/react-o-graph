const express = require('express');
const app = express();

// Graph structure stored in server
var nodesToAdd = [];
var nodesToUpdate = [];
var id = 1;

// This endpoint is used by the client as an EventSource
// Client retrieves nodes to add/update/remove through this endpoint
app.get('/graph', (req, res) => {
  
  res.set({'Connection': 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'});

  if (nodesToAdd.length > 0) {
    var data = JSON.stringify(nodesToAdd);
    nodesToAdd = [];
    const msg = 'id: 1\nevent: onAdd\ndata: ' + data + '\n\n';
    res.write(msg);
  }

  if (nodesToUpdate.length > 0) {
    var data = JSON.stringify(nodesToUpdate);
    nodesToUpdate = [];
    const msg = 'id: 2\nevent: onUpdate\ndata: ' + data + '\n\n';
    res.write(msg);
  }
  
  // todo: handle remove
  
  res.end();
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
    "id": "id" + id.toString(),
    "name": nodeTypes[idx],
    "val": vals[idx],
  }

  nodesToAdd.push(node);
  id++;
  res.send("created node with id " + node.id);

  // fake update
  setTimeout(() => {
    nodesToUpdate.push(node);
  }, 4000);

})
// ========================================================

app.listen(5000, () => console.log('Server listening on port 5000!'));