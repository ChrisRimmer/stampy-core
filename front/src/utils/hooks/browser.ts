import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
	const location = useLocation();
	return location.search;
};

export const useQueryParam = (paramName: string): string => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	if (!params.has(paramName)) throw "Param not set";
	else return params.get(paramName) ?? "";
};
