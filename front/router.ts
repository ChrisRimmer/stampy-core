import { Handler, serveDir } from "../deps.ts";

export const router: Handler = async (req) => {
	const path = new URL(req.url).pathname;
	if (path.startsWith("/front")) {
		return serveDir(req, {
			enableCors: true,
			fsRoot: "front/dist",
			urlRoot: "front",
		});
	} else {
		const HTML = await Deno.readFile("./front/dist/index.html");
		return new Response(
			HTML,
			{
				headers: {
					"content-type": "text/html",
				},
			},
		);
	}
};
