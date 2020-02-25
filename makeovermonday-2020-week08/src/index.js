import './style.css';
import * as d3 from 'd3';
import data from './Week08-2.json';
import 'bootstrap/dist/css/bootstrap.min.css';


main();
// window.addEventListener('resize', main())

function main() {

	let 
		winWidth = Math.floor(0.975*window.innerWidth),
		winHeight = Math.floor(0.975*window.innerHeight),
		margin = {
			top: Math.floor(winHeight*0.1),
			bottom: Math.floor(winHeight*0.1),
			left: Math.floor(winWidth*0.1),
			right: Math.floor(winWidth*0.1)
		},
		width = winWidth - margin.left - margin.right, 
		height = winHeight - margin.top - margin.bottom;


	d3.select('body')
		.style('margin-top', margin.top + 'px')
		.style('margin-left', margin.left + 'px')
		.style('margin-right', margin.right + 'px')
		.style('margin-bottom', margin.bottom + 'px')
		// .style('text-align', 'center');

	// d3.select('#main')
	// 	.attr('width', width + margin.left + margin.right)
	// 	.attr('height', height + margin.top + margin.bottom);

	// let svg = d3.select('#main').select('g')
	// 	.attr('transform', `translate(${margin.left}, ${margin.top})`);




}
