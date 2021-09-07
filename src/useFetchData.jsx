import {useEffect, useState} from 'react';
import {feature} from 'topojson-client';

const useFetchData = dataUrl => {
	const [geographies, setGeographies] = useState([]);

	useEffect(() => {
		fetch(dataUrl).then(response => {
			if (response.status !== 200) {
				console.log(`There was a problem: ${response.status}`);
				return;
			}
			response.json().then(worlddata => {
				console.log({worlddata});
				setGeographies(feature(worlddata, worlddata.objects));
			});
		});
	}, [dataUrl]);

	return geographies;
};

export default useFetchData;
