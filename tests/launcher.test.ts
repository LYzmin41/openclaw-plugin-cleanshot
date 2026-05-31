import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCleanShotUrl } from "../src/launcher.js";

describe("validateCleanShotUrl", () => {
  it("rejects https URLs", () => {
    assert.throws(
      () => validateCleanShotUrl("https://example.com"),
      /non-CleanShot URL/
    );
  });

  it("rejects file URLs", () => {
    assert.throws(
      () => validateCleanShotUrl("file:///Applications/Calculator.app"),
      /non-CleanShot URL/
    );
  });

  it("rejects empty strings", () => {
    assert.throws(() => validateCleanShotUrl(""), /cannot be empty/);
  });

  it("rejects non-string values", () => {
    assert.throws(() => validateCleanShotUrl(null), /must be a string/);
  });

  it("rejects newline injection", () => {
    assert.throws(
      () => validateCleanShotUrl("cleanshot://capture-fullscreen?action=save\nfile:///tmp/nope"),
      /newline/
    );
  });

  it("accepts CleanShot URLs", () => {
    assert.equal(
      validateCleanShotUrl("cleanshot://capture-fullscreen?action=save"),
      "cleanshot://capture-fullscreen?action=save"
    );
  });
});
