import * as d3 from 'd3';
import {feature, mesh} from 'topojson-client';

export function mapApi(nodeRef, ar, cb) {
	const width = nodeRef.current.clientWidth;
	const height = nodeRef.current.clientHeight;
	const container = d3.select(nodeRef.current);
	const projection = d3.geoMercator().fitSize([width, height], feature(ar, ar.objects.provs));
	const path = d3.geoPath().projection(projection);

	const zoom = d3
		.zoom()
		.scaleExtent([1, 9])
		.translateExtent([
			[0, 0],
			[1 * width, 1 * height]
		])
		.on('zoom', zoomed);

	// const closeButton =  container.append('button').attr('class', 'close-button').on('click', reset);

	const svg = container.append('svg').attr('viewBox', [0, 0, width, height]).on('click', reset);

	const g = svg.append('g');

	const provinces = g
		.append('g')
		.attr('fill', '#005ce6')
		.attr('cursor', 'pointer')
		.selectAll('path')
		.data(feature(ar, ar.objects.provs).features)
		.join('path')
		.attr('class', 'county')
		.attr('id', function (d) {
			return 'e' + d.properties.state_code;
		})
		.on('click', clicked)
		.attr('d', path);

	provinces.append('title').text(d => d.properties.name);

	g.append('path')
		.attr('fill', 'none')
		.attr('stroke', '#F8F2F2')
		.attr('stroke-linejoin', 'round')
		.attr('d', path(mesh(ar, ar.objects.provs, (a, b) => a !== b)));

	svg.call(zoom);

	function reset() {
		provinces.transition().style('fill', null);
		svg.transition()
			.duration(750)
			.call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
	}

	function clicked(event, d) {
		console.log(d.id.length);
		if (d.id.length === 5) {
			return;
		} else {
			g.selectAll('.featureMun').remove();
			g.selectAll('#marcoMun').remove();
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			event.stopPropagation();
			svg.transition()
				.duration(750)
				.call(
					zoom.transform,
					d3.zoomIdentity
						.translate(width / 2, height / 2)
						.scale(4, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
						.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
					d3.pointer(event, svg.node())
				);
			// console.log('"D": ', d);
			const mun = getMunicipios(d.id, ar.objects.dptos.geometries);
			// console.log('mun', mun);
			dibujaMunicipios(mun);
		}
	}

	function zoomed(event, d) {
		const {transform} = event;
		// console.log(transform);
		g.attr('transform', transform);
		g.attr('stroke-width', 1 / transform.k);
		d3.select(d).attr('opacity', 1 / transform.k);
	}

	function dibujaMunicipios(mun) {
		// console.log('mun', mun);
		// console.log('featMun', feature(ar, mun).features);
		let municipios = g.selectAll('.featureMun').data(feature(ar, mun).features, function (d) {
			return d.properties.claveMun;
		});

		municipios.exit().remove();

		municipios
			.enter()
			.append('path')
			.merge(municipios)
			.attr('d', path)
			.attr('class', 'featureMun')
			.attr('id', function (d) {
				return 'm' + d.properties.claveMun;
			})
			.on('click', function (e, d) {
				console.log(d);
				console.log(d.properties.nd);
				e.stopPropagation();
			});

		g.append('path')
			.datum(
				feature(ar, mun, function (a, b) {
					return a !== b;
				})
			)
			.attr('id', 'marcoMun')
			.attr('class', 'mesh')
			.attr('d', path)
			.attr('fill', '#66a3ff')
			.attr('stroke', '#F8F2F2')
			.attr('stroke-linejoin', 'round');
	}
}

function getMunicipios(idProvincia, municipios) {
	// console.log('idProvincia', idProvincia);
	// console.log('idProvincia', typeof idProvincia);
	// console.log('municipios', municipios);
	// console.log('municipio', municipios[0]);
	let filteredMun = municipios.filter(municipio => municipio.id.startsWith(idProvincia));

	return {
		type: 'GeometryCollection',
		geometries: filteredMun
	};
}
