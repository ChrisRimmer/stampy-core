import { NullableKeyNames } from "../types";

type UpsertAction<T> = {
	upsert: Partial<T>;
};

type RewriteAction<T> = {
	rewrite: T;
};

type ClearKeyAction<T> = {
	clear: NullableKeyNames<T>;
};

export const reduce = <T>() =>
(
	oldState: T,
	action: UpsertAction<T> | RewriteAction<T> | ClearKeyAction<T>,
): T => {
	if ("upsert" in action) return { ...oldState, ...action.upsert };
	else if ("rewrite" in action) return { ...action.rewrite };
	else if ("clear" in action) return { ...oldState, [action.clear]: null };
	else {
		console.error({ oldState, action });
		throw `Invalid action ${Object.keys(action)[0]} in generic reducer`;
	}
};
