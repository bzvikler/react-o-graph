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
- Node object is as follows: (this is passed in the HTTP POST request body)
```js
const myNode = { 
  "id": "abcde12345",     // unique ID for component
  "name": "MyComponent",  // component name
  "props": {              // component props
    myProp1: "hello",
    myProp2: 5,
  },
  "state": {              // component state
    myState1: "dog",
    myState2: 400,
  }
}
```

