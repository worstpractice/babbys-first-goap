export const fromEntries = Object.fromEntries as <K extends PropertyKey, V>(t: readonly (readonly [K, V])[]) => { readonly [key in K]: NonNullable<V> };
