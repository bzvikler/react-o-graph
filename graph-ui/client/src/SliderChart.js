import React from "react";
import Slider from "rc-slider";
import ReactJson from "react-json-view";

export default class SliderChart extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentDisplay: this.props.data[this.props.data.length - 1]
        }

        this.changeHistory = this.changeHistory.bind(this);
    }

    componentWillUpdate() {
        this.state.currentDisplay = this.props.data[this.props.data.length -1]
    }

    changeHistory(value) {
        switch(value) {
            case 0:
                this.state.currentDisplay = this.props.data[4] || {};
                break;
            case 25:
                this.state.currentDisplay = this.props.data[3] || {};
                break;
            case 50:
                this.state.currentDisplay = this.props.data[2] || {};
                break;
            case 75:
                this.state.currentDisplay = this.props.data[1] || {};
                break;
            case 100:
                this.state.currentDisplay = this.props.data[0] || {};
                break;
        }

        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <p className="slider-title">{this.props.name}</p>
                <div className="slider-chart">
                    <Slider 
                        min={0}
                        defaultValue={100} 
                        marks={{ 0: "Earliest", 25: "", 50: "", 75: "", 100: "Latest" }} 
                        step={null}
                        onChange={this.changeHistory}
                    />
                </div>
                <div className="slider-results">
                    <ReactJson
                        src={this.state.currentDisplay}
                        name={false}
                    />
                </div>
            </div>
        );
    }
}