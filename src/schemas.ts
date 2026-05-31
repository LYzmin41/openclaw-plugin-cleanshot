export const captureModes = [
  "area",
  "previous_area",
  "fullscreen",
  "window",
  "self_timer"
] as const;

export type CaptureMode = (typeof captureModes)[number];

export const captureActions = [
  "copy",
  "save",
  "annotate",
  "upload",
  "pin"
] as const;

export type CaptureAction = (typeof captureActions)[number];

export const captureModeSchema = {
  type: "string",
  enum: captureModes
} as const;

export const captureActionSchema = {
  type: "string",
  enum: captureActions
} as const;
