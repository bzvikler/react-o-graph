import React from 'react';

// View expanded info showing metadata and additional visualizations
// for each individual component
// relevant data can be accessed in the this.props.node object

// CHAD - THIS IS FOR YOU

export default class NodeViewer extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        // this is just a mock display for now
        return (
            <div className="info">
                <b>Information</b><br/>
                Component: {this.props.node.name} <br/>
                Id: {this.props.node.id} <br />
                Value: {this.props.node.val} <br />
            </div>
        );
    }
}
