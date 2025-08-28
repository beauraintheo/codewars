const backtracking = (remaining: number, max: number): number[] | null => {
  if (remaining === 0) return [];

  for (let i = max ?? remaining - 1; i > 0; i--) {
    if (Math.pow(i, 2) <= remaining) {
      const res = backtracking(remaining - i * i, i - 1);
      if (res) return [...res, i];
    }
  }

  return null;
};

export const decompose = (n: number): null | number[] => backtracking(Math.pow(n, 2), n - 1);
