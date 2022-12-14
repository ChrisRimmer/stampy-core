import { Navigate, Outlet } from "react-router-dom";
import useCookie from "react-use-cookie";

import { useQueryParam } from "../utils/hooks/browser";

export default () => {
	try {
		const newToken = useQueryParam("jwt");
		const [savedToken, updateToken] = useCookie("jwt");
		if (newToken) {
			if (newToken !== savedToken) {
				updateToken(
					newToken,
					{ days: 30, SameSite: "Strict", Secure: true },
				);
			}
			return <Navigate to={window.location.pathname} />;
		}
	} catch (e) {
		if (e !== "Param not set") throw e;
	}

	return (
		<>
			<header className="row m-spread x-center">
				<h1>Stampy Admin</h1>
			</header>

			<main className="column top" style={{ padding: "1em 0" }}>
				<Outlet />
			</main>
		</>
	);
};
