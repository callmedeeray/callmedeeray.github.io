import React, { Component } from 'react';

class LongAnswer extends Component {
	// info = {
	// "type": "long-answer",
	// "questionName": "Long Answer Example",
	// "questionText": "Laws of physics dream of the mind's eye a still more glorious dawn awaits?"

	constructor(props) {
		super(props)
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
	
	render() {
		return (
			<div className={"qa long-answer " + this.state.activeOrNot} onMouseEnter={this.mousenter} onMouseLeave={this.mouseexit}>
				<label htmlFor={this.props.info.questionName} className="question">
					{this.props.info.questionText}
				</label>
				<div className="answer text-input">
					<textarea 
						name={this.props.info.questionName}
						id={this.props.info.questionName}
					/>
				</div>
			</div>
		)
	}
		
}

export default LongAnswer;