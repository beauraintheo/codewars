export const duplicateEncode = (word: string): string => {
  const splittedWord: string[] = word.toLowerCase().split("");

  const duplicatesLetters = splittedWord.reduce((acc: { [key: string]: number }, curr: string) => {
    if (acc[curr]) return { ...acc, [curr]: ++acc[curr] };
    return { ...acc, [curr]: 1 };
  }, {});

  return splittedWord.map((c) => (duplicatesLetters[c] === 1 ? "(" : ")")).join("");
};
