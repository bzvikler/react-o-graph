import React from "react";
import Slider from "rc-slider";
import ReactJson from "react-json-view";

export default class SliderChart extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentVal: 100
        }

        this.changeHistory = this.changeHistory.bind(this);
    }

    changeHistory(value) {
        this.setState({currentVal: value});
    }

    componentDidUpdate(prevProps) {
        // reset slider when new component selected
        if (this.props.id != prevProps.id) {
            this.setState({currentVal: 100})
        }
    }

    render() {
        let idx = this.state.currentVal / 25;
        let data = this.props.data;
        while (data.length < 5) {
            data.unshift({});
        }
        let currentDisplay = data[idx] == null ? {} : data[idx];
        return (
            <div>
                <p className="slider-title">{this.props.name}</p>
                <div className="slider-chart">
                    <Slider 
                        min={0}
                        defaultValue={100} 
                        value={this.state.currentVal}
                        marks={{ 0: "Earliest", 25: "", 50: "", 75: "", 100: "Latest" }} 
                        step={null}
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