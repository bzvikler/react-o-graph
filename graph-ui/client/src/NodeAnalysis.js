import React from 'react';
import NodeViewer from './NodeViewer';

// Holds internal map of node id --> node details
// passes analysis details to NodeViewer for currently selected nodes

// Props:
// this.props.showDetails : true if node is selected, renders NodeViewer
// this.props.activeNodeId : the current node to display in NodeViewer
// this.props.nodes : an array of the current node objects displayed in the graph, which
// changes upon graph updates

// NADA - THIS IS FOR YOU

export default class NodeAnalysis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nodes: props.nodes, // original format of nodes received

            // hashmap of nodeId->details ; this is populated from this.props.nodes
            nodeDetails: {},
        }
    }

    componentDidMount() {
        // TODO:
        // populate this.state.nodeDetails using info from this.props.nodes
    }

    componentDidUpdate() {
        // TODO:
        // if (this.props.nodes NOT EQUAL TO this.state.nodes)
          // update state accordingly (nodes and nodeDetails)
    }
    
    render() {
        return (
            this.props.showDetails &&
            // TODO: pass nodeDetails when implementation is complete
            <NodeViewer node={this.props.nodes.filter(n => n.id === this.props.activeNodeId)[0]} />
            //<NodeViewer node={this.state.nodeDetails[this.props.activeNodeId]} />
        );
    }
}
