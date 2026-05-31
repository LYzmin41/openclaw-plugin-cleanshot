import { execFile } from "node:child_process";

export interface GetDisplaysOptions {
  includeVisibleFrame?: boolean;
  includePixelBounds?: boolean;
}

export interface RawDisplay {
  name?: unknown;
  isMain?: unknown;
  x?: unknown;
  y?: unknown;
  width?: unknown;
  height?: unknown;
  visibleX?: unknown;
  visibleY?: unknown;
  visibleWidth?: unknown;
  visibleHeight?: unknown;
  scale?: unknown;
}

export interface DisplayInfo {
  id: number;
  name?: string;
  isMain?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  visibleX?: number;
  visibleY?: number;
  visibleWidth?: number;
  visibleHeight?: number;
  scale?: number;
  pixelX?: number;
  pixelY?: number;
  pixelWidth?: number;
  pixelHeight?: number;
}

export interface GetDisplaysResult {
  coordinateSystem: "macos-logical-points";
  note: string;
  displays: DisplayInfo[];
}

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

const defaultOptions: Required<GetDisplaysOptions> = {
  includeVisibleFrame: true,
  includePixelBounds: true
};

function readOptions(options: GetDisplaysOptions = {}): Required<GetDisplaysOptions> {
  return {
    includeVisibleFrame: options.includeVisibleFrame ?? defaultOptions.includeVisibleFrame,
    includePixelBounds: options.includePixelBounds ?? defaultOptions.includePixelBounds
  };
}

function requiredNumber(value: unknown, key: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Display ${key} must be a finite number.`);
  }

  return value;
}

function optionalNumber(value: unknown, key: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Display ${key} must be a finite number when provided.`);
  }

  return value;
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function rawDisplaysFromParsed(value: unknown): RawDisplay[] {
  if (Array.isArray(value)) {
    return value as RawDisplay[];
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { displays?: unknown }).displays)
  ) {
    return (value as { displays: RawDisplay[] }).displays;
  }

  throw new Error("Display geometry output must be a JSON array.");
}

export function parseDisplaysJson(
  raw: string,
  options: GetDisplaysOptions = {}
): GetDisplaysResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Could not parse display geometry JSON.");
  }

  return normalizeDisplays(rawDisplaysFromParsed(parsed), options);
}

export function normalizeDisplays(
  rawDisplays: RawDisplay[],
  options: GetDisplaysOptions = {}
): GetDisplaysResult {
  if (!Array.isArray(rawDisplays)) {
    throw new Error("Display geometry must be an array.");
  }

  if (rawDisplays.length === 0) {
    throw new Error("No displays were returned by macOS.");
  }

  const resolvedOptions = readOptions(options);
  const normalized = rawDisplays.map((display, originalIndex) => {
    const scale = optionalNumber(display.scale, "scale");
    const info: Omit<DisplayInfo, "id"> & { originalIndex: number } = {
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
    note:
      "Display bounds are macOS logical display coordinates; pixel bounds are provided separately when scale is available.",
    displays: normalized.map(({ originalIndex: _originalIndex, ...display }, index) => ({
      ...display,
      id: index + 1
    }))
  };
}

export function getDisplays(options: GetDisplaysOptions = {}): Promise<GetDisplaysResult> {
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
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
