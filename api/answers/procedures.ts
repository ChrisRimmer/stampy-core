import * as repository from "./repository.ts";
import { Procedure } from "../utils/boundaries.ts";


export const readOne: Procedure = async ({ routeParameters }) => [
	200,
	await repository.readOne(parseInt(routeParameters.id))
];

export const readAll: Procedure = async () => [
	200,
	await repository.readAll()
]

export const createOne: Procedure = () => [
	501,
	// Not implemented
	null
]