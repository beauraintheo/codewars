export const findOdd = (xs: number[]): number => xs.reduce((acc, n) => acc ^ n, 0);
