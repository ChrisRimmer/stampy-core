import { NotFoundException } from "./exceptions.ts";

export const pattern = (pathname: string): URLPattern => {
	try {
		return new URLPattern({ pathname: `/api${pathname}` });
	} catch (error) {
		console.error(pathname);
		console.error(error);
	}
	throw "error";
};

export const getSearchParams = (
	req: Request,
): Record<string, string> => Object.fromEntries(new URL(req.url).searchParams);

export const getSearchParam = (
	req: Request,
	parameterName: string,
) => new URL(req.url).searchParams.get(parameterName);

export const getURLParams = (
	request: Request,
	pattern: URLPattern,
): Record<string, string> => {
	const requestURL = new URL(request.url);
	const params = pattern.exec(requestURL)?.pathname.groups;
	if (params == null) {
		throw new NotFoundException(
			"URL parameters",
			pattern.pathname,
		);
	} else return params;
};
