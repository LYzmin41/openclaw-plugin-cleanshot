import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeDisplays, parseDisplaysJson } from "../src/displays.js";

const rawDisplays = [
  {
    name: "External Display",
    isMain: false,
    x: 1512,
    y: 0,
    width: 1920,
    height: 1080,
    visibleX: 1512,
    visibleY: 0,
    visibleWidth: 1920,
    visibleHeight: 1055,
    scale: 1
  },
  {
    name: "Built-in Retina Display",
    isMain: true,
    x: 0,
    y: 0,
    width: 1512,
    height: 982,
    visibleX: 0,
    visibleY: 37,
    visibleWidth: 1512,
    visibleHeight: 945,
    scale: 2
  }
];

describe("display geometry helpers", () => {
  it("parses valid display JSON", () => {
    const result = parseDisplaysJson(JSON.stringify(rawDisplays));

    assert.equal(result.coordinateSystem, "macos-logical-points");
    assert.equal(result.displays.length, 2);
    assert.equal(result.displays[0]?.name, "Built-in Retina Display");
  });

  it("rejects invalid JSON with a useful error", () => {
    assert.throws(() => parseDisplaysJson("{not json"), /Could not parse display geometry JSON/);
  });

  it("rejects empty display lists", () => {
    assert.throws(() => normalizeDisplays([]), /No displays were returned by macOS/);
  });

  it("creates pixel bounds from scale", () => {
    const result = normalizeDisplays([rawDisplays[1]!]);

    assert.equal(result.displays[0]?.pixelX, 0);
    assert.equal(result.displays[0]?.pixelY, 0);
    assert.equal(result.displays[0]?.pixelWidth, 3024);
    assert.equal(result.displays[0]?.pixelHeight, 1964);
  });

  it("includes visible frame by default", () => {
    const result = normalizeDisplays([rawDisplays[1]!]);

    assert.equal(result.displays[0]?.visibleX, 0);
    assert.equal(result.displays[0]?.visibleY, 37);
    assert.equal(result.displays[0]?.visibleWidth, 1512);
    assert.equal(result.displays[0]?.visibleHeight, 945);
  });

  it("sorts the main display first and assigns stable ids", () => {
    const result = normalizeDisplays(rawDisplays);

    assert.equal(result.displays[0]?.id, 1);
    assert.equal(result.displays[0]?.isMain, true);
    assert.equal(result.displays[1]?.id, 2);
    assert.equal(result.displays[1]?.name, "External Display");
  });

  it("keeps logical coordinate fields numeric", () => {
    const display = normalizeDisplays([rawDisplays[1]!]).displays[0]!;

    assert.equal(typeof display.x, "number");
    assert.equal(typeof display.y, "number");
    assert.equal(typeof display.width, "number");
    assert.equal(typeof display.height, "number");
  });

  it("omits pixel bounds when includePixelBounds is false", () => {
    const display = normalizeDisplays([rawDisplays[1]!], {
      includePixelBounds: false
    }).displays[0]!;

    assert.equal(display.pixelX, undefined);
    assert.equal(display.pixelY, undefined);
    assert.equal(display.pixelWidth, undefined);
    assert.equal(display.pixelHeight, undefined);
  });

  it("omits visible frame when includeVisibleFrame is false", () => {
    const display = normalizeDisplays([rawDisplays[1]!], {
      includeVisibleFrame: false
    }).displays[0]!;

    assert.equal(display.visibleX, undefined);
    assert.equal(display.visibleY, undefined);
    assert.equal(display.visibleWidth, undefined);
    assert.equal(display.visibleHeight, undefined);
  });
});
