import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCleanShotUrl } from "../src/cleanshot-url.js";

describe("buildCleanShotUrl", () => {
  it("builds fullscreen capture with save action", () => {
    assert.equal(
      buildCleanShotUrl("capture-fullscreen", { action: "save" }),
      "cleanshot://capture-fullscreen?action=save"
    );
  });

  it("builds area capture with coordinates", () => {
    assert.equal(
      buildCleanShotUrl("capture-area", {
        action: "save",
        x: 10,
        y: 20,
        width: 300,
        height: 200
      }),
      "cleanshot://capture-area?action=save&x=10&y=20&width=300&height=200"
    );
  });

  it("builds previous area capture with copy action", () => {
    assert.equal(
      buildCleanShotUrl("capture-previous-area", { action: "copy" }),
      "cleanshot://capture-previous-area?action=copy"
    );
  });

  it("serializes booleans as true and false", () => {
    assert.equal(
      buildCleanShotUrl("self-timer", { enabled: true, showCursor: false }),
      "cleanshot://self-timer?enabled=true&showCursor=false"
    );
  });

  it("skips undefined and null params", () => {
    assert.equal(
      buildCleanShotUrl("capture-window", {
        action: "annotate",
        x: undefined,
        y: null,
        display: 1
      }),
      "cleanshot://capture-window?action=annotate&display=1"
    );
  });

  it("rejects invalid commands at runtime", () => {
    assert.throws(
      () => buildCleanShotUrl("open-anything" as never, { action: "save" }),
      /Unsupported CleanShot command/
    );
  });

  it("builds all-in-one with no params", () => {
    assert.equal(buildCleanShotUrl("all-in-one"), "cleanshot://all-in-one");
  });

  it("builds all-in-one with coordinates and display", () => {
    assert.equal(
      buildCleanShotUrl("all-in-one", {
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        display: 1
      }),
      "cleanshot://all-in-one?x=10&y=20&width=300&height=200&display=1"
    );
  });

  it("builds scrolling capture with no params", () => {
    assert.equal(buildCleanShotUrl("scrolling-capture"), "cleanshot://scrolling-capture");
  });

  it("builds scrolling capture with start and autoscroll", () => {
    assert.equal(
      buildCleanShotUrl("scrolling-capture", { start: true, autoscroll: true }),
      "cleanshot://scrolling-capture?start=true&autoscroll=true"
    );
  });

  it("builds scrolling capture with coordinates and display", () => {
    assert.equal(
      buildCleanShotUrl("scrolling-capture", {
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        display: 1
      }),
      "cleanshot://scrolling-capture?x=10&y=20&width=300&height=200&display=1"
    );
  });

  it("builds capture text with no params", () => {
    assert.equal(buildCleanShotUrl("capture-text"), "cleanshot://capture-text");
  });

  it("builds capture text with filepath", () => {
    assert.equal(
      buildCleanShotUrl("capture-text", { filepath: "/tmp/example image.png" }),
      "cleanshot://capture-text?filepath=%2Ftmp%2Fexample+image.png"
    );
  });

  it("builds capture text with linebreaks", () => {
    assert.equal(
      buildCleanShotUrl("capture-text", { linebreaks: true }),
      "cleanshot://capture-text?linebreaks=true"
    );
  });

  it("builds capture text with coordinates and display", () => {
    assert.equal(
      buildCleanShotUrl("capture-text", {
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        display: 1
      }),
      "cleanshot://capture-text?x=10&y=20&width=300&height=200&display=1"
    );
  });

  it("builds record screen with no params", () => {
    assert.equal(buildCleanShotUrl("record-screen"), "cleanshot://record-screen");
  });

  it("builds record screen with coordinates and display", () => {
    assert.equal(
      buildCleanShotUrl("record-screen", {
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        display: 1
      }),
      "cleanshot://record-screen?x=10&y=20&width=300&height=200&display=1"
    );
  });

  it("builds open annotate with filepath", () => {
    assert.equal(
      buildCleanShotUrl("open-annotate", { filepath: "/tmp/example.png" }),
      "cleanshot://open-annotate?filepath=%2Ftmp%2Fexample.png"
    );
  });

  it("builds pin with filepath", () => {
    assert.equal(
      buildCleanShotUrl("pin", { filepath: "/tmp/example.png" }),
      "cleanshot://pin?filepath=%2Ftmp%2Fexample.png"
    );
  });

  it("builds quick access with no params", () => {
    assert.equal(buildCleanShotUrl("quick-access"), "cleanshot://quick-access");
  });

  it("builds settings with no params", () => {
    assert.equal(buildCleanShotUrl("settings"), "cleanshot://settings");
  });

  it("encodes filepath spaces", () => {
    assert.equal(
      buildCleanShotUrl("pin", { filepath: "/tmp/example image.png" }),
      "cleanshot://pin?filepath=%2Ftmp%2Fexample+image.png"
    );
  });

  it("skips null and undefined utility params", () => {
    assert.equal(
      buildCleanShotUrl("settings", { filepath: undefined, display: null }),
      "cleanshot://settings"
    );
  });
});
