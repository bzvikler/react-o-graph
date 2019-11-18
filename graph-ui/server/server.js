const express = require('express');
const app = express();
const mockData = require('../client/src/mockData');

// Graph structure stored in server
var nodesToAdd = [];
var nodesToUpdate = [];
var nodesToRemove = [];
var id = 1;

// =========== SERVER ENDPOINTS =============

app.post('/addNode', (req, res) => {
  // TODO: (Nick)
  // req.body will contain node object to add
  // add this object to nodesToAdd
});

app.post('/updateNode', (req, res) => {
  // TODO: (Nick)
  // req.body will contain node object to update
  // add this object to nodesToUpdate
});

app.post('/removeNode', (req, res) => {
  // TODO: (Nick)
  // req.body will contain node object to delete
  // add this object to nodesToDelete
});

// ========= ENDPOINT(S) FOR SERVER-SENT EVENTS =============

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
  
  if (nodesToRemove.length > 0) {
    var data = JSON.stringify(nodesToRemove);
    nodesToRemove = [];
    const msg = 'id: 2\nevent: onRemove\ndata: ' + data + '\n\n';
    res.write(msg);
  }

  res.end();
});

// TODO: add endpoints for analysis API here!

// ==================================================
// this endpoint is for UI testing purposes only!!
// it's bad and hacky so dont ask me about it - susan
app.get('/addRandomNode', (req, res) => {
  res.set({'Access-Control-Allow-Origin': '*'});
 
  let nodeId = "s_id" + id.toString();
  id++;
  node = mockData.createRandomNode(nodeId);
  nodesToAdd.push(node);
  res.send("created node with id " + node.id);

  // fake update
  setTimeout(() => {
    node.state.fakeState1 = 10;
    nodesToUpdate.push(node);
  }, 4000);

})
// ========================================================

app.listen(5000, () => console.log('Server listening on port 5000!'));