import { Route } from "../routes.ts";
import { pattern } from "../utils/urlPatterns.ts";
import * as procedures from "./procedures.ts";

export const questionCollection = pattern( "/questions", );

export const question = pattern( `/questions/:id`, );

export const all: Route[] = [
	{
		method: "GET",
		path: questionCollection,
		procedure: procedures.readAll,
	},
];
