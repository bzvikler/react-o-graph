import React from 'react';

// View expanded info showing metadata and additional visualizations
// for each individual component

// CHAD - THIS IS FOR YOU

export default class NodeDetails extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div className="info">
                <b>Information</b><br/>
                Component: {this.props.name} <br/>
                Id: {this.props.id} <br />
                Value: {this.props.val}
            </div>
        );
    }
}
