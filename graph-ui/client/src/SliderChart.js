import React from "react";
import Slider from "rc-slider";
import ReactJson from "react-json-view";

const sliderMap = {
    5: { 0: "Earlier", 1: "", 2: "", 3: "", 4: "Latest" },
    4: { 0: "Earliest", 1: "", 2: "", 3: "Latest" },
    3: { 0: "Earliest", 1: "", 2: "Latest" },
    2: { 0: "Earliest", 1: "Latest" },
    1: { 0: "Latest"},
    0: { 0: "Latest"},
}

export default class SliderChart extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentVal: props.data.length < 2? 1 : props.data.length - 1
        }

        this.changeHistory = this.changeHistory.bind(this);
    }

    changeHistory(value) {
        this.setState({currentVal: value});
    }

    componentDidUpdate(prevProps) {
        // reset slider when new component selected
        if (this.props.id != prevProps.id) {
            this.setState({currentVal: this.props.data.length})
        }
    }

    render() {
        let currentDisplay = this.props.data[this.state.currentVal];
        if (!currentDisplay || currentDisplay == null)
            currentDisplay = {};
        return (
            <div>
                <p className="slider-title">{this.props.name}</p>
                <div className="slider-chart">
                    <Slider 
                        min={0}
                        max={this.props.data.length < 2 ? 0 : this.props.data.length - 1}
                        value={this.state.currentVal}
                        marks={sliderMap[this.props.data.length]} 
                        onChange={this.changeHistory}
                    />
                </div>
                <div className="slider-results">
                    <ReactJson
                        src={currentDisplay}
                        name={false}
                    />
                </div>
            </div>
        );
    }
}