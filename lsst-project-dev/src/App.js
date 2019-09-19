import React from 'react';
import logo from './logo.svg';
import './App.css';
import InfoContainer from './InfoContainer';
import QuestionContainer from './QuestionContainer';

function App() {
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
			<main className='container-main'>
				<div className='container-info' id='info'>
					<InfoContainer />
				</div>
				<hr />
				<div className='container-qas'>
					<h2>Questions</h2>
					<QuestionContainer />
				</div>
			</main>
			<footer className="footer-primary"></footer>
		</div>
	);
}

export default App;
