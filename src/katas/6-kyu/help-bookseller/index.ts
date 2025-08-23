export const stockList = (listOfArt: string[], listOfCat: string[]): string => {
  if (listOfArt.length === 0 || listOfCat.length === 0) return "";

  const artsByPrice = listOfArt.reduce((acc: { [key: string]: number }, art: string) => {
    const [artName, price] = art.split(" ");
    const category = artName.charAt(0);

    if (Object.keys(acc).includes(category))
      return { ...acc, [category]: acc[category] + parseInt(price, 10) };
    return { ...acc, [category]: parseInt(price, 10) };
  }, {});

  return listOfCat.reduce((acc: string, category: string) => {
    const value = artsByPrice[category] || 0;

    if (acc === "") return `(${category} : ${value})`;
    return `${acc} - (${category} : ${value})`;
  }, "");
};
