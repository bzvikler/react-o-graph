const express = require('express');
const cors = require('cors');
const app = express();
const mockData = require('../client/src/mockData');

// Graph structure stored in server
var nodesToAdd = [];
var nodesToUpdate = [];
var nodesToRemove = [];
var id = 1;
var sid = 1;

app.use(cors());
app.use(express.json());

// =========== SERVER ENDPOINTS =============

app.post('/addNode', (req, res) => {
  nodesToAdd.push(req.body.node);
  res.send('POST request to add the node')
});

app.post('/updateNode', (req, res) => {
  nodesToUpdate.push(req.body.node);
  res.send('POST request to update the node')
});
app.post('/removeNode', (req, res) => {
  nodesToRemove.push(req.body.node);
  res.send('POST request to remove the node')
});

// ========= ENDPOINT(S) FOR SERVER-SENT EVENTS =============

// This endpoint is used by the client as an EventSource// Client retrieves nodes to add/update/remove through this endpoint
app.get('/graph', (req, res) => {

  res.set({
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  sendEvents(res);

});

function sendEvents(res) {
  if (nodesToAdd.length > 0) {
    var data = JSON.stringify(nodesToAdd);
    nodesToAdd = [];
    const msg = 'id: '+ id + '\nevent: onAdd\ndata: ' + data + '\n\n';
    id++;
    res.write(msg);
  }

  if (nodesToUpdate.length > 0) {
    var data = JSON.stringify(nodesToUpdate);
    nodesToUpdate = [];
    const msg = 'id: '+ id + '\nevent: onUpdate\ndata: ' + data + '\n\n';
    id++;
    res.write(msg);
  }

  if (nodesToRemove.length > 0) {
    var data = JSON.stringify(nodesToRemove);
    nodesToRemove = [];
    const msg = 'id: '+ id + '\nevent: onRemove\ndata: ' + data + '\n\n';
    id++;
    res.write(msg);
  }
  
  setTimeout(() => sendEvents(res), 1000);
}

// ==================================================
// this endpoint is for UI testing purposes only!!
// it's bad and hacky so dont ask me about it - susan
app.get('/addRandomNode', (req, res) => {
  res.set({ 'Access-Control-Allow-Origin': '*' });

  let nodeId = "s_id" + sid.toString();
  sid++;
  let node = mockData.createRandomNode(nodeId);
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
