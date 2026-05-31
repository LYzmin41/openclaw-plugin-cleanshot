import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateFilepathParam } from "../src/index.js";

describe("validateFilepathParam", () => {
  it("accepts normal paths", () => {
    assert.equal(validateFilepathParam("/tmp/example.png"), "/tmp/example.png");
  });

  it("rejects empty strings", () => {
    assert.throws(() => validateFilepathParam(""), /must not be empty/);
  });

  it("rejects newline injection", () => {
    assert.throws(
      () => validateFilepathParam("/tmp/example.png\ncleanshot://settings"),
      /newline/
    );
  });
});
