import { questions } from './questions.json';
import React, { Component } from 'react';
import ShortAnswer from './ShortAnswer';
import LongAnswer from './LongAnswer';
import FillBlank from './FillBlank';
import MultipleChoice from './MultipleChoice';

class QuestionContainer extends Component {
	constructor(props) {
		super(props)
		this.makeQuestions = this.makeQuestions.bind(this);
	}

	makeQuestions() {
		let qList = [];
		questions.forEach(function(d) {
			if (d.type === "short-answer") {
				qList.push(<ShortAnswer key={d.questionName} info={d} />)
			}
			else if (d.type === "long-answer") {
				qList.push(<LongAnswer key={d.questionName} info={d} />)
			}
			else if (d.type === "multiple-choice") {
				qList.push(<MultipleChoice key={d.questionName} info={d} />)
			}
			else if (d.type === "fill-in-the-blank") {
				qList.push(<FillBlank key={d.questionName} info={d} />)
			}
		})
		return qList;
	}

	render () {
		return <div className="qas">{this.makeQuestions()}</div>
	}
}


export default QuestionContainer;