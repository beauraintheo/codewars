import { assert } from "chai";

import { duplicateEncode } from "./index.ts";

describe("example", function () {
  it("test", function () {
    assert.strictEqual(duplicateEncode("din"), "(((");
    assert.strictEqual(duplicateEncode("recede"), "()()()");
    assert.strictEqual(duplicateEncode("Success"), ")())())", "should ignore case");
    assert.strictEqual(duplicateEncode("(( @"), "))((");
  });
});
