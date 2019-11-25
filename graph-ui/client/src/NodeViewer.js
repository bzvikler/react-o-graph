import React from 'react';
import SliderChart from "./SliderChart";
import 'rc-slider/assets/index.css';
import DoughnutChart from "./DoughnutChart";

// View expanded info showing metadata and additional visualizations
// for each individual component
// relevant data can be accessed in the this.props.node object

export default class NodeViewer extends React.Component {
    constructor(props) {
        super(props);

        this.getRenderProportionStatistics = this.getRenderProportionStatistics.bind(this);
    }

    getRenderProportionStatistics() {
        const totalRenders = Object.values(this.props.renderStats).reduce((a, b) => a + b + 1, 0);
        const individualRenders = this.props.renderStats[this.props.node.id] + 1;
        const otherRenders = totalRenders - individualRenders;

        return {
            datasets: [{
                data: [individualRenders, otherRenders],
                backgroundColor: [
                    "#36a2ec",
                    "navy"
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
        return (
            <div className="info">
                <div className="info-header">
                    <h1>{this.props.node.name}</h1>
                </div>
                <div className="info-section-header">
                    <h2>Render Summary</h2>
                </div>
                <div className="summary">
                    <div className="render-doughnut">
                        <DoughnutChart
                            className="render-proportion-doughnut"
                            data={this.getRenderProportionStatistics}
                            title="Proportion of renders"
                        />
                    </div>

                    <div className="metric">
                        <div className="props">
                            <p>Renders by props:</p>
                            <h1>{this.props.node.propRenders}</h1>
                        </div>
                        <div className="state">
                            <p>Renders by state:</p>
                            <h1>{this.props.node.stateRenders}</h1>
                        </div>
                    </div>
                </div>

                <div className="info-section-header">
                    <h2>State & Prop History</h2>
                </div>

                <div className="prop-history props">
                    <SliderChart
                        data={this.props.node.propHistory}
                        name="Props"
                    />
                </div>

                <div className="state-history state">
                    <SliderChart
                        data={this.props.node.stateHistory}
                        name="State"
                    />
                </div>
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
