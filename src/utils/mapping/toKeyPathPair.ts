export const toKeyPathPair = <T extends string>(name: T): readonly [key: Lowercase<T>, path: `../assets/${Lowercase<T>}.png`] => {
  const lowerCase = name.toLowerCase() as Lowercase<T>;

  return [lowerCase, `../assets/${lowerCase}.png`] as const;
};
