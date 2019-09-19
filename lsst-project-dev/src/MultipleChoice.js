function MultipleChoice(props) {
	// props = {'questionText': 'sometext', 'answerList': ['answer1', 'answer2', 'answer3'], 'questionName': 'somename'}
	
	function answerList() {
		let answers = [];
		props.answerList.forEach(function(d,i) {
			answers.push(<option value={i}>{d}</option>)
		});

		return answers;
	}

	return (
		<div className="qa multiple-choice">
			<label for={props.questionName} className="question">
				{props.questionText-BeforeBlank}
			</label>
			<div className="answer select">
				<select name={props.questionName} id={props.questionName}>
					<option selected disabled aria-hidden role='presentation'>Select the best answer</option>
					{answerList()}
				</select>
			</div>	
		</div>
	)
}

export default MultipleChoice;