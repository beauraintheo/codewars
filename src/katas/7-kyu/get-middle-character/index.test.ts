import { assert } from "chai";

import { getMiddle } from "./index.ts";

function test(string: string, expected: string) {
  assert.strictEqual(getMiddle(string), expected);
}

describe("solution", function () {
  it("should handle basic tests", function () {
    test("test", "es");
    test("testing", "t");
  });
});
