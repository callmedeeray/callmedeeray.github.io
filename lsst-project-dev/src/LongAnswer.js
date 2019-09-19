function LongAnswer(props) {
	// props = {'questionText': 'sometext', 'questionName': 'somename'}
	return (
		<div className="qa long-answer">
			<label for={props.questionName} className="question">
				{props.questionText}
			</label>
			<div className="answer text-input">
				<textarea 
					name={props.questionName}
					id={props.questionName}
				/>
			</div>
		</div>
	)
}

export default LongAnswer;