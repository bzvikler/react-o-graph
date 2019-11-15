# Graph UI Server Application

The project consists of two applications:

- a React application (the client)
- a Node.js application (the server)

Run the server by opening a command window and typing the following command in the `server` folder:

```shell
node server.js
```

Run the client by opening a command window and typing the following commands in the `client` folder:

```shell
npm install
npm start
```

# Testing UI with mock data

- repeatedly call endpoint http://localhost:5000/addRandomNode to add random nodes to the graph
- have http://localhost:3000 open in a separate window, watch the graph change

# Data format
- input to force graph UI is a an object of nodes and links, eg: 
```js
const myData = {
  "nodes": [ 
      { 
        "id": "id1",
        "name": "Menu",
        "desc": "root",
        "val": 3,
      },
      { 
        "id": "id2",
        "name": "MenuItem",
        "val": 1
      },
      { 
        "id": "id3",
        "name": "MenuItem",
        "val": 1
      },
      { 
        "id": "id4",
        "name": "MenuItem",
        "val": 1
      },
      { 
        "id": "id5",
        "name": "Button",
        "val": 1
      },
      { 
        "id": "id6",
        "name": "Button",
        "val": 1 
      }
  ],
  "links": [
      {
          "source": "id1",
          "target": "id2"
      },
      {
        "source": "id1",
        "target": "id3"
      },
      {
        "source": "id1",
        "target": "id4"
      },
      {
        "source": "id4",
        "target": "id5"
      },
      {
        "source": "id4",
        "target": "id6"
      },
  ]
}
```

