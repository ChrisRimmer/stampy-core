import { Route } from "../routes.ts";
import { pattern } from "../utils/urlPatterns.ts";
import * as procedures from "./procedures.ts";

export const answerCollection = pattern(
	"/answers",
);
export const answer = pattern(
	`/answers/:id`,
);

export const all: Route[] = [
	{
		method: "GET",
		path: answerCollection,
		procedure: procedures.readAll,
	},
	{
		method: "GET",
		path: answer,
		procedure: procedures.readOne,
	},
];
