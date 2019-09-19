import React from 'react';

function ShortAnswer(props) {
	// props = {'questionText': 'sometext', 'questionName': 'somename'}
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