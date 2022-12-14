import {
	decode as bDec,
	encode as bEnc,
} from "https://deno.land/std@0.153.0/encoding/base64url.ts";

const tEnc = (d: string) => new TextEncoder().encode(d);
const tDec = (d: Uint8Array) => new TextDecoder().decode(d);

const genKey = async (k: string) => (
	await crypto.subtle.importKey(
		"raw",
		tEnc(k),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	)
);

const key = await genKey(Deno.env.get("TOKENSEED") as string);

export const create = async (data: unknown) => {
	const payload = bEnc(tEnc(JSON.stringify({ alg: "HS256", typ: "JWT" }))) +
		"." + bEnc(tEnc(JSON.stringify(data)));
	const signature = bEnc(
		new Uint8Array(
			await crypto.subtle.sign({ name: "HMAC" }, key, tEnc(payload)),
		),
	);
	return `${payload}.${signature}`;
};

export const read = async (jwt: string) => {
	const jwtParts = jwt.split(".");
	if (jwtParts.length !== 3) return;
	const data = tEnc(jwtParts[0] + "." + jwtParts[1]);
	if (
		await crypto.subtle.verify(
			{ name: "HMAC" },
			key,
			bDec(jwtParts[2]),
			data,
		) === true
	) {
		return JSON.parse(tDec(bDec(jwtParts[1])));
	}
};
