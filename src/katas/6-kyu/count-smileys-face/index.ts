export const countSmileys = (arr: string[]): number =>
  arr.filter(
    (smiley) =>
      (smiley.length === 2 && [":", ";"].includes(smiley[0]) && [")", "D"].includes(smiley[1])) ||
      (smiley.length === 3 &&
        [":", ";"].includes(smiley[0]) &&
        ["-", "~"].includes(smiley[1]) &&
        [")", "D"].includes(smiley[2])),
  ).length;
