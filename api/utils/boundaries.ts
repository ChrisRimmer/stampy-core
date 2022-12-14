import { HTTPCode } from "./http.ts";

export type ProcedureParameters = {
	body: unknown;
	cookies: Record<string, string>;
	headers: Record<string, string>;
	query: Record<string, string>;
	routeParameters: Record<string, string>;
	token?: Record<string, string | number | boolean>;
};

type ProcedureReturn = [HTTPCode, unknown];
export type Procedure = (
	params: ProcedureParameters,
) => ProcedureReturn | Promise<ProcedureReturn>;
