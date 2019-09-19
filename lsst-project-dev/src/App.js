import React from 'react';
import logo from './logo.svg';
import './App.css';
import InfoContainer from './InfoContainer';

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
				<div className='container-info'>
					<InfoContainer />
				</div>
			</main>
		</div>
	);
}

export default App;
