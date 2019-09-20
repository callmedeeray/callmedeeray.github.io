import React from 'react';


function CompoundFillBlank(props) {
	// info = {
	// 	"type": "fill-in-the-blank",
	// 	"questionName": "Fill-in-the-blank Example",
	// 	"questionText": ["Realm of the galaxies muse about made in the interiors of ","BLANK","."]}

	function makeQuestion() {
		let question = [];
		props.info.questionText.forEach(function(d,i) {
			let bla = 0;
			if (d !== "BLANK") {
				question.push(<span key={props.info.questionName + 'question'+d} aria-hidden role='presentation'>{d}</span>)
			}
			else {
				question.push(<div key={props.info.questionName + i + 'blank'+ bla} className="answer text-input"><input type="text" name={props.info.questionName} id={props.info.questionName}	/></div>)
				bla++;
			}
		})
		return question;
	}

	return (
		<div className="qa fill-in-the-blank">
			<div className="question">
				<label htmlFor={props.info.questionName} className="screen-reader-only">
					Fill in the blank: {props.info.questionText.join('')}
				</label>
				{makeQuestion()}
			</div>
		</div>
	)
}

export default CompoundFillBlank;