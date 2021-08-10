export const byCostAscending = <T extends { readonly cost: number }>({ cost: a }: T, { cost: b }: T): -1 | 0 | 1 => {
  return a > b ? 1 : b > a ? -1 : 0;
};
