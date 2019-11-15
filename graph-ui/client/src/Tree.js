import React from 'react';
import { ForceGraph2D } from 'react-force-graph'

// right click to view info

// hover displays information in sidebar

const ROOT_ID = "1";
const C1 = "#e987cf";
const C2 = "#83d8f0";
const C3 = "#a68ce9"

export default class Tree extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // state for currently selected node
            name: "",
            id: "",
            val: "",
        }
        this.handleClick = this.handleClick.bind(this);
        this.getNodeColor = this.getNodeColor.bind(this);
    }

    handleClick(node, event) {
        node.nodeColor = "green"
        this.setState({name: node.name,
            id: node.id,
            val: node.val})
    }

    getNodeColor(node) {
        // selected = green; root = red; default = blue
        if (node.id == this.state.id) {
            return C1;
        }
        if (node.id == ROOT_ID) {
            return C2;
        }
        else return C3;
    }
    
    render() {
        return (
            <div>
            {this.props.data.nodes.length > 0?
            <ForceGraph2D
            graphData={this.props.data}
            nodeColor={this.getNodeColor}
            nodeOpacity={0.01}
            onNodeClick={this.handleClick}
            linkColor={l => "#dadce0"}
            /> :
            <div> Graph is empty! </div>
    }
            <div className="info" hidden={this.state.name == ""}>
                <b>Information</b><br/>
                Component: {this.state.name} <br/>
                Id: {this.state.id} <br />
                Value: {this.state.val}
            </div>
            </div>
        );
    }
}
