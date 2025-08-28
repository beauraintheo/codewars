import { assert } from "chai";

import { decompose } from "./index.ts";

function testing(n: number, expected: number[]) {
  assert.deepEqual(decompose(n), expected);
}

describe("Fixed Tests", function () {
  it("Basic tests decompose", function () {
    testing(50, [1, 3, 5, 8, 49]);
    testing(44, [2, 3, 5, 7, 43]);
  });
});
