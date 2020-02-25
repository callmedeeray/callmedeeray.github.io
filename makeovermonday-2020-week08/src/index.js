import './style.css';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import data from './Week08-2.json';
import 'bootstrap/dist/css/bootstrap.min.css';


main();

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

	let svg = d3.select('#main');

	let nodes1 = [
			{'node': 'Homeless0', 'name': 'Homeless0'}
			, {'node': 'At risk0', 'name': 'At risk0'}
			, {'node': 'Homeless', 'name': 'Homeless'}
			, {'node': 'At risk', 'name': 'At risk'}
			, {'node': 'Unknown', 'name': 'Unknown'}
		];

	const {nodes, links} = sankey()
			.nodeId(d => d.node)
			// .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
			.nodeWidth(15)
			.nodePadding(10)
			.extent([[1, 1], [width - 1, height - 25]])({
				nodes: nodes1.map(d => Object.assign({}, d)),
				links: data.filter(d => d.Year == '2014-15' ).map(d => Object.assign({}, d))
			});

	
	console.log(links);


	// let { nodes, links } = sankey()
	// 	.nodeWidth(winWidth*0.05)
	// 	.nodePadding(winWidth*0.01)
	// 	.nodeId((d) => { d.node })
	// 	.extent([[1, 1], [width - 1, height - 25]])
	// 	({
	// 					nodes: nodes1.map(d => Object.assign({}, d)),
	// 					links: data.filter(d => d.Year == '2014-15' ).map(d => Object.assign({}, d))
	// 			})
	// 	;

	let node = svg.append('g')
		.selectAll('.node')
		.data(nodes)
		.enter()
		.append('rect')
		.attr('class', 'node')
		.attr('height', (d) => { d.y1 - d.y0 })
		.attr('width', 5)
		;

	let link = svg.append('g')
		.selectAll('.link')
		.data(links)
		.enter()
		.append('path')
		.attr('class', 'link')
		.attr('d', sankeyLinkHorizontal())
		.style('stroke-width', (d) => { d.width; })
		.sort((a,b) => { b.dy - a.dy });


}
