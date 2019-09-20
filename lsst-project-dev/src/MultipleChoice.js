import React, { Component } from 'react';

class MultipleChoice extends Component {
	// info = {
	// "type": "multiple-choice",
	// "questionName": "Multiple Choice Example",
	// "questionText": "At the edge of forever take root and flourish billions upon billions intelligent beings stirred by starlight the carbon in our apple pies. Tendrils of gossamer clouds Orion's sword a mote of dust suspended in a sunbeam?",
	// "answerList": ["Cosmic ocean", "Drake equation", "Star stuff"]

	constructor(props) {
		super(props);
		this.answerList = this.answerList.bind(this);
		this.state = {activeOrNot: null};
		this.mousenter = this.mousenter.bind(this);
		this.mouseexit = this.mouseexit.bind(this);
	}

	mousenter() {
		this.setState({activeOrNot: "active-qa"})
	}

	mouseexit() {
		this.setState({activeOrNot: null})
	}
	
	answerList() {
		let answers = [];
		this.props.info.answerList.forEach(function(d,i) {
			answers.push(<option key={d} value={i}>{d}</option>)
		});
					
		return answers;
	}

	render() {
		return (
			<div className={"qa multiple-choice " + this.state.activeOrNot} onMouseEnter={this.mousenter} onMouseLeave={this.mouseexit}>
				<label htmlFor={this.props.info.questionName} className="question">
					{this.props.info.questionText}
				</label>
				<div className="answer select">
					<select name={this.props.info.questionName} id={this.props.info.questionName} defaultValue='Select the best answer'>
						<option selected disabled>Select the best answer</option>
						{this.answerList()}
					</select>
				</div>	
			</div>
		)
	}
		
}

export default MultipleChoice;