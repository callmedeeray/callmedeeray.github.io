import React from 'react';

function MultipleChoice(props) {
	// props = {'questionText': 'sometext', 'answerList': ['answer1', 'answer2', 'answer3'], 'questionName': 'somename'}
	
	function answerList() {
		let answers = [];
		props.info.answerList.forEach(function(d,i) {
			answers.push(<option key={d} value={i}>{d}</option>)
		});
		//<option selected disabled aria-hidden role='presentation'>Select the best answer</option>
					
		return answers;
	}

	return (
		<div className="qa multiple-choice">
			<label htmlFor={props.info.questionName} className="question">
				{props.info.questionText}
			</label>
			<div className="answer select">
				<select name={props.info.questionName} id={props.info.questionName} defaultValue='Select the best answer'>
					{answerList()}
				</select>
			</div>	
		</div>
	)
}

export default MultipleChoice;