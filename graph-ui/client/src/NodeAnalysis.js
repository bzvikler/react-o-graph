import React from 'react';
import NodeViewer from './NodeViewer';


// Holds internal map of node id --> node details
// passes analysis details to NodeViewer for currently selected nodes

// Props:
// this.props.showDetails : true if node is selected, renders NodeViewer
// this.props.activeNodeId : the current node to display in NodeViewer
// this.props.nodes : an array of the current node objects displayed in the graph, which
// changes upon graph updates
class AnalyzedNode {
    propHistory = [];
    stateHistory = [];
    updateTimes = [];
    stateRenders = 0;
    propRenders = 0;
    creationTime = 0;
    children = 0;
    name = "";

    constructor(id) {
        this.id = id;
    }
}
// NADA - THIS IS FOR YOU
export default class NodeAnalysis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nodes: props.nodes, // original format of nodes received
            renderStats: {},
            // hashmap of nodeId->details ; this is populated from this.props.nodes
            analyzedNodes: new Map(),
        }

        for (let n of this.props.nodes) {
            if (!this.state.analyzedNodes.has(n.id)) {
                this.createAnalyzedNode(n);
            } else {
                this.updateAnalyzedNode(n);
            }
        }
        this.updateRenderStats();
    }

    componentWillUpdate() {
        console.log("Node Analysis Updating");
        debugger;
        for (let n of this.props.nodes) {
            if (!this.state.analyzedNodes.has(n.id)) {
                this.createAnalyzedNode(n);
            } else {
                this.updateAnalyzedNode(n);
            }
        }
        this.updateRenderStats();
    }

    // Looks at all the nodes and calculates the node that is being render the most
    updateRenderStats() {
        const nodeRenderStats = {};
        
        for (var [key, value] of this.state.analyzedNodes.entries()) {
            nodeRenderStats[key] = value.propRenders + value.stateRenders;
        }
        this.state.renderStats = nodeRenderStats;
    }

    createAnalyzedNode(node) {
        console.log("Creating: " + node.id);
        const a = new AnalyzedNode(node.id);
        this.addHistory(a.propHistory, this.copy(node.props));
        this.addHistory(a.stateHistory, this.copy(node.state));
        this.addHistory(a.updateTimes, node.lastUpdated);
        a.creationTime = node.creationTime;
        a.name = node.name;
        this.state.analyzedNodes.set(node.id, a);
    }

    updateAnalyzedNode(pNode) {
        let node = this.state.analyzedNodes.get(pNode.id);
        if (!this.isEqualObj(this.peek(node.propHistory),pNode.props)) {
            this.addHistory(node.propHistory, this.copy(pNode.props));
            node.propRenders++;
        }
        if (!this.isEqualObj(this.peek(node.stateHistory), pNode.state)) {
            this.addHistory(node.stateHistory, this.copy(pNode.state));
            node.stateRenders++;
        }
        if (this.peek(node.updateTimes) !== pNode.lastUpdated) {
            this.addHistory(node.updateTimes, pNode.lastUpdated);
        }
        this.state.analyzedNodes.set(pNode.id, node);
    }

    peek(queue) {
        return queue[queue.length - 1];
    }

    copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    isEqualObj(obj1, obj2) {
        return (JSON.stringify(obj1) === JSON.stringify(obj2));
    }

    // Pushes max 5 things to history
    addHistory(list, element) {
        list.push(element);
        while(list.length > 5) {
            list.shift();
        }
    }
    
    render() {
        return (
            this.props.showDetails &&
            <NodeViewer 
            node={this.state.analyzedNodes.get(this.props.activeNodeId)}
            renderStats={this.state.renderStats}
            />
        );
    }
}