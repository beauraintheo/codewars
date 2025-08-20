export const getSum = (a: number, b: number): number => {
  const [min, max]: [number, number] = a < b ? [a, b] : [b, a];

  const valuesToSum: number[] = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return valuesToSum.reduce((acc, curr) => acc + curr, 0);
};
