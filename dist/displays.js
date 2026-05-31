import { execFile } from "node:child_process";
const displayGeometryScript = `
ObjC.import("AppKit");

function numberValue(value) {
  return Number(value);
}

function stringValue(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  try {
    return ObjC.unwrap(value);
  } catch (_error) {
    return String(value);
  }
}

function frameValues(frame) {
  return {
    x: numberValue(frame.origin.x),
    y: numberValue(frame.origin.y),
    width: numberValue(frame.size.width),
    height: numberValue(frame.size.height)
  };
}

const screens = $.NSScreen.screens;
const mainScreen = $.NSScreen.mainScreen;
const displays = [];

for (let index = 0; index < screens.count; index += 1) {
  const screen = screens.objectAtIndex(index);
  const frame = frameValues(screen.frame);
  const visibleFrame = frameValues(screen.visibleFrame);
  const display = {
    name: stringValue(screen.localizedName),
    isMain: Boolean(mainScreen && screen.isEqual(mainScreen)),
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height,
    visibleX: visibleFrame.x,
    visibleY: visibleFrame.y,
    visibleWidth: visibleFrame.width,
    visibleHeight: visibleFrame.height,
    scale: numberValue(screen.backingScaleFactor)
  };

  displays.push(display);
}

JSON.stringify(displays);
`;
const defaultOptions = {
    includeVisibleFrame: true,
    includePixelBounds: true
};
function readOptions(options = {}) {
    return {
        includeVisibleFrame: options.includeVisibleFrame ?? defaultOptions.includeVisibleFrame,
        includePixelBounds: options.includePixelBounds ?? defaultOptions.includePixelBounds
    };
}
function requiredNumber(value, key) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`Display ${key} must be a finite number.`);
    }
    return value;
}
function optionalNumber(value, key) {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`Display ${key} must be a finite number when provided.`);
    }
    return value;
}
function optionalString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}
function rawDisplaysFromParsed(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "object" &&
        value !== null &&
        Array.isArray(value.displays)) {
        return value.displays;
    }
    throw new Error("Display geometry output must be a JSON array.");
}
export function parseDisplaysJson(raw, options = {}) {
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        throw new Error("Could not parse display geometry JSON.");
    }
    return normalizeDisplays(rawDisplaysFromParsed(parsed), options);
}
export function normalizeDisplays(rawDisplays, options = {}) {
    if (!Array.isArray(rawDisplays)) {
        throw new Error("Display geometry must be an array.");
    }
    if (rawDisplays.length === 0) {
        throw new Error("No displays were returned by macOS.");
    }
    const resolvedOptions = readOptions(options);
    const normalized = rawDisplays.map((display, originalIndex) => {
        const scale = optionalNumber(display.scale, "scale");
        const info = {
            originalIndex,
            name: optionalString(display.name),
            isMain: display.isMain === true,
            x: requiredNumber(display.x, "x"),
            y: requiredNumber(display.y, "y"),
            width: requiredNumber(display.width, "width"),
            height: requiredNumber(display.height, "height"),
            scale
        };
        if (resolvedOptions.includeVisibleFrame) {
            info.visibleX = optionalNumber(display.visibleX, "visibleX");
            info.visibleY = optionalNumber(display.visibleY, "visibleY");
            info.visibleWidth = optionalNumber(display.visibleWidth, "visibleWidth");
            info.visibleHeight = optionalNumber(display.visibleHeight, "visibleHeight");
        }
        if (resolvedOptions.includePixelBounds && scale !== undefined) {
            info.pixelX = Math.round(info.x * scale);
            info.pixelY = Math.round(info.y * scale);
            info.pixelWidth = Math.round(info.width * scale);
            info.pixelHeight = Math.round(info.height * scale);
        }
        return info;
    });
    normalized.sort((left, right) => {
        if (left.isMain !== right.isMain) {
            return left.isMain ? -1 : 1;
        }
        return left.originalIndex - right.originalIndex;
    });
    return {
        coordinateSystem: "macos-logical-points",
        note: "Display bounds are macOS logical display coordinates; pixel bounds are provided separately when scale is available.",
        displays: normalized.map(({ originalIndex: _originalIndex, ...display }, index) => ({
            ...display,
            id: index + 1
        }))
    };
}
export function getDisplays(options = {}) {
    // macOS display geometry comes from AppKit through a fixed JXA script.
    // execFile runs osascript directly with an argv array: no shell is used,
    // no user input is interpolated, and this helper only reads NSScreen
    // geometry. It does not call CleanShot, capture the screen, or access files.
    return new Promise((resolve, reject) => {
        execFile("osascript", ["-l", "JavaScript", "-e", displayGeometryScript], (error, stdout) => {
            if (error) {
                reject(new Error(`Could not query macOS display geometry: ${error.message}`));
                return;
            }
            try {
                resolve(parseDisplaysJson(stdout, options));
            }
            catch (parseError) {
                reject(parseError);
            }
        });
    });
}
//# sourceMappingURL=displays.js.map