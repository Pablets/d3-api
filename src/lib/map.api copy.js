// import {geoEquirectangular, geoPath, bounds} from 'd3-geo';
// import {selectAll, select} from 'd3-selection';
// import {feature, mesh} from 'topojson-client';
// import {json} from 'd3-fetch';
// import {transition} from 'd3-transition';
// import

// const CreateMapAPI = () => {
// 	let w = 400;
// 	let h = 400;
// 	let active = select(null);
// 	let path;
// 	let svg;
// 	let projection;
// 	let closeButton;
// 	let g;
// 	let provinceData;

// 	function clicked(d) {
// 		// console.log({d});
// 		// console.log(d.clientX);
// 		if (active.node() === this) return reset();
// 		active.classed('active', false);

// 		active = select(this).classed('active', true);

// 		// console.log('path', path);

// 		let bounds = path.bounds(provinceData);

// 		let s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height)
//      let t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

// 		// console.log('pathbounds', path.bounds(d));

// 		let dx = bounds[1][0] - bounds[0][0]
// 		let dy = bounds[1][1] - bounds[0][1]
// 		let x = (bounds[0][0] + bounds[1][0]) / 2
// 		let y = (bounds[0][1] + bounds[1][1]) / 2
// 		let scale = 0.8 / Math.max(dx / w, dy / h);
// 		let translate = [w / 2 - scale * x, h / 2 - scale * y];

// 		console.log({dx});
// 		console.log({dy});
// 		console.log({x});
// 		console.log({y});
// 		console.log('scale: ', scale);
// 		console.log('translate: ', translate);

// 		g.transition()
// 			.duration(770)
// 			.style('stroke-width', 1.5 / scale + 'px')
// 			.attr('transform', 'translate(' + translate + ') scale(' + scale + ')');
// 	}

// 	function reset() {
// 		active.classed('active', false);
// 		active = select(null);

// 		g.transition().duration(800).style('stroke-width', '1.5px').attr('transform', '');
// 	}

// 	const createMap = async (node, dataUrl) => {
// 		// console.log(node.width);

// 		provinceData = await json(dataUrl)
// 			.then(json => {
// 				return feature(json, json.objects.provs);
// 			})
// 			.catch(error => error);

// 		// console.log('provinceData OBJ:', provinceData);

// 		projection = geoEquirectangular()
// 			.center([-58, -38]) // set centre to further North as we are cropping more off bottom of map
// 			.scale(600) // scale to fit group width
// 			.translate([w / 2, h / 2]) // ensure centred in group
// 			.fitSize([w, h], provinceData);

// 		// console.log('path', path);

// 		path = geoPath().projection(projection);

// 		// console.log('path', path);

// 		// const mapHolderElement = node.querySelector('#map-holder');

// 		svg = select(node).append('svg').attr('width', w).attr('height', h);

// 		closeButton = select('#close-button').on('click', reset);

// 		svg.append('rect').attr('class', 'background').attr('width', w).attr('height', h).on('click', reset);

// 		g = svg.append('g').style('stroke-width', '1.5px');

// 		g.selectAll('path')
// 			.data(provinceData.features)
// 			.enter()
// 			.append('path')
// 			.attr('d', path)
// 			.attr('id', function (d, i) {
// 				return 'province' + d.properties.np;
// 			})
// 			.attr('class', 'province')
// 			.on('click', clicked);

// 		g.append('path')
// 			.datum(
// 				mesh(provinceData, function (a, b) {
// 					return a !== b;
// 				})
// 			)
// 			.attr('class', 'mesh')
// 			.attr('d', path);
// 	};

// 	return {createMap};
// };
