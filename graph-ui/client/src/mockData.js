function createRandomNode(id) {
    var nodeTypes = ["ComponentA", "ComponentB", "ComponentC", "ComponentD"];
    var mockProps = [{},
    {fakeProp1: 1, fakeProp2: "hello"},
    {fakeProp1: 2, fakeProp2: "hi", fakeProp3: true},
    {fakeProp1: 3}];
    var idx = Math.floor(Math.random() * 4)

    // this is the format for the node object sent to graph-ui
    var node = { 
        "id": id,
        "name": nodeTypes[idx],
        "props": mockProps[idx],
        "state": {fakeState1: 2, fakeState2: "goodbye"},
    }
    
    return node;
}

module.exports.createRandomNode = createRandomNode;