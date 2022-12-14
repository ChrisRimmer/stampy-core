import { ReactChild } from "react";

const mainStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
};

export default ({ children }: { children: ReactChild | ReactChild[] }) => {
	<main style={mainStyle}>
		{children}
	</main>;
};
