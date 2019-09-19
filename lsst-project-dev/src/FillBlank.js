import React from 'react';


function FillBlank(props) {
	// props = {'questionText_beforeBlank': 'sometext', 'questionText_afterBlank': 'somemoretext', 'questionName': 'somename'}
	return (
		<div className="qa fill-in-the-blank">
			<div className="question">
				<label htmlFor={props.info.questionName} className="screen-reader-only">
					Fill in the blank: {props.info.questionText_BeforeBlank} BLANK {props.info.questionText_AfterBlank}
				</label>
				<span aria-hidden role='presentation'>
					{props.info.questionText_BeforeBlank}
				</span>
				<div className="answer text-input">
					<input 
						type="text"
						name={props.info.questionName}
						id={props.info.questionName}
					/>
				</div>
				<span aria-hidden role='presentation'>
					{props.info.questionText_AfterBlank}
				</span>
			</div>
		</div>
	)
}

export default FillBlank;