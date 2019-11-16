import React, { createRef, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import NodeDetails from './NodeDetails';
import { sampleGraph, emptyGraph } from './sampleGraph';
import { forceCollide } from 'd3-force';

// Graph of nodes, each representing a component
// nodes are coloured based on component type
// nodes are sized based on number of prop types for component
// halo around node if updated/added last
// clicking on node will open expanded view for specific component

// change this if running with server
const SERVER_ON = true;

const background = "#344152";

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // state for currently selected node
            data: (SERVER_ON ? emptyGraph : sampleGraph),
            showDetails: false,
            name: "",
            id: "",
            val: "",
            motionOn: true,
            currentTime: 0, // represents # graph updates received
        }

        if (SERVER_ON) {
            this.eventSource = new EventSource('http://localhost:5000/graph');
        }
        
        this.fgRef = createRef();
        this.addAnimation = this.addAnimation.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickaway = this.handleClickaway.bind(this);
        this.addNodes = this.addNodes.bind(this);
        this.paintRing = this.paintRing.bind(this);
        this.paintUpdate = this.paintUpdate.bind(this);
        this.paintAdd = this.paintAdd.bind(this);
        this.paintSelect = this.paintSelect.bind(this);
        this.getHighlightedNodes = this.getHighlightedNodes.bind(this);
        this.toggleMotion = this.toggleMotion.bind(this);

        // testing functions
        this.updateNode = this.updateNode.bind(this);
        this.updateRandNode = this.updateRandNode.bind(this);
        this.mockAdd = this.mockAdd.bind(this);
    }

    componentDidMount() {
        if (SERVER_ON) {
            this.eventSource.addEventListener(
              'onAdd', (e) => this.addNodes(JSON.parse(e.data)));
        }
        this.addAnimation();
    }

    addNodes(nodes) {
        if (nodes.length > 0) {
            let newTime = this.state.currentTime + 1;

            // for some reason `data` needs to be a new object,
            // or else new nodes are unclickable
            let data = JSON.parse(JSON.stringify(this.state.data));

            for (let n of nodes) {
                n.creationTime = newTime;
                n.lastUpdated = newTime;
                data.nodes.push(n);
            }
            this.setState({
                data: data,
                currentTime: newTime
            }, () => {
              this.addAnimation();
          });
        }
    }

    paintRing(node, ctx) {
        if (node.creationTime == this.state.currentTime) {
            this.paintAdd(node, ctx);
        }
        else if (node.lastUpdated == this.state.currentTime) {
            this.paintUpdate(node, ctx);
        }

        if (node.id == this.state.id) {
            this.paintSelect(node, ctx);
        }
    }

    // draw double outline
    paintAdd(node, ctx) {
        const NODE_R = Math.sqrt(node.val) * 4;
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.6;
        ctx.arc(node.x, node.y, NODE_R + 3, 0, 2 * Math.PI, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R + 6, 0, 2 * Math.PI, false);
        ctx.stroke();

    }

    // draw single red outline
    paintUpdate(node, ctx) {
        const NODE_R = Math.sqrt(node.val) * 4;
        ctx.beginPath();
        ctx.strokeStyle = '#ff5959';
        ctx.lineWidth = 1.5;
        ctx.arc(node.x, node.y, NODE_R + 3, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    paintSelect(node, ctx) {
        const NODE_R = Math.sqrt(node.val) * 4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R + 6, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fill();
    }

    addAnimation() {
        let data = this.state.data;
        if (data.nodes.length == 0) return;
        const fg = this.fgRef.current;
        // Deactivate existing forces
        fg.d3Force('center', null);
        fg.d3Force('charge', null);
        // Add collision and bounding box forces
        fg.d3Force('collide', forceCollide(4));

        fg.d3Force('box', () => {
            const N = this.state.data.nodes.length; // box size
            const SQUARE_HALF_SIDE = N * 4;
            data.nodes.forEach(node => {
            const x = node.x || 0, y = node.y || 0;
            // bounce on box walls
            if (Math.abs(x) > SQUARE_HALF_SIDE) { node.vx *= -1; }
            if (Math.abs(y) > SQUARE_HALF_SIDE) { node.vy *= -1; }
            });
        });

        // set velocity of data
        for (let node of data.nodes) {
            // Initial velocity in random direction
            node.vx = 0.25*((Math.random() * 2) - 1);
            node.vy = 0.25*((Math.random() * 2) - 1);
        }
        this.setState({data: data, motionOn: true});
    }

    handleClick(node, event) {
        node.nodeColor = "green"
        this.setState({
            showDetails: true,
            name: node.name,
            id: node.id,
            val: node.val})
    }

    handleClickaway(event) {
        this.setState({
            showDetails: false,
            name: null,
            id: null,
            val: null})
    }

    getHighlightedNodes() {
        return this.state.data.nodes.filter(n => 
            n.creationTime == this.state.currentTime ||
            n.lastUpdated == this.state.currentTime ||
            n.id == this.state.id)
    }

    toggleMotion() {
        let data = this.state.data;
        if (this.state.motionOn) {
            // Deactivate existing forces
            const fg = this.fgRef.current;
            fg.d3Force('center', null);
            fg.d3Force('charge', null);
            fg.d3Force('collide', null);
            fg.d3Force('box', null);

            for (let node of data.nodes) {
                node.vx = 0;
                node.vy = 0;
            }
            this.setState({data: data, motionOn: false});
        }
        else {
            // start
            this.addAnimation();
        }
    }

    // ========== TESTING FUNCTIONS ============
    // updates node with id, updating record by increasing time count
    // if node not found, nothing happens
    updateNode(id) {
        let nodes = this.state.data.nodes;
        let newTime = this.state.currentTime + 1;
        for (let node of nodes) {
            if (node.id === id) {
                node.lastUpdated = newTime;
            }
        }
        let data = this.state.data;
        data.nodes = nodes;
        this.setState({
            data: data,
            currentTime: newTime
        })
    }

    updateRandNode() {
        let nodes = this.state.data.nodes;
        let idx = Math.floor(Math.random() * nodes.length);
        let id = this.state.data.nodes[idx].id;
        this.updateNode(id);
    }

    mockAdd() {
        var nodeTypes = ["a", "b", "c", "d"];
        var vals = [1, 4, 2, 6];
        var idx = Math.floor(Math.random() * 4)
        let newTime = this.state.currentTime + 1;

        var node = { 
            "id": "mockid" + newTime.toString(),
            "name": nodeTypes[idx],
            "val": vals[idx],
        }
        
        this.addNodes([node]);
    }

    // ========== END TESTING FUNCTIONS ============
    
    render() {
        let highlightNodes = this.getHighlightedNodes();
        return (
            <div>
            {this.state.data.nodes.length >= 1 ?
            <ForceGraph2D
            ref={this.fgRef}
            graphData={this.state.data}
            nodeAutoColorBy={d => d.name}
            onNodeClick={this.handleClick}
            onBackgroundClick={this.handleClickaway}
            cooldownTime={Infinity}
            d3AlphaDecay={0}
            d3VelocityDecay={0}
            nodeCanvasObjectMode={node => highlightNodes.indexOf(node) !== -1 ? 'before' : undefined}
            nodeCanvasObject={this.paintRing}
            /> :
            <div className="placeholder">Waiting for updates...</div>}

            <div className="updateButton">
            <span
            className="button" onClick={this.mockAdd}>mock add</span>
            <span hidden={this.state.data.nodes.length == 0} 
            className="button" onClick={this.updateRandNode}>mock update</span>
            <span hidden={this.state.data.nodes.length == 0} 
            className="button" onClick={this.toggleMotion}>motion: {this.state.motionOn? "on" : "off"}</span>
            </div>

            {this.state.showDetails && 
            <NodeDetails 
            node={this.state.data.nodes.filter(n => n.id === this.state.id)[0]} />}
            </div>
        );
    }
}
