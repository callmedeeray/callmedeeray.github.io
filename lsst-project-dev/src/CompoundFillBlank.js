import React, { Component } from 'react';


class CompoundFillBlank extends Component {
	// info = {
	// 	"type": "fill-in-the-blank",
	// 	"questionName": "Fill-in-the-blank Example",
	// 	"questionText": ["Realm of the galaxies muse about made in the interiors of ","BLANK","."]}
	
	constructor(props) {
		super(props);
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

	makeQuestion() {
		let question = [];
		let self=this;
		this.props.info.questionText.forEach(function(d,i) {
			let bla = 0;
			if (d !== "BLANK") {
				question.push(<span key={self.props.info.questionName + 'question'+d} aria-hidden role='presentation'>{d}</span>)
			}
			else {
				question.push(<div key={self.props.info.questionName + i + 'blank'+ bla} className="answer text-input"><input type="text" name={self.props.info.questionName} id={self.props.info.questionName}	/></div>)
				bla++;
			}
		})
		return question;
	}
	render() {
		return (
			<div className={"qa fill-in-the-blank " + this.state.activeOrNot} onMouseEnter={this.mousenter} onMouseLeave={this.mouseexit}>
				<div className="question">
					<label htmlFor={this.props.info.questionName} className="screen-reader-only">
						Fill in the blank: {this.props.info.questionText.join('')}
					</label>
					{this.makeQuestion()}
				</div>
			</div>
		)
	}
		
}

export default CompoundFillBlank;