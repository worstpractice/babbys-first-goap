export const include = <T>(targetItem: T) => {
  const filterFn = (item: T): boolean => {
    return item === targetItem;
  };

  return filterFn;
};
