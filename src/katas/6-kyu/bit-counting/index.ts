export const countBits = (n: number): number =>
  n.toString(2).split("").map(Number).filter(Boolean).length;
