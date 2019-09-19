function ShortAnswer(props) {
	// props = {'questionText': 'sometext', 'questionName': 'somename'}
	return (
		<div className="qa short-answer">
			<label for={props.questionName} className="question">
				{props.questionText}
			</label>
			<div className="answer text-input">
				<input 
					type="text"
					name={props.questionName}
					id={props.questionName}
				/>
			</div>
		</div>
	)
}

export default ShortAnswer;