import { useState, useEffect } from 'react';
import axios from 'axios';
import { QUERY_PARAMS, API, MESSAGES } from '../constants';

export default function Greetings() {
	const [message, setMessage] = useState<string | null>(null);
	const apiUrl = API.MESSAGE_PATH;
	const queryParams = `?lang=${QUERY_PARAMS.DEFAULT_LANG}&type=${QUERY_PARAMS.DEFAULT_TYPE}`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log(apiUrl);
				const res = await axios.get(`${apiUrl}${queryParams}`);
				if (res.data?.message) {
					setMessage(res.data.message);
				} else {
					console.warn(MESSAGES.FIELD_NOT_FOUND, res.data);
				}
			} catch (err) {
				console.error(err);
			}
		};
		fetchData();
	}, [apiUrl, queryParams]);

	return (
		<div>
			{message ? <h1>{message}</h1> : <p>{MESSAGES.LOADING}</p>}
		</div>
	);
}
