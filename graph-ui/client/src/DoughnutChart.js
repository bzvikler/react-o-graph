import React from "react";
import { Doughnut } from "react-chartjs-2";

export default class DoughnutChart extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <Doughnut
                    data={this.props.data}
                />
            </div>
        );
    }
}