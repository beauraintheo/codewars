import { expect } from "chai";

import { determinant } from "./index.ts";

describe("determinant", function () {
  const m1 = [
    [1, 3],
    [2, 5],
  ];
  const m2 = [
    [2, 5, 3],
    [1, -2, -1],
    [1, 3, 4],
  ];

  it("of a 1 x 1 matrix should yield the value of the one element", () => {
    expect(determinant([[1]])).to.equal(1);
  });

  it("should work correctly for 2 x 2 matrix", () => {
    expect(determinant(m1)).to.equal(-1);
  });

  it("should work correctly for 3 x 3 matrix", () => {
    expect(determinant(m2)).to.equal(-20);
  });
});
