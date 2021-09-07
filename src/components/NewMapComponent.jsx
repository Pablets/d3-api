import React, {useState, useEffect, useRef, useMemo} from 'react';
import * as d3 from 'd3';
import useDataApi from '../../src/hooks/useDataApi';
// import {boroughLegend} from '../services/legend';
// import './styles.css'
// const url = 'https://raw.githubusercontent.com/jkeohan/D3-Tutorials/3f3e4fb52aea827455fd4cc7c4893eb37f58e411/nyc.counties.json';
const url = 'https://elecciones2017.lanacion.com.ar/multimedia/proyectos/17/elecciones/elecciones_2017_paso_mapa_resultados/data/arg_opt.json';

const NewMapComponent = props => {
	let w = 400;
	let h = 400;
	let [{data}] = useDataApi(url, []);
	const svgRef = useRef();
	const projRef = useRef(
		d3
			.geoMercator()
			.center([-58, -38]) // set centre to further North as we are cropping more off bottom of map
			.scale(51000) // scale to fit group width
			.translate([w / 2, h / 2]) // ensure centred in group
			.fitSize([w, h], data[0])
	);
	const pathRef = useRef();

	// CREATES THE PROJECTION AND RENDERS CHART AND PARKS
	useEffect(() => {
		// GRAB CURRENT WIDTH/HEIGHT OF DIV ID="MAP"
		const height = svgRef.current.clientHeight;
		const width = svgRef.current.clientWidth;
		// FINE TUNE THE POSITION THE MAP WITHING THE ELEMENT
		projRef.current.translate([width / 2, height / 2]);
		// ASSING THE GEOPATH A PROJECTION
		pathRef.current = d3.geoPath().projection(projRef.current);
	}, [data]);

	const renderChart = () => {
		return data[0].features.map((d, i) => {
			const featurePath = `${pathRef.current(d)}`;
			return <path key={i} d={featurePath} className={d.properties.name} fill={'gray'} />;
		});
	};

	return (
		<svg id='boroughs-map' ref={svgRef}>
			{data.length && renderChart()}
		</svg>
	);
};

export default NewMapComponent;
