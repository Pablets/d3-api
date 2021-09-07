import {useEffect, useMemo, useRef, useState} from 'react';
import {geoPath, geoMercator} from 'd3-geo';
// import {geoMercator} from 'd3-geo-projection';
import {feature} from 'topojson-client';
import * as d3 from 'd3';
import Tooltip from '../tooltip/index';
import useCoffeeData from '../../hooks/useCoffeeData';
import {useWindowSize} from 'codefee-kit';
import {select, active} from 'd3-selection';
import useDataApi from '../../hooks/useDataApi';
import {transition} from 'd3-transition';
import './WorldMap.scss';
import {json} from 'd3-fetch';

const WorldMap = () => {
	const url = 'https://elecciones2017.lanacion.com.ar/multimedia/proyectos/17/elecciones/elecciones_2017_paso_mapa_resultados/data/arg_opt.json';
	// let [{data}] = useDataApi(url, []);
	// console.log('linea16', data);
	let w = 400;
	let h = 400;
	let active = select(null);
	let path;
	let svg;
	let closeButton;
	let g;
	let provinceData;
	let detail = false;

	const tooltip = useRef(null);
	const [tooltipContent, setTooltipContent] = useState(null);
	const [mapProvinces, setMapProvinces] = useState([]);
	const {width, height} = useWindowSize();
	const {constructProvinces, geoJson, geoPathGenerator} = useCoffeeData();

	const mapSize = useMemo(() => {
		return [width || 0, height || 0];
	}, [height, width]);

	const projection = geoMercator().fitSize([w, h], mapProvinces);
	// .center([-58, -38]) // set centre to further North as we are cropping more off bottom of map
	// .scale(500) // scale to fit group width
	// .translate([w / 2, h / 2]); // ensure centred in group

	const svgRef = useRef();
	const projRef = useRef(geoPath().projection(projection));
	const pathRef = useRef();

	useEffect(() => {
		fetch(url).then(response => {
			if (response.status !== 200) {
				console.log(`There was a problem: ${response.status}`);
				return;
			}
			response.json().then(worlddata => {
				// console.log('linea51:', feature(worlddata, worlddata.objects.provs));
				setMapProvinces(feature(worlddata, worlddata.objects.provs));
			});
		});

		projRef.current.translate([width / 2, height / 2]);

		let projection;

		console.log(`projRef.current`, projRef.current);

		pathRef.current = geoPath().projection(projRef.current);
	}, []);
	console.log('PATHREF', pathRef);

	const renderChart = () => {
		let path = pathRef.current;
		return mapProvinces.features.map((d, i) => {
			console.log({d});
			const featurePath = `${path(d)}`;
			console.log('featurePath', featurePath);
			return <path key={i} d={featurePath} className={d.properties.np} fill={'gray'} />;
		});
	};

	const handleMouseOverCountry = (evt, province) => {
		if (province.isCoffeeRegion && tooltip?.current) {
			tooltip.current.style.display = 'block';
			tooltip.current.style.left = evt.pageX + 10 + 'px';
			tooltip.current.style.top = evt.pageY + 10 + 'px';
			setTooltipContent(renderTooltipContent(province));
		}

		setMapProvinces(
			mapProvinces.map(m => {
				return {
					...m,
					svg: {
						...m.svg,
						key: province.np,
						stroke: 'white',
						fill: 'tomato'
					}
				};
			})
		);
	};

	const handleMouseLeaveCountry = country => {
		if (tooltip?.current) {
			tooltip.current.style.display = 'none';
		}

		setMapProvinces(
			mapProvinces.map(m => {
				return {
					...m,
					svg: {
						...m.svg,
						stroke: 'white',
						fill: 'tomato'
					}
				};
			})
		);
	};

	const handleMouseClickProvince = e => {
		let index = el => {
			return [...el.target.parentElement.children].indexOf(el.target);
		};

		if (active.node() === this) return reset();
		active.classed('active', false);
		active = select(this).classed('active', true);

		let idx = index(e);

		let b = geoPathGenerator.bounds(geoJson.features[idx]);
		let [w, h] = mapSize;

		let dx = b[1][0] - b[0][0];
		let dy = b[1][1] - b[0][1];
		let x = (b[0][0] + b[1][0]) / 2;
		let y = (b[0][1] + b[1][1]) / 2;
		let scale = 0.8 / Math.max(dx / w, dy / h);
		let translate = [w / 2 - scale * x, h / 2 - scale * y];

		const g = select('#gElement')
			.transition()
			.duration(770)
			.style('stroke-width', 1.5 / scale + 'px')
			.attr('transform', 'translate(' + translate + ') scale(' + scale + ')');
	};

	function reset() {
		active.classed('active', false);
		active = select(null);

		const g = select('#gElement').transition().duration(800).style('stroke-width', '1.5px').attr('transform', '');
	}

	const renderTooltipContent = country => {
		return (
			<div className='WorldMap--tooltip'>
				<div className='WorldMap--tooltip--title'>{country.coffeeRegionName}</div>
				<hr />
				<p className='WorldMap--tooltip--content'>{country?.tasteProfile?.summary}</p>
			</div>
		);
	};

	console.log('mapprovinces: ', mapProvinces);

	return (
		<svg id='boroughs-map' ref={svgRef}>
			{mapProvinces?.features?.length && renderChart()}
		</svg>
	);
};

export default WorldMap;
