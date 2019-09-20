import React from 'react';

function MultipleChoice(props) {
	// info = {
	// "type": "multiple-choice",
	// "questionName": "Multiple Choice Example",
	// "questionText": "At the edge of forever take root and flourish billions upon billions intelligent beings stirred by starlight the carbon in our apple pies. Tendrils of gossamer clouds Orion's sword a mote of dust suspended in a sunbeam?",
	// "answerList": ["Cosmic ocean", "Drake equation", "Star stuff"]

	function answerList() {
		let answers = [];
		props.info.answerList.forEach(function(d,i) {
			answers.push(<option key={d} value={i}>{d}</option>)
		});
					
		return answers;
	}

	return (
		<div className="qa multiple-choice">
			<label htmlFor={props.info.questionName} className="question">
				{props.info.questionText}
			</label>
			<div className="answer select">
				<select name={props.info.questionName} id={props.info.questionName} defaultValue='Select the best answer'>
					<option selected disabled>Select the best answer</option>
					{answerList()}
				</select>
			</div>	
		</div>
	)
}

export default MultipleChoice;