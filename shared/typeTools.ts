/**
 * Construct a type with the properties of T except at least one of the properties in type K must be defined
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
	& Pick<T, Exclude<keyof T, Keys>>
	& {
		[K in Keys]-?:
			& Required<Pick<T, K>>
			& Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

/**
 * Construct a type with the properties of T except those in type K are optional
 */
export type Option<T, Keys extends keyof T = keyof T> =
	& Pick<T, Exclude<keyof T, Keys>>
	& Pick<Partial<T>, Keys>;

export const isNotNull = <T>(value: T | null | undefined): value is T =>
	value != null;
export const isEntryNotNull = <_, T>(
	entry: [_, T | null | undefined],
): entry is [_, T] => entry[1] != null;
