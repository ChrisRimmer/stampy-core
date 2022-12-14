import { useLocalStorage } from "./localStorage";

export const useSecret = () => {
	const [secret] = useLocalStorage("secret");
	return secret;
};
