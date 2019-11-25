import React from "react";
import { Doughnut } from "react-chartjs-2";

export default class DoughnutChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                <p className="doughnut-title">{this.props.title}</p>
                <Doughnut
                    width={200}
                    height={100}
                    options={{ maintainAspectRatio: false }}
                    className="doughnut-chart"
                    data={this.props.data}
                    legend={{ position: 'bottom' }}
                />
            </div>
        );
    }
}
