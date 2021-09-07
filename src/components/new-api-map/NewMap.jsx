import React from 'react';
import {mapApi} from '../../lib/new.map.api';
// import useFetchData from '../../hooks/useFetchData';

const url = 'https://elecciones2017.lanacion.com.ar/multimedia/proyectos/17/elecciones/elecciones_2017_paso_mapa_resultados/data/arg_opt.json';

const NewMap = () => {
	const [provinceName, setProvinceName] = React.useState('Buenos Aires');
	const [svgMap, setSvgMap] = React.useState(null);

	let nodeRef = React.useRef(null);

	const cb = provinceName => {
		setProvinceName(provinceName);
	};

	React.useEffect(() => {
		fetch(url).then(response => {
			if (response.status !== 200) {
				console.log(`There was a problem: ${response.status}`);
				return;
			}
			response.json().then(fetchedData => {
				// console.log('linea24:', worlddata);
				setSvgMap(mapApi(nodeRef, fetchedData, cb));
			});
		});
	}, [svgMap]);

	return (
		<>
			<div id='map-holder' ref={nodeRef}>
				{svgMap && svgMap}
			</div>
			<h1>{provinceName}</h1>
		</>
	);
};

export default NewMap;
