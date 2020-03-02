import * as d3 from 'd3';
import './style.css';
import data from './Week09.json';
import d3Tip from 'd3-tip';
import './MakeoverMondayFooter.css';


d3.select('body').append('script').attr('src', "https://d3js.org/d3.v5.min.js");
	
main();
window.onresize = main;

function main() {

	d3.selectAll('g').remove();

	////// Boilerplate - don't touch this! ////////////
	var 
		winWidth = Math.floor(0.975*window.innerWidth),
		winHeight = Math.floor(0.975*window.innerHeight),
		margin = {
			top: Math.floor(winHeight*0.05),
			bottom: Math.floor(winHeight*0.05),
			left: Math.floor(winWidth*0.05),
			right: Math.floor(winWidth*0.05)
		},
		width = document.getElementById('root').clientWidth - margin.left - margin.right, 
		height = 0.75*(winHeight - margin.top - margin.bottom);


		d3.select('body')
			.style('margin-top', margin.top + 'px')
			.style('margin-left', margin.left + 'px')
			.style('margin-right', margin.right + 'px')
			.style('margin-bottom', margin.bottom + 'px')
			// .style('height', height + 'px');


	///////////////////////////////////////////////////

	let svg = d3.select('#bars')
			.attr('height', height)
			.attr('width', width)
			.append('g')
			.attr('transform','translate(0,25)'),
		ymax = d3.max(data, d => d.Deficit),
		x = d3.scaleBand()
			.range([0,width])
			.padding(0.2)
			.domain(data.map(d => d.Grade)),
		y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, ymax]);


	svg.append('g')
		.attr('class', 'axis axis--x')
		.call(d3.axisTop(x));

	let ttip = d3Tip()
		.attr('class', 'd3-tip')
		.direction('e')
		.offset([0,5])
		.html(function(d) { return d.Grade + ": " + d.Deficit + " hours too few." });


	svg.append('circle').attr('id', 'tipfollowscursor')   /* .attr('r',5) /*  to debug */
	svg.call(ttip);

	svg.append('g')
		.selectAll('.bar')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('fill', '#d7d8d4')
		.attr('x', d => x(d.Grade))
		.attr('y', y(ymax))
		.attr('width', x.bandwidth())
		.attr('height', d => height - y(d.Deficit))
		.on('mousemove', function (d) {
            let target = d3.select('#tipfollowscursor')
                .attr('cx', d3.event.offsetX)
                .attr('cy', d3.event.offsetY - 5) // 5 pixels above the cursor
                .node();
            ttip.show(d, target);
        })
		.on('mouseout', ttip.hide)


};