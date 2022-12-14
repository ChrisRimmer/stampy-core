import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PageWrapper from "./routes";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="" element={<PageWrapper />}>
			</Route>
		</Routes>
	</BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
