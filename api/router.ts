import { Route, routes } from "./routes.ts";
import { ClientErrorException, NotFoundException } from "./utils/exceptions.ts";
import { getSearchParams, getURLParams } from "./utils/urlPatterns.ts";
import * as jwt from "./utils/jwt.ts";
import { getCookies, Handler } from "../deps.ts";

const jsonHeader = { "content-type": "application/json; charset=UTF-8" };
const defaultHeaders = { ...jsonHeader };

const matchesRequest = (
	url: Request["url"],
	method: Request["method"],
) => (
	(route: Route): boolean => (
		route.path.test(url) &&
		route.method.toLowerCase() == method.toLowerCase()
	)
);

export const router: Handler = async (request: Request) => {
	const { url, method } = request;
	const route = routes.find(matchesRequest(url, method));

	if (!route) {
		return new Response(
			`Unable to ${request.method} ${request.url} - no request handler found for this operation`,
			{ status: 501 },
		);
	}

	try {
		const routeParameters = getURLParams(request, route.path);
		const query = getSearchParams(request);
		const cookies = getCookies(request.headers);
		const token = cookies.jwt ? await jwt.read(cookies.jwt) : undefined;
		const body = request.body ? await request.json() : null;
		const headers = Object.fromEntries(request.headers.entries());

		const reqData = {
			body,
			cookies,
			headers,
			query,
			routeParameters,
			token,
		};

		const result = await route.procedure(reqData);

		return new Response(
			JSON.stringify(result[1]), {
				headers: defaultHeaders,
			}
		);
	} catch (e) {
		if (e instanceof NotFoundException) {
			return new Response(`${e.type}: ${e.id} not found`, {
				status: 404,
				headers: { ...defaultHeaders, "content-type": "text/plain" },
			});
		} else if (e instanceof ClientErrorException) {
			return new Response(
				JSON.stringify({
					error:
						`${e.statusCode} unauthorised. Cannot ${e.operation} because ${e.failReason}`,
				}),
				{ status: e.statusCode },
			);
		} else {
			console.error("Fatal error:", e);
			console.error(new Error().stack);
			return new Response(JSON.stringify(e.stack), {
				status: 500,
				headers: {
					"content-type": "application/json; charset=UTF-8",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
	}
};
