import { assert } from "chai";

import { findMissingLetter } from "./index.ts";

describe("solution", function () {
  it("exampleTests", function () {
    assert.equal(findMissingLetter(["a", "b", "c", "d", "f"]), "e");
    assert.equal(findMissingLetter(["O", "Q", "R", "S"]), "P");
  });
});
