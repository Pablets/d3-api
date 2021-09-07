import {useState, useEffect} from 'react';

const useFetchData = (initialUrl, initialData) => {
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
					response.json().then(arData => {
						console.log('arData', arData);
						setData(arData);
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

export default useFetchData;
