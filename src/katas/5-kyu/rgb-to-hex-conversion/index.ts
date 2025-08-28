const decToHex = (decimalValue: number): string => {
  if (decimalValue < 0) return "00";
  if (decimalValue > 255) return "FF";

  const hexValue = decimalValue.toString(16).toUpperCase();
  return hexValue.length === 1 ? `0${hexValue}` : hexValue;
};

export const rgb = (r: number, g: number, b: number): string =>
  `${decToHex(r)}${decToHex(g)}${decToHex(b)}`;
