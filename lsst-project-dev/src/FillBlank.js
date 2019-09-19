function FillBlank(props) {
	// props = {'questionText-beforeBlank': 'sometext', 'questionText-afterBlank': 'somemoretext', 'questionName': 'somename'}
	return (
		<div className="qa fill-in-the-blank">
			<div className="question">
				<label for={props.questionName} className="screen-reader-only">
					Fill in the blank: {props.questionText-BeforeBlank} BLANK {props.questionText-AfterBlank}
				</label>
				<span aria-hidden role='presentation'>
					{props.questionText-BeforeBlank}
				</span>
				<div className="answer text-input">
					<input 
						type="text"
						name={props.questionName}
						id={props.questionName}
					/>
				</div>
				<span aria-hidden role='presentation'>
					{props.questionText-AfterBlank}
				</span>
			</div>
		</div>
	)
}

export default FillBlank;