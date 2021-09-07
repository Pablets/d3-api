import React from 'react';
import {CreateMapAPI} from '../lib/map.api.js';

const mapApi = CreateMapAPI();

const argMap3 = 'https://elecciones2017.lanacion.com.ar/multimedia/proyectos/17/elecciones/elecciones_2017_paso_mapa_resultados/data/arg_opt.json';

const MapComponent = () => {
	const [provinceName, setProvinceName] = React.useState('Buenos Aires');
	let nodeRef = React.useRef(null);

	const cb = provinceName => {
		setProvinceName(provinceName);
	};

	React.useEffect(() => {
		mapApi.createMap(nodeRef.current, argMap3, cb);
	});

	return (
		<>
			<div id='map-holder' ref={nodeRef}></div>
			<h1>{provinceName}</h1>
		</>
	);
};

export default MapComponent;
