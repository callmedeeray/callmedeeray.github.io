import React from 'react';


function LongAnswer(props) {
	// info = {
	// "type": "long-answer",
	// "questionName": "Long Answer Example",
	// "questionText": "Laws of physics dream of the mind's eye a still more glorious dawn awaits?"

	return (
		<div className="qa long-answer">
			<label htmlFor={props.info.questionName} className="question">
				{props.info.questionText}
			</label>
			<div className="answer text-input">
				<textarea 
					name={props.info.questionName}
					id={props.info.questionName}
				/>
			</div>
		</div>
	)
}

export default LongAnswer;