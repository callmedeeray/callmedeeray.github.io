import React from 'react';

function InlineMultipleChoice(props) {
	// info = {
	// "type": "inline-multiple-choice",
	// "questionName": "Inline Multiple Choice Example",
	// "questionText": ["Hydrogen atoms paroxysm of global death as a patch of light citizens of distant epochs ", 
	// 					"SELECT",
	// 					"prime number are creatures of the cosmos."],
	// "answerList": [["Cosmic ocean", "Drake equation", "Star stuff"]]

	function answerList(j) {
		let answers = [];
		props.info.answerList[j].forEach(function(d,i) {
			answers.push(<option key={props.info.questionName + 'option'+d} value={i}>{d}</option>)
		});
					
		return answers;
	}

	function makeQuestion() {
		let question = [];
		props.info.questionText.forEach(function(d,i) {
			let sel = 0;
			if (d !== "SELECT") {
				question.push(<span key={props.info.questionName + 'question'+d}>{d}</span>)
			}
			else {
				question.push(
					<div className="answer select" key={props.info.questionName + i +'select'+sel}>
						<select name={props.info.questionName} id={props.info.questionName} defaultValue='Select the best answer'>
							<option selected disabled>Select the best answer</option>
							{answerList(sel)}
						</select>
					</div>
				)
				sel++;
			}
		})
		return question;
	}

	return (
		<div className="qa multiple-choice inline-multiple-choice">
			<div className="question">
				{makeQuestion()}
			</div>
		</div>
	)
}

export default InlineMultipleChoice;