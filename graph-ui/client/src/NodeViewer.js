import React from 'react';
import SliderChart from "./SliderChart";
import 'rc-slider/assets/index.css';
import DoughnutChart from "./DoughnutChart";

// View expanded info showing metadata and additional visualizations
// for each individual component
// relevant data can be accessed in the this.props.node object

// CHAD - THIS IS FOR YOU

const wrapperStyle = { width: 400, margin: 50 }

export default class NodeViewer extends React.Component {
    constructor(props) {
        super(props);

        this.getRenderProportionStatistics = this.getRenderProportionStatistics.bind(this);
    }

    getRenderProportionStatistics() {
        debugger;
        const totalRenders = Object.values(this.props.renderStats).reduce((a, b) => a + b, 0);
        const individualRenders = this.props.renderStats[this.props.node.id];

        return {
            datasets: [{
                data: [individualRenders, totalRenders],
                backgroundColor: [
                    "blue",
                    "red"
                ],
            }],
            labels: [
                "This Node",
                "Other Nodes"
            ],
        }
    }

    changePropsHistory(e) {
        console.log(e);
    }


    render() {
        // this is just a mock display for now
        return (
            <div style={wrapperStyle} className="info">
                <DoughnutChart
                    className="render-proportion-doughnut"
                    data={this.getRenderProportionStatistics}
                    title="Percentage of renders"
                />

                {/* <p>Created At: {this.props.node.creationTime}</p> */}
                <p>Number of children: {this.props.node.children}</p>

                {/* prop history */}
                <SliderChart
                    data={this.props.node.propHistory}
                    name="Component Prop History"
                />
                <p>Prop renders: {this.props.node.propRenders}</p>

                {/* state history */}
                <SliderChart
                    data={this.props.node.stateHistory}
                    name="Component State History"
                />
                <p>State renders: {this.props.node.stateRenders}</p>
            </div>
        );
    }
}


// <b>Information</b><br/>
// Component: {this.props.node.name} <br/>
// Id: {this.props.node.id} <br />
// Props: {JSON.stringify(this.props.node.props)} <br />
// State: {JSON.stringify(this.props.node.state)} <br />

// MOCK DATA FOR DOUGHNUT
// data = { "a": 1, "b": 2, "c": 3 }

// MOCK DATA FOR LIST
// data = ["a", "b", "c"];

// MOCK DATA FOR SLIDER
// data = [
//     {
//         props: {},
//         timestamp: "",
//     },
//     {
//         props: {},
//         timestamp: "",
//     },
//     {
//         props: {},
//         timestamp: "",
//     },
//     {
//         props: {},
//         timestamp: "",
//     },
// ]

// data = [
//     {
//         state: {},
//         timestamp: "",
//     },
//     {
//         state: {},
//         timestamp: "",
//     },
//     {
//         state: {},
//         timestamp: "",
//     },
//     {
//         state: {},
//         timestamp: "",
//     },
// ]
{/* <SliderChart
    data={this.propHistory()}
/>

<DoughnutChart

/> */}
