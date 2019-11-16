import React, { createRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import NodeDetails from './NodeDetails';
import { forceCollide } from 'd3-force';

// Graph of nodes, each representing a component
// nodes are coloured based on component type
// nodes are sized based on number of prop types for component
// halo around node if updated in last cycle
// clicking on node will open expanded view for specific component

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // state for currently selected node
            data: props.data,
            showDetails: false,
            name: "",
            id: "",
            val: "",
            currentCycle: 0, // represents # updates received
        }
        this.fgRef = createRef();
        this.addAnimation = this.addAnimation.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickaway = this.handleClickaway.bind(this);

        // testing functions
        this.updateNode = this.updateNode.bind(this);
    }

    componentDidMount() {
        this.addAnimation();
    }

    componentWillUpdate(nextProps) {
        let newNodes = JSON.stringify(nextProps.data.nodes.map(n => n.id));
        let currentNodes = JSON.stringify(this.state.data.nodes.map(n => n.id));
        console.log(newNodes == currentNodes);
        if (newNodes !== currentNodes) {
            this.setState({data: nextProps.data}, () => {
                this.addAnimation();
            })
        }
    }

    addAnimation() {
        const fg = this.fgRef.current;
        // Deactivate existing forces
        fg.d3Force('center', null);
        fg.d3Force('charge', null);
        // Add collision and bounding box forces
        fg.d3Force('collide', forceCollide(4));

        let data = this.state.data;
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

    // FOR TESTING
    // updates node with id, updating record by increasing cycle count
    // if node not found, nothing happens
    updateNode(id) {
        let nodes = this.state.data.nodes;
        let cycle = this.state.currentCycle;
        for (let node of nodes) {
            if (node.id === id) {
                node.cycle = node.cycle + 1;
            }
        }
        let data = this.state.data;
        data.nodes = nodes;
        this.setState({
            data: data,
            currentCycle: cycle + 1
        })
    }
    
    render() {
        return (
            <div>
            {this.state.data.nodes.length > 0?
            <ForceGraph2D
            ref={this.fgRef}
            graphData={this.state.data}
            nodeAutoColorBy={d => d.name}
            onNodeClick={this.handleClick}
            onBackgroundClick={this.handleClickaway}
            cooldownTime={Infinity}
            d3AlphaDecay={0}
            d3VelocityDecay={0}
            /> :
            <div> Graph is empty! </div>
            }

            <button onClick={() => this.updateNode("id1")}>update</button>

            {this.state.showDetails && 
            <NodeDetails 
            node={this.state.data.nodes.filter(n => n.id === this.state.id)[0]} />}
            </div>
        );
    }
}
