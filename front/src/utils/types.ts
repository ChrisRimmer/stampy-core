// Returns only the names of required keys
export type RequiredKeyNames<T> = {
	[K in keyof T]-?: ({} extends { [P in K]: T[K] } ? never : K);
}[keyof T];

// Returns only the names of optional keys
export type OptionalKeyNames<T> = {
	[K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never);
}[keyof T];

// Returns only the names of keys that are allowed to be null
export type NullableKeyNames<T> = {
	[K in keyof T]: (T[K] extends NonNullable<T[K]> ? never : K);
}[keyof T];

// Returns a new type containing only the subset of keys that are required
export type RequiredKeys<T> = {
	[K in RequiredKeyNames<T>]: T[K];
};

// Returns a new type containing only the subset of keys that are optional
export type OptionalKeys<T> = {
	[K in OptionalKeyNames<T>]: T[K];
};

// Returns a new type containing only the subset of keys that are nullable
export type NullableKeys<T> = {
	[K in NullableKeyNames<T>]: T[K];
};
