export const validISBN10 = (isbn: string): boolean => {
  if (isbn.length !== 10 || !isbn.match(/^[0-9]*[0-9X]$/)) return false;

  return (
    isbn
      .split("")
      .reduce(
        (acc: number, curr: string, index: number) =>
          acc + (curr === "X" ? 10 : parseInt(curr, 10)) * (index + 1),
        0,
      ) %
      11 ===
    0
  );
};
