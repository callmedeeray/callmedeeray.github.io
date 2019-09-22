import React, { Component } from 'react';
import { text } from './text.json';


class InfoContainer extends Component {
	constructor(props) {
		super(props);
		this.createInfo = this.createInfo.bind(this);
	}

	componentDidMount() {
		this.createInfo();
	}

	componentDidUpdate() {
		this.createInfo();
	}

	createInfo() {
		let blocks = [];
		text.forEach(function(d,i) {
			blocks.push(<p key={i}>{d}</p>);
		})

		return blocks;
	}

	render() {
		return (
			<div className='info'>
				<h2>The Cosmos Awaits</h2>
				{this.createInfo()}
			</div>
		)
	}

}

export default InfoContainer;