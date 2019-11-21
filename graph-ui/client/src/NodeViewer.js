import React from 'react';
import { Doughnut } from "react-chartjs-2";

// View expanded info showing metadata and additional visualizations
// for each individual component
// relevant data can be accessed in the this.props.node object

// CHAD - THIS IS FOR YOU

const data = {
    labels: [
        "red",
        "green",
        "yellow"
    ],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ],
        hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
        ]
    }]
};

export default class NodeViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // this is just a mock display for now
        return (
            <div className="info">
                <Doughnut
                    data={data}
                />
                <Doughnut
                    data={data}
                />
                <Doughnut
                    data={data}
                />
                <Doughnut
                    data={data}
                />
                <Doughnut
                    data={data}
                />
                <Doughnut
                    data={data}
                />
                <Doughnut
                    data={data}
                />
            </div>
        );
    }
}


// <b>Information</b><br/>
// Component: {this.props.node.name} <br/>
// Id: {this.props.node.id} <br />
// Props: {JSON.stringify(this.props.node.props)} <br />
// State: {JSON.stringify(this.props.node.state)} <br />