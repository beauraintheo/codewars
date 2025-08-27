export const removeNb = (n: number): number[][] => {
  const sum: number = (n * (n + 1)) / 2;
  const max = sum + 1;

  const result: number[][] = [];

  for (let d = 0; d < Math.sqrt(max); d++) {
    if (max % d === 0) {
      let a = d - 1;
      let b = max / d - 1;

      if (a >= 1 && a <= n && b >= 1 && b <= n) result.push([a, b]);

      if (d !== max / d) {
        a = max / d - 1;
        b = d - 1;

        if (a >= 1 && a <= n && b >= 1 && b <= n) result.push([a, b]);
      }
    }
  }

  return result.sort((a, b) => a[0] - b[0]);
};
