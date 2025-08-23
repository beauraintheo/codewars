export const sqInRect = (l: number, w: number): null | number[] => {
  if (l === w) return null;

  const recurse = (l: number, w: number): number[] => {
    if (l === w) return [l];

    return l > w ? [w, ...(recurse(l - w, w) ?? [])] : [l, ...(recurse(l, w - l) ?? [])];
  };

  return recurse(l, w);
};
