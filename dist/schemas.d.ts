export declare const captureModes: readonly ["area", "previous_area", "fullscreen", "window", "self_timer"];
export type CaptureMode = (typeof captureModes)[number];
export declare const captureActions: readonly ["copy", "save", "annotate", "upload", "pin"];
export type CaptureAction = (typeof captureActions)[number];
export declare const captureModeSchema: {
    readonly type: "string";
    readonly enum: readonly ["area", "previous_area", "fullscreen", "window", "self_timer"];
};
export declare const captureActionSchema: {
    readonly type: "string";
    readonly enum: readonly ["copy", "save", "annotate", "upload", "pin"];
};
