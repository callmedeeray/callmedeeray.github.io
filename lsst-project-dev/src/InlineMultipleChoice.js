import React, { Component } from 'react';

class InlineMultipleChoice extends Component {
	// info = {
	// "type": "inline-multiple-choice",
	// "questionName": "Inline Multiple Choice Example",
	// "questionText": ["Hydrogen atoms paroxysm of global death as a patch of light citizens of distant epochs ", 
	// 					"SELECT",
	// 					"prime number are creatures of the cosmos."],
	// "answerList": [["Cosmic ocean", "Drake equation", "Star stuff"]]

	constructor(props) {
		super(props);
		this.answerList = this.answerList.bind(this);
		this.makeQuestion = this.makeQuestion.bind(this);
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

	answerList(j) {
		let answers = [];
		let self=this;
		self.props.info.answerList[j].forEach(function(d,i) {
			answers.push(<option key={self.props.info.questionName + 'option'+d} value={i}>{d}</option>)
		});
					
		return answers;
	}

	makeQuestion() {
		let question = [];
		let sel = 0;
		let self=this;
		self.props.info.questionText.forEach(function(d,i) {
			if (d !== "SELECT") {
				question.push(<span key={self.props.info.questionName + 'question'+d}>{d}</span>)
			}
			else {
				question.push(
					<div className="answer select" key={self.props.info.questionName + i +'select'+sel}>
						<select>
							<option selected disabled>Select the best answer</option>
							{self.answerList(sel)}
						</select>
					</div>
				)
				sel++;
			}
		})
		return question;
	}

	render() {
		return (
			<div className={"qa multiple-choice inline-multiple-choice " + this.state.activeOrNot} onMouseEnter={this.mousenter} onMouseLeave={this.mouseexit}>
				<div className="question">
					{this.makeQuestion()}
				</div>
			</div>
		)
	}

		
}

export default InlineMultipleChoice;