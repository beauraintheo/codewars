import { assert } from "chai";

import { validISBN10 } from "./index.ts";

const sampleTests: [string, boolean][] = [
  ["1112223339", true],
  ["048665088X", true],
  ["1293000000", true],
  ["1234554321", true],
  ["1234512345", false],
  ["1293", false],
  ["X123456788", false],
  ["ABCDEFGHIJ", false],
  ["XXXXXXXXXX", false],
  ["048665088XZ", false],
];

describe("Sample tests", () =>
  sampleTests.forEach(([input, expected]) =>
    it("Testing: " + input, () =>
      assert.equal(validISBN10(input), expected, `${input} is${expected ? "" : " not"} valid`),
    ),
  ));
