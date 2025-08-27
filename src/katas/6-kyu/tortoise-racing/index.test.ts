import { assert } from "chai";

import { race } from "./index.ts";

function testing(v1: number, v2: number, g: number, expected: number[] | null) {
  const act = race(v1, v2, g);
  assert.deepEqual(act, expected);
}

describe("Fixed Tests", function () {
  it("Basic tests race", function () {
    testing(720, 850, 70, [0, 32, 18]);
    testing(80, 91, 37, [3, 21, 49]);
    testing(80, 100, 40, [2, 0, 0]);
    testing(720, 850, 37, [0, 17, 4]);
    testing(611, 811, 62, [0, 18, 36]);
  });
});
