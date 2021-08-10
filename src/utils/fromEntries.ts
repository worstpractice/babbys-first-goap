export const fromEntries = Object.fromEntries as <K extends PropertyKey, V>(
  t: readonly (readonly [K, V])[],
) => { readonly [key in typeof t[number][0]]: NonNullable<typeof t[number][1]> };
