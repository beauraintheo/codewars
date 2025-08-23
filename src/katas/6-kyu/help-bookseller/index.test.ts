import { assert } from "chai";

import { stockList } from "./index.ts";

function testing(listOfArt: string[], listOfCat: string[], expected: string) {
  assert.strictEqual(stockList(listOfArt, listOfCat), expected);
}

describe("Fixed Tests", function () {
  let b: string[], c: string[], res: string;
  it("Basic tests stockList", function () {
    b = ["BBAR 150", "CDXE 515", "BKWR 250", "BTSQ 890", "DRTY 600"];
    c = ["A", "B", "C", "D"];
    res = "(A : 0) - (B : 1290) - (C : 515) - (D : 600)";
    testing(b, c, res);
  });
});
