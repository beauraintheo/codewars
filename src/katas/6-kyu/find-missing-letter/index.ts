export const findMissingLetter = (array: string[]): string => {
  const asciiArray = array.map((value) => value.charCodeAt(0));
  const completeAsciiArray = Array.from(
    { length: array[array.length - 1].charCodeAt(0) - array[0].charCodeAt(0) + 1 },
    (_, i) => i + array[0].charCodeAt(0),
  );

  return String.fromCharCode(completeAsciiArray.filter((e) => !asciiArray.includes(e))[0]);
};
