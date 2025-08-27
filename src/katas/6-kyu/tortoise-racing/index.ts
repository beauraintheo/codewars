export const race = (v1: number, v2: number, g: number): [number, number, number] | null => {
  if (v1 >= v2) return null;

  const t = g / (v2 - v1);
  const totalSeconds = Math.floor(t * 3600);

  return [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ];
};
