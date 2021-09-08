import React from 'react';
import {mapApi} from '../../lib/new.map.api';
import {feature, merge} from 'topojson-client';
// import useFetchData from '../../hooks/useFetchData';

const url = 'https://elecciones2017.lanacion.com.ar/multimedia/proyectos/17/elecciones/elecciones_2017_paso_mapa_resultados/data/arg_opt.json';

const NewMap = () => {
	const gba = ['02003', '02128', '02035', '02053', '02089', '02134', '02080', '02130', '02129', '02052', '02079', '02133', '02061', '02118', '02077', '02062', '02070', '02036', '02132', '02038', '02092', '02122', '02011', '02004', '02106', '02113', '02105'];

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
				// console.log('linea24:', fetchedData.objects.provs);

				let {geometries} = fetchedData.objects.dptos;

				const newProvs = geometries.filter(el => el.id.startsWith('02'));
				const interiorBA = newProvs.filter(el => !gba.includes(el.id));
				const granBA = newProvs.filter(el => gba.includes(el.id));
				console.log(granBA);
				fetchedData.objects.provs.geometries.push(merge(granBA));
				console.log(fetchedData.objects.provs.geometries);

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
