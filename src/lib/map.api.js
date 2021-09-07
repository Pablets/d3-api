import {geoEquirectangular, geoPath} from 'd3-geo';
import {select} from 'd3-selection';
import {feature, mesh} from 'topojson-client';
import {json} from 'd3-fetch';
import {transition} from 'd3-transition';

// const transi

export const CreateMapAPI = () => {
	const createMap = async (node, dataUrl, dataCb) => {
		let w = 400;
		let h = 400;
		let active = select(null);
		let path;
		let svg;
		let projection;
		let closeButton;
		let g;
		let provinceData;
		let detail = false;

		provinceData = await json(dataUrl);

		let data = {
			provinceData: feature(provinceData, provinceData.objects.provs),
			deptosData: feature(provinceData, provinceData.objects.dptos)
		};

		let parsedData = detail ? data.deptosData : data.provinceData;

		projection = geoEquirectangular()
			.center([-58, -38]) // set centre to further North as we are cropping more off bottom of map
			.scale(500) // scale to fit group width
			.translate([w / 2, h / 2]) // ensure centred in group
			.fitSize([w, h], parsedData);

		path = geoPath().projection(projection);

		// const mapHolderElement = select('#map-holder');

		svg = select('#map-holder').append('svg').attr('width', node.clientWidth).attr('height', node.clientHeight);

		// console.log(node.children);
		closeButton = select('#map-holder').append('div').attr('id', 'close-button');

		closeButton.append('text').text('x').on('click', reset);

		svg.append('rect').attr('class', 'background').attr('width', w).attr('height', h).on('click', reset);

		// g = countriesGroup
		g = svg.append('g').style('stroke-width', '1.5px');

		g.selectAll('path')
			.data(parsedData.features)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('id', function (d, i) {
				let provName = d.properties.np.replace(' ', '');
				return provName.toLowerCase();
			})
			.attr('class', 'province')
			.on('click', clicked);

		g.append('path')
			.datum(
				mesh(provinceData, provinceData, function (a, b) {
					return a !== b;
				})
			)
			.attr('class', 'mesh')
			.attr('d', path);

		function clicked(d) {
			let index = el => {
				return [...el.target.parentElement.children].indexOf(el.target);
			};

			if (active.node() === this) return reset();
			active.classed('active', false);
			active = select(this).classed('active', true);

			let idx = index(d);

			console.log('idx', parsedData.features[idx]);
			console.log(path);
			console.log(path.bounds());

			let bounds = path.bounds(parsedData.features[idx]);

			let dx = bounds[1][0] - bounds[0][0];
			let dy = bounds[1][1] - bounds[0][1];
			let x = (bounds[0][0] + bounds[1][0]) / 2;
			let y = (bounds[0][1] + bounds[1][1]) / 2;
			let scale = 0.8 / Math.max(dx / w, dy / h);
			let translate = [w / 2 - scale * x, h / 2 - scale * y];

			g.transition()
				.duration(770)
				.style('stroke-width', 1.5 / scale + 'px')
				.attr('transform', 'translate(' + translate + ') scale(' + scale + ')');
			dataCb(d.target.__data__.properties.np);

			detail = true;
		}

		function reset() {
			active.classed('active', false);
			active = select(null);

			g.transition().duration(800).style('stroke-width', '1.5px').attr('transform', '');
		}
	};

	return {createMap};
};
