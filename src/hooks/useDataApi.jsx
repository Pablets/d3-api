import {useState, useEffect} from 'react';
import { feature } from 'topojson-client';

const useDataApi = (initialUrl, initialData) => {
	const [data, setData] = useState(initialData);
	const [url, setUrl] = useState(initialUrl);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const makeAPICall = async () => {
			setIsLoading(true);
			try {
				fetch(url).then(response => {
					if (response.status !== 200) {
						// console.log(`There was a problem: ${response.status}`);
						throw new Error(`There was a problem: ${response.status}`);
					}
					response.json().then(worlddata => {
						setData(feature(worlddata, worlddata.objects));
					});
				});
			} catch (err) {
				console.log('err', err);
			}

			setIsLoading(false);
		};
		makeAPICall();
	}, [url]);

	return [{data, isLoading}, setUrl];
};

export default useDataApi;
