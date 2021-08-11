const COUNTERS: { [key in string]: number } = {};

export const counted = <T extends string>(str: T): `${T}: ${number}` => {
  if (typeof COUNTERS[str] !== 'number') COUNTERS[str] = 0;

  return `${str}: ${++COUNTERS[str]}` as const;
};
