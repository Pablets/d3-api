import {useEffect, useState} from 'react';
import {json} from 'd3-fetch';
import {geoEquirectangular, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';

const dataUrl = 'https://elecciones2017.lanacion.com.ar/multimedia/proyectos/17/elecciones/elecciones_2017_paso_mapa_resultados/data/arg_opt.json';

const defaultColor = '#ddd';

let geoData;
let geoJson;
let geoPathGenerator;

const constructProvinces = (mapSize, geoData) => {
	let parsedData = geoData;

	const projection = geoEquirectangular().fitSize(mapSize, parsedData);
	geoPathGenerator = geoPath().projection(projection);

	const provinces = geoJson.features.map(feature => {
		let svgProps = {
			d: geoPathGenerator(feature) || '',
			stroke: defaultColor,
			fill: defaultColor
		};

		return {
			name: feature.properties.np,
			svg: svgProps
		};
	});

	return provinces;
};

const useCoffeeData = () => {
	return {
		constructProvinces,
		geoData,
		geoJson,
		geoPathGenerator
	};
};

export default useCoffeeData;
