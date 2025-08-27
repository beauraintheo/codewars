export const josephus = <T>(items: T[], k: number, lastIndex?: number): T[] => {
  lastIndex = lastIndex ?? 0;

  if (items.length === 0) return [];

  const newIndex: number = (lastIndex + k - 1) % items.length;

  const sliceItem: T = items[newIndex];
  const slicedArray: T[] = items.slice(0, newIndex).concat(items.slice(newIndex + 1));

  return [sliceItem, ...josephus(slicedArray, k, newIndex)];
};
