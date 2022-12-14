import { configSync } from "./deps.ts";

const alreadySetKeys = Object.keys(Deno.env.toObject());
if (
	!alreadySetKeys.includes("DBHOST") ||
	!alreadySetKeys.includes("DBPORT") ||
	!alreadySetKeys.includes("DBPASS") ||
	!alreadySetKeys.includes("TOKENSEED")
) {
	configSync({ safe: true, export: true });
}
