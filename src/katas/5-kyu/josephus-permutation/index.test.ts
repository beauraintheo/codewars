import { expect } from "chai";

import { josephus } from "./index.ts";

describe("Sample test cases", function () {
  it("tests", function () {
    expect(josephus([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(josephus([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2)).to.eql([2, 4, 6, 8, 10, 3, 7, 1, 9, 5]);
    expect(josephus(["C", "o", "d", "e", "W", "a", "r", "s"], 4)).to.eql([
      "e",
      "s",
      "W",
      "o",
      "C",
      "d",
      "r",
      "a",
    ]);
    expect(josephus([1, 2, 3, 4, 5, 6, 7], 3)).to.eql([3, 6, 2, 7, 5, 1, 4]);
    expect(josephus([], 3)).to.eql([]);
  });
});
