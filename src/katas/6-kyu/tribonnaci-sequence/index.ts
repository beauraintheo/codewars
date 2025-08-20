export const tribonacci = (arr: [number, number, number], n: number): number[] => {
  if (n < arr.length) return arr.slice(0, n);
  const next = arr[arr.length - 1] + arr[arr.length - 2] + arr[arr.length - 3];

  return tribonacci([...arr, next] as unknown as [number, number, number], n);
};
