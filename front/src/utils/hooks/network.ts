import { useEffect, useState } from "react";

export const useFetch = <Type>(
	initialUrl,
	initialParams = {},
	skip = false,
): {
	data: Type | null;
	isLoading: boolean;
	hasError: boolean;
	errorMessage;
	updateUrl;
	updateParams;
	refetch;
} => {
	const [url, updateUrl] = useState(initialUrl);
	const [params, updateParams] = useState(initialParams);
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [refetchIndex, setRefetchIndex] = useState(0);

	const queryString = Object.keys(params)
		.map((key) =>
			encodeURIComponent(key) + "=" +
			encodeURIComponent(params[key])
		).join("&");

	const refetch = () =>
		setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

	useEffect(() => {
		const fetchData = async () => {
			if (skip) return;
			setIsLoading(true);
			try {
				const response = await fetch(`${url}${queryString}`);
				const result = await response.json();
				if (response.ok) {
					setData(result);
				} else {
					setHasError(true);
					setErrorMessage(`${response.status}: ${response.statusText}`);
				}
			} catch (err) {
				setHasError(true);
				setErrorMessage(err.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [url, params, refetchIndex]);

	return {
		data,
		isLoading,
		hasError,
		errorMessage,
		updateUrl,
		updateParams,
		refetch,
	};
};

export const useFetchCallback = <Type>(
	initialUrl,
	setData: (arg0: Type) => void,
	{
		params: {
			initialParams = {},
			skip = false,
		} = {},
		fetchOptions = {},
	} = {},
): {
	isLoading: boolean;
	hasError: boolean;
	errorMessage;
	updateUrl;
	updateParams;
	refetch;
} => {
	const [url, updateUrl] = useState(initialUrl);
	const [params, updateParams] = useState(initialParams);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [refetchIndex, setRefetchIndex] = useState(0);

	const queryString = Object.keys(params)
		.map((key) =>
			encodeURIComponent(key) + "=" +
			encodeURIComponent(params[key])
		).join("&");

	const refetch = () =>
		setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

	useEffect(() => {
		const fetchData = async () => {
			if (skip) return;
			setIsLoading(true);
			try {
				const response = await fetch(`${url}${queryString}`, fetchOptions);
				const result = await response.json();
				if (response.ok) {
					setData(result);
				} else {
					setHasError(true);
					setErrorMessage(`${response.status}: ${response.statusText}`);
				}
			} catch (err) {
				setHasError(true);
				setErrorMessage(err.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [url, params, refetchIndex]);

	return {
		isLoading,
		hasError,
		errorMessage,
		updateUrl,
		updateParams,
		refetch,
	};
};
