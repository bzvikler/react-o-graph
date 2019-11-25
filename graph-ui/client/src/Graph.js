import React, { createRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import NodeAnalysis from './NodeAnalysis';
import { forceCollide, forceManyBody, forceCenter, forceX, forceY } from 'd3-force';
import { createRandomNode } from './mockData';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import DoughnutChart from './DoughnutChart';

// Graph of nodes, each representing a component
// nodes are coloured based on component type
// nodes are sized based on number of prop types for component
// halo around node if updated/added last
// clicking on node will open expanded view for specific component

// change this if running with server
const SERVER_ON = true;

const emptyGraph = {
    "nodes": [ 
    ],
    "links": [
    ]
  };

// for mock add
var fakeId = 1;

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // state for currently selected node
            data: emptyGraph,
            showDetails: false,
            id: "",
            forceOn: true,
            showMockButtons: false,
            isPaneOpen: false,
            isPaneOpenLeft: false,
        }

        if (SERVER_ON) {
            this.eventSource = new EventSource('http://localhost:5000/graph');
        }

        this.fgRef = createRef();
        this.addAnimation = this.addAnimation.bind(this);

        this.handleClick = this.handleClick.bind(this);
        this.handleClickaway = this.handleClickaway.bind(this);
        this.toggleForce = this.toggleForce.bind(this);

        this.addNodes = this.addNodes.bind(this);
        this.updateNodes = this.updateNodes.bind(this);
        this.removeNodes = this.removeNodes.bind(this);

        this.paintRing = this.paintRing.bind(this);
        this.paintUpdate = this.paintUpdate.bind(this);
        this.paintAdd = this.paintAdd.bind(this);
        this.paintSelect = this.paintSelect.bind(this);
        this.getNodeName = this.getNodeName.bind(this);
        this.findNodeName = this.findNodeName.bind(this);
        this.buildDoughnutDataObject = this.buildDoughnutDataObject.bind(this);
        
        // testing functions
        this.mockUpdate = this.mockUpdate.bind(this);
        this.mockAdd = this.mockAdd.bind(this);
        this.mockRemove = this.mockRemove.bind(this);
    }

    componentDidMount() {
        // TODO: use commented version when implementation is done!
        // if (this.getUrlParam("testMode", "") === "true") {
        
        if (this.getUrlParam("testMode", "") === "") {
            this.setState({showMockButtons: true});
        }
        if (SERVER_ON) {
            this.eventSource.addEventListener(
                'onAdd', (e) => this.addNodes(JSON.parse(e.data)));
            this.eventSource.addEventListener(
                'onUpdate', (e) => this.updateNodes(JSON.parse(e.data)));
            this.eventSource.addEventListener(
                'onRemove', (e) => this.removeNodes(JSON.parse(e.data)));
        }
        this.addAnimation();
    }
    
    getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
    
    getUrlParam(parameter, defaultvalue){
        var urlparameter = defaultvalue;
        if(window.location.href.indexOf(parameter) > -1){
            urlparameter = this.getUrlVars()[parameter];
        }
        return urlparameter;
    }
    
    addNodes(nodes) {
        if (nodes.length > 0) {
            let time = new Date();
            let data = {...this.state.data};
            
            for (let n of nodes) {
                // add additional data: creation/update time, node value
                n.creationTime = time;
                n.lastUpdated = time;
                // value of node is 1 + # props
                n.val = Object.keys(n.props).length + 1;
                data.nodes.push(n);
            }
            this.setState({
                data: data,
            }, () => {
                this.addAnimation();
            });
        }
    }
    
    getNodeName(node) {
        console.log(node.id === this.state.id);
        return node.id === this.state.id
        // this.state.data.nodes
    }

    findNodeName() {
        let node = this.state.data.nodes.find(this.getNodeName)
        return node && node.name;
    }

    buildDoughnutDataObject() {
        console.log("building doughnut data")
        let nodeNameMap = {};

        let data = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: [],
            }],
        }

        for (let node of this.state.data.nodes) {
            if (node.name in nodeNameMap) {
                nodeNameMap[node.name].count += 1;
            } else {
                nodeNameMap[node.name] = { count: 1, color: node.color };
            }
        }

        let keys = Object.keys(nodeNameMap);
        let values = Object.values(nodeNameMap);

        data.labels = keys;

        for (let entry of values) {
            data.datasets[0].data.push(entry.count);
            data.datasets[0].backgroundColor.push(entry.color);
            data.datasets[0].hoverBackgroundColor.push(entry.color);
        }

        console.log(data);
        return data;
    }

    updateNodes(updated) {
        let nodes = this.state.data.nodes;
        let time = new Date();
        for (let u of updated) {
            let idx = nodes.findIndex(n => n.id === u.id);
            if (idx < 0) return;
            let node = nodes[idx];
            // update props, state, val, and update time
            node.val = Object.keys(u.props).length + 1;
            node.props = u.props;
            node.state = u.state;
            node.lastUpdated = time;
        }

        let data = {...this.state.data};
        data.nodes = nodes;
        this.setState({
            data: data,
        }, () => {
          this.addAnimation();
        });
    }

    removeNodes(removed) {
        let nodes = this.state.data.nodes;
        for (let r of removed) {
            let idx = nodes.findIndex((n) => n.id === r.id);
            nodes.splice(idx, 1);
        }
        let data = {...this.state.data};
        data.nodes = nodes;
        this.setState({
            data: data,
        }, () => {
          this.addAnimation();
        });
    }

    paintRing(node, ctx) {
        // paint translucent fill over currently selected node
        if (node.id === this.state.id) {
            this.paintSelect(node, ctx);
        }

        let currentTime = new Date();
        
        // highlight node if created/updated within last 2 seconds, or if selected
        const diff = 2000;
        // Calculate the difference in milliseconds
        const cDiff = Math.abs(currentTime - node.creationTime);
        const uDiff = Math.abs(currentTime - node.lastUpdated);
        
        if (cDiff < diff) {
            if (node.lastUpdated > node.creationTime) {
                this.paintUpdate(node, ctx);
            }
            else this.paintAdd(node, ctx);
            return;
        }
        else if (uDiff < diff) {
            this.paintUpdate(node, ctx);
            return;
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
        const num = data.nodes.length;
        if (num === 0) return;
        const fg = this.fgRef.current;
        fg.d3Force('charge', forceManyBody().strength(0));
        fg.d3Force('center', forceCenter());
        fg.d3Force('x', forceX().strength(0.3/num));
        fg.d3Force('y', forceY().strength(0.3/num));
        fg.d3Force('collide', forceCollide().radius(function(node) {
            const NODE_R = Math.sqrt(node.val) * 4;
            return (NODE_R + 6) * 1.2;
          }))
        this.setState({forceOn: true});
    }

    handleClick(node, event) {
        node.nodeColor = "green"
        this.setState({
            showDetails: true,
            id: node.id,
            isPaneOpen: true});
    }

    handleClickaway(event) {
        this.setState({
            showDetails: false,
            id: null,
            isPaneOpen: false
        });
    }

    toggleForce() {
        let data = this.state.data;
        if (this.state.forceOn) {
            // Deactivate existing forces
            const fg = this.fgRef.current;
            fg.d3Force('center', null);
            fg.d3Force('charge', null);
            fg.d3Force('collide', null);
            fg.d3Force('box', null);
            fg.d3Force('x', null);
            fg.d3Force('y', null);

            for (let node of data.nodes) {
                node.vx = 0;
                node.vy = 0;
            }
            this.setState({data: data, forceOn: false});
        }
        else {
            // start
            this.addAnimation();
        }
    }

    // ========== TESTING FUNCTIONS ============

    // updates a random node
    mockUpdate() {
        let nodes = this.state.data.nodes;
        let idx = Math.floor(Math.random() * nodes.length);
        let node = this.state.data.nodes[idx];
        node.state.fakeState1 = "updated";
        this.updateNodes([node]);
    }

    mockAdd() {
        let id = "g_id" + fakeId.toString();
        fakeId++;
        this.addNodes([createRandomNode(id)]);
    }

    mockRemove() {
        var idx = Math.floor(Math.random() * this.state.data.nodes.length);
        this.removeNodes([this.state.data.nodes[idx]]);
    }

    // ========== END TESTING FUNCTIONS ============
    
    render() {
        return (
            <div>
            {this.state.data.nodes.length >= 1 ?
                <div>
                    <div className="instructions">scroll to zoom in/out</div>
                    <DoughnutChart
                        className="node-proportion-doughnut"
                        data={this.buildDoughnutDataObject}
                        title="Component Proportions"
                    />
                    <ForceGraph2D
                        ref={this.fgRef}
                        graphData={this.state.data}
                        nodeAutoColorBy={d => d.name}
                        onNodeClick={this.handleClick}
                        onBackgroundClick={this.handleClickaway}
                        cooldownTime={Infinity}
                        d3AlphaDecay={0}
                        nodeCanvasObjectMode={n => 'after'}
                        nodeCanvasObject={this.paintRing}
                    />
                </div> :
            <div className="placeholder">Waiting for updates...</div>}

            {this.state.showMockButtons &&
            <div className="updateButton">
            <span
            className="button" onClick={this.mockAdd}>mock add</span>

            <span hidden={this.state.data.nodes.length === 0} 
            className="button" onClick={this.mockUpdate}>mock update</span>

            <span hidden={this.state.data.nodes.length === 0} 
            className="button" onClick={this.mockRemove}>mock remove</span>

            <span hidden={this.state.data.nodes.length === 0} 
            className={this.state.forceOn? "button on" : "button off"} onClick={this.toggleForce}>force: {this.state.forceOn? "on" : "off"}</span>
            </div>}
            
            <NodeAnalysis 
                showDetails={this.state.showDetails}
                activeNodeId={this.state.id}
                nodes={this.state.data.nodes} 
            />

            </div>
        );
    }
}

{/* <SlidingPane
    className="testPane"
    overlayClassName="overlayTestPane"
    isOpen={ this.state.isPaneOpen && this.state.showDetails }
    title={this.findNodeName()}
    onRequestClose={ () => {
        this.setState({ isPaneOpen: false });
    }}
    width="500px"
>
</SlidingPane> */}