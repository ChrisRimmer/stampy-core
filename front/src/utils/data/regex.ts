export const hasMatches = (string: string, pattern: RegExp) =>
	string.match(pattern)?.length ?? 0 > 0;
