export const orderWeight = (weights: string): string => {
  const weightsList: Array<{ key: string; value: number }> = weights.split(" ").map((weight) => ({
    key: weight,
    value: weight.split("").reduce((acc, curr) => acc + parseInt(curr), 0),
  }));

  return weightsList
    .sort((a, b) => (a.value === b.value ? a.key.localeCompare(b.key) : a.value - b.value))
    .map((weight) => weight.key)
    .join(" ");
};
