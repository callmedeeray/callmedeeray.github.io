import './style.css';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import data from './Week08-2.json';
import 'bootstrap/dist/css/bootstrap.min.css';


main();
window.onresize = main;

function main() {

	d3.select('#sankey').selectAll('g').remove();

	let 
		winWidth = Math.floor(0.975*window.innerWidth),
		winHeight = Math.floor(0.975*window.innerHeight),
		margin = {
			top: Math.floor(winHeight*0.05),
			bottom: Math.floor(winHeight*0.05),
			left: Math.floor(winWidth*0.05),
			right: Math.floor(winWidth*0.05)
		};

	let width = document.getElementById('root').clientWidth - margin.left - margin.right,
		height = winHeight - margin.top - margin.bottom;

	d3.select('#sankey')
		.attr('width', width)
		.attr('height', height);

	d3.select('body')
		.style('margin-top', margin.top + 'px')
		.style('margin-left', margin.left + 'px')
		.style('margin-right', margin.right + 'px')
		.style('margin-bottom', margin.bottom + 'px');

	d3.select('#root')
		.style('height', height + 'px');

	let svg = d3.select('#sankey');

	let nodes1 = [
			{'node': 'Homeless0', 'name': 'Homeless'}
			, {'node': 'At risk0', 'name': 'At risk'}
			, {'node': 'Homeless', 'name': 'Homeless'}
			, {'node': 'At risk', 'name': 'At risk'}
			, {'node': 'Unknown', 'name': 'Unknown'}
		];

	const {nodes, links} = sankey()
			.nodeId(d => d.node)
			// .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
			.nodeWidth(15)
			.nodePadding(10)
			.extent([[1, 1], [0.95*width, 0.95*height]])({
				nodes: nodes1.map(d => Object.assign({}, d)),
				links: data.filter(d => d.Year == '2017-18'  ).map(d => Object.assign({}, d))
			});


	let node = svg.append('g')
		.selectAll('.node')
		.data(nodes)
		.enter()
		.append('rect')
		.attr('class', 'node')
		.attr('x', d => d.x0 )
		.attr('y', d => d.y0 )
		.attr('height', d => d.y1 - d.y0 )
		.attr('width', d => d.x1 - d.x0 )
		.attr('fill', 'blue')
		.style('stroke', 'black')
		.style('stroke-width', 1)
		;

	let link = svg.append('g')
		.selectAll('.link')
		.data(links)
		.enter()
		.append('path')
		.attr('class', 'link')
		.attr('d', sankeyLinkHorizontal())
		.attr('fill', 'none')
		.style('stroke', 'grey')
		.style('stroke-width', d => d.width )
		.style('stroke-opacity', 0.5)
		.sort((a,b) => b.dy - a.dy );


}
