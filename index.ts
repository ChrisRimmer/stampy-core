// This import has to be quite early as it sets variables other
import "./env.ts";
import { serve } from "./deps.ts";
import { router as backendRouter } from "./api/router.ts";
import { router as frontendRouter } from "./front/router.ts";

serve((req, connInfo) => {
	const path = new URL(req.url).pathname;
	if (path.startsWith("/api")) return backendRouter(req, connInfo);
	else return frontendRouter(req, connInfo);
});
