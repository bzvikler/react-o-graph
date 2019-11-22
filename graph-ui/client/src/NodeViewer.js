import React from 'react';
import SliderChart from "./SliderChart"
import DoughnutChart from './DoughnutChart';
import 'rc-slider/assets/index.css';

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

const sliderData = [
    {
        props: {
            name: "Chad",
            age: 24,
        },
        timestamp: "11/21/2019",
    },
    {
        props: {
            name: "Chade",
            age: 24,
        },
        timestamp: "11/22/2019",
    },
    {
        props: {
            name: "Chadee",
            age: 25
        },
        timestamp: "11/23/2019",
    },
    {
        props: {
            name: "Achadee",
            age: 26
        },
        timestamp: "11/24/2019",
    },
    {
        props: {
            name: "Kachadee",
            age: 27
        },
        timestamp: "11/25/2019"
    }
]

const wrapperStyle = { width: 400, margin: 50 }

export default class NodeViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    changePropsHistory(e) {
        console.log(e);
    }


    render() {
        // this is just a mock display for now
        return (
            <div style={wrapperStyle} className="info">
                <p>Information</p>
                <p>Component: {this.props.node.name}</p>

                {/* props history */}
                <SliderChart
                    data={sliderData}
                />
                <DoughnutChart
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