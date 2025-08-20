import { assert } from "chai";
import { describe, it } from "mocha";

import { countBits } from "./index.ts";

describe("example", function () {
  it("test", function () {
    assert.equal(countBits(0), 0);
    assert.equal(countBits(4), 1);
    assert.equal(countBits(7), 3);
    assert.equal(countBits(9), 2);
    assert.equal(countBits(10), 2);
  });
});
