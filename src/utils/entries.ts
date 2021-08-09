export const entries = Object.entries as <T>(o: T) => readonly (readonly [keyof T, T[keyof T]])[];
