export const createGrid = (sizeX: number, sizeY: number): readonly (readonly [x: number, y: number])[] => {
  const grid: (readonly [x: number, y: number])[] = [];

  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      grid.push([x * 63, y * 64] as const);
    }
  }

  return grid;
};
