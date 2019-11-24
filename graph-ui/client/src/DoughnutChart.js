import React from "react";
import { Doughnut } from "react-chartjs-2";

export default class DoughnutChart extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="doughnut">
                <p className="doughnut-title">{this.props.title}</p>
                <Doughnut
                    className="doughnut-chart"
                    data={this.props.data}
                />
            </div>
        );
    }
}