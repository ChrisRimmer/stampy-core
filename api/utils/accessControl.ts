import { bcrypt } from "../../deps.ts";
export const isGlobalAdmin = async (secret: string) =>
	await bcrypt.compare(secret, Deno.env.get("ADMINPASS") || "");
