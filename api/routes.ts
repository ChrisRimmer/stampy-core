import * as boundaries from "./utils/boundaries.ts";
import { all as answerRoutes } from "./answers/routes.ts";
import { all as questionRoutes } from "./questions/routes.ts";

export interface Route {
	method: string;
	path: URLPattern;
	procedure: boundaries.Procedure;
}

export const routes: Route[] = [
	...answerRoutes,
	...questionRoutes,
];
