import React from 'react';

function ShortAnswer(props) {
	// info = {
	// "type": "short-answer",
	// "questionName": "Short Answer Example",
	//  "questionText": "Laws of physics dream of the mind's eye a still more glorious dawn awaits?" 
	return (
		<div className="qa short-answer">
			<label htmlFor={props.info.questionName} className="question">
				{props.info.questionText}
			</label>
			<div className="answer text-input">
				<input 
					type="text"
					name={props.info.questionName}
					id={props.info.questionName}
				/>
			</div>
		</div>
	)
}

export default ShortAnswer;