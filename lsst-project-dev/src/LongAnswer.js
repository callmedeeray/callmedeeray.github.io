import React from 'react';


function LongAnswer(props) {
	// props = {'questionText': 'sometext', 'questionName': 'somename'}
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