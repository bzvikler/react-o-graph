import React, { createRef, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import NodeDetails from './NodeDetails';
import { sampleGraph, emptyGraph } from './sampleGraph';
import { forceCollide } from 'd3-force';

// Graph of nodes, each representing a component
// nodes are coloured based on component type
// nodes are sized based on number of prop types for component
// halo around node if updated in last cycle
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
            currentCycle: 0, // represents # updates received
        }

        if (SERVER_ON) {
            this.eventSource = new EventSource('http://localhost:5000/graph');
        }
        
        this.fgRef = createRef();
        this.addAnimation = this.addAnimation.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickaway = this.handleClickaway.bind(this);
        this.updateGraph = this.updateGraph.bind(this);
        this.paintRing = this.paintRing.bind(this);

        // testing functions
        this.updateNode = this.updateNode.bind(this);
        this.updateRandNode = this.updateRandNode.bind(this);
    }

    componentDidMount() {
        if (SERVER_ON) {
            this.eventSource.addEventListener(
              'onUpdate', (e) => this.updateGraph(JSON.parse(e.data)));
        }
        this.addAnimation();
    }

    updateGraph(data) {
        if (data != 'no updates') { // this is bad, change to constant later
          this.setState({data: data}, () => {
              this.addAnimation();
          });
        }
    }

    paintRing(node, ctx) {
        // add ring just for highlighted nodes
        let NODE_R = Math.sqrt(node.val) * 4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R + 3, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.6
        ctx.stroke();

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
        this.setState({data: data});
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

    // ========== TESTING FUNCTIONS ============
    // updates node with id, updating record by increasing cycle count
    // if node not found, nothing happens
    updateNode(id) {
        let nodes = this.state.data.nodes;
        let nextCycle = this.state.currentCycle + 1;
        for (let node of nodes) {
            if (node.id === id) {
                node.cycle = nextCycle;
            }
        }
        let data = this.state.data;
        data.nodes = nodes;
        this.setState({
            data: data,
            currentCycle: nextCycle
        })
    }

    updateRandNode() {
        let nodes = this.state.data.nodes;
        let idx = Math.floor(Math.random() * nodes.length);
        let id = this.state.data.nodes[idx].id;
        this.updateNode(id);
    }

    // ========== END TESTING FUNCTIONS ============
    
    render() {
        let highlightNodes = this.state.data.nodes.filter(n => n.cycle == this.state.currentCycle);
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
            <span hidden={this.state.data.nodes.length == 0} 
            className="button" onClick={this.updateRandNode}>mock update</span>
            </div>

            {this.state.showDetails && 
            <NodeDetails 
            node={this.state.data.nodes.filter(n => n.id === this.state.id)[0]} />}
            </div>
        );
    }
}
