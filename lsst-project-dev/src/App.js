import React, { Component } from 'react';
import logo from './logo.svg';
import InfoContainer from './InfoContainer';
import QuestionContainer from './QuestionContainer';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { 'width': window.innerWidth, 'height': window.innerHeight };
		this.makeLine = this.makeLine.bind(this);
		this.sideBySide = this.sideBySide.bind(this);
	}

	updateSize() {
		this.setState({ 'width': window.innerWidth, 'height': window.innerHeight });
	}

	componentDidMount() {
		this.updateSize();
		window.addEventListener('resize', this.updateSize.bind(this))
	}
	
	makeLine() {
		let self = this;
		if (self.state.width < 1024) {
			return <hr />
		}
	}

	sideBySide(divHeight) {
		let self = this,
			divStyles = [];

		if (self.state.width >= 1024) {
			divStyles['main'] = {
				display: "inline-block",
			}

			divStyles['info'] = {
				display: "inline-block",
				width: "60vw",
				verticalAlign: "top",
				paddingRight: "1vw",
			}

			divStyles['qas'] = {
				display: "inline-block",
				width: "35vw",
				verticalAlign: "top",
				borderLeft: "1px solid #2B2E34",
				paddingLeft: "1vw",
				overflow: "auto",
			}
		}

		else {
			divStyles['main'] = {
				display: "block",
			}

			divStyles['info'] = {
				display: "block",
			}

			divStyles['qas'] = {
				display: "block",
			}

		}

		return divStyles;
	}



	render() {
		return (
			<div className="App">
				<header className="header-primary">
					<div className="container-flex spaced centered header-inner">
						<img 
							src={logo} 
							className="site-logo" 
							alt="LSST Logo" />
					</div>
				</header>
				<main className='container-main' style={this.sideBySide().main}>
					<div className='container-info' id='info' style={this.sideBySide().info}>
						<InfoContainer />
					</div>
					{this.makeLine()}
					<div className='container-qas' style={this.sideBySide().qas}>
						<h2>Questions</h2>
						<QuestionContainer />
					</div>
				</main>
				<footer className="footer-primary"></footer>
			</div>
		);
	}
		
}

export default App;
