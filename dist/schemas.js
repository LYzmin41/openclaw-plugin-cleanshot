export const captureModes = [
    "area",
    "previous_area",
    "fullscreen",
    "window",
    "self_timer"
];
export const captureActions = [
    "copy",
    "save",
    "annotate",
    "upload",
    "pin"
];
export const captureModeSchema = {
    type: "string",
    enum: captureModes
};
export const captureActionSchema = {
    type: "string",
    enum: captureActions
};
//# sourceMappingURL=schemas.js.map