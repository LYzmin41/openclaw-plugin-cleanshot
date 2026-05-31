import { buildCleanShotUrl } from "./cleanshot-url.js";
import { openCleanShotUrl } from "./launcher.js";
import { captureActionSchema, captureActions, captureModeSchema, captureModes } from "./schemas.js";
const commandByMode = {
    area: "capture-area",
    previous_area: "capture-previous-area",
    fullscreen: "capture-fullscreen",
    window: "capture-window",
    self_timer: "self-timer"
};
function isCaptureMode(value) {
    return typeof value === "string" && captureModes.includes(value);
}
function isCaptureAction(value) {
    return typeof value === "string" && captureActions.includes(value);
}
function optionalNumber(value, key) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`${key} must be a finite number.`);
    }
    return value;
}
function optionalBoolean(value, key) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "boolean") {
        throw new Error(`${key} must be a boolean.`);
    }
    return value;
}
function optionalString(value, key) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new Error(`${key} must be a string.`);
    }
    if (!value.trim()) {
        throw new Error(`${key} must not be empty.`);
    }
    return value;
}
export function validateFilepathParam(value) {
    if (typeof value !== "string") {
        throw new Error("filepath must be a string.");
    }
    if (!value.trim()) {
        throw new Error("filepath must not be empty.");
    }
    if (value.includes("\n") || value.includes("\r")) {
        throw new Error("filepath must not contain newline characters.");
    }
    return value;
}
function normalizeRegionParams(record) {
    return {
        x: optionalNumber(record.x, "x"),
        y: optionalNumber(record.y, "y"),
        width: optionalNumber(record.width, "width"),
        height: optionalNumber(record.height, "height"),
        display: optionalNumber(record.display, "display")
    };
}
function normalizeRegionOnlyParams(params, label) {
    if (typeof params !== "object" || params === null) {
        throw new Error(`${label} parameters must be an object.`);
    }
    return normalizeRegionParams(params);
}
function normalizeCaptureParams(params) {
    if (typeof params !== "object" || params === null) {
        throw new Error("Capture parameters must be an object.");
    }
    const record = params;
    if (!isCaptureMode(record.mode)) {
        throw new Error("mode must be a supported CleanShot capture mode.");
    }
    if (record.action !== undefined && !isCaptureAction(record.action)) {
        throw new Error("action must be a supported CleanShot capture action.");
    }
    return {
        mode: record.mode,
        action: record.action,
        ...normalizeRegionParams(record)
    };
}
function normalizeAllInOneParams(params) {
    return normalizeRegionOnlyParams(params, "All-In-One");
}
function normalizeScrollingCaptureParams(params) {
    if (typeof params !== "object" || params === null) {
        throw new Error("Scrolling capture parameters must be an object.");
    }
    const record = params;
    return {
        ...normalizeRegionParams(record),
        start: optionalBoolean(record.start, "start"),
        autoscroll: optionalBoolean(record.autoscroll, "autoscroll")
    };
}
function normalizeOcrParams(params) {
    if (typeof params !== "object" || params === null) {
        throw new Error("OCR parameters must be an object.");
    }
    const record = params;
    return {
        ...normalizeRegionParams(record),
        filepath: optionalString(record.filepath, "filepath"),
        linebreaks: optionalBoolean(record.linebreaks, "linebreaks")
    };
}
function normalizeRecordScreenParams(params) {
    return normalizeRegionOnlyParams(params, "Record screen");
}
function normalizeFileParams(params, label) {
    if (typeof params !== "object" || params === null) {
        throw new Error(`${label} parameters must be an object.`);
    }
    const record = params;
    return {
        filepath: validateFilepathParam(record.filepath)
    };
}
function getPluginConfig(api) {
    const config = api.pluginConfig ?? {};
    return {
        defaultAction: isCaptureAction(config.defaultAction) ? config.defaultAction : undefined,
        includeGeneratedUrlInResult: typeof config.includeGeneratedUrlInResult === "boolean"
            ? config.includeGeneratedUrlInResult
            : undefined
    };
}
export async function cleanshotCapture(params, context = {}) {
    const action = params.action ?? context.config?.defaultAction ?? "save";
    const command = commandByMode[params.mode];
    const url = buildCleanShotUrl(command, {
        action,
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        display: params.display
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotAllInOne(params, context = {}) {
    const url = buildCleanShotUrl("all-in-one", {
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        display: params.display
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotScrollingCapture(params, context = {}) {
    const url = buildCleanShotUrl("scrolling-capture", {
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        display: params.display,
        start: params.start,
        autoscroll: params.autoscroll
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotOcr(params, context = {}) {
    const url = buildCleanShotUrl("capture-text", {
        filepath: params.filepath,
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        display: params.display,
        linebreaks: params.linebreaks
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotRecordScreen(params, context = {}) {
    const url = buildCleanShotUrl("record-screen", {
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        display: params.display
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotAnnotateFile(params, context = {}) {
    const url = buildCleanShotUrl("open-annotate", {
        filepath: params.filepath
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotPinFile(params, context = {}) {
    const url = buildCleanShotUrl("pin", {
        filepath: params.filepath
    });
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotQuickAccess(context = {}) {
    const url = buildCleanShotUrl("quick-access");
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
export async function cleanshotSettings(context = {}) {
    const url = buildCleanShotUrl("settings");
    const result = await openCleanShotUrl(url);
    const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;
    return includeUrl ? result : { ok: result.ok, launched: result.launched };
}
const regionParameterSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        x: { type: "number" },
        y: { type: "number" },
        width: { type: "number" },
        height: { type: "number" },
        display: { type: "number" }
    }
};
const filepathParameterSchema = {
    type: "object",
    additionalProperties: false,
    required: ["filepath"],
    properties: {
        filepath: { type: "string" }
    }
};
const emptyParameterSchema = {
    type: "object",
    additionalProperties: false,
    properties: {}
};
export const plugin = {
    id: "cleanshot",
    name: "CleanShot",
    description: "Control CleanShot X on macOS via its official URL Scheme API.",
    register(api) {
        api.registerTool({
            name: "cleanshot_capture",
            label: "CleanShot Capture",
            description: "Start a CleanShot X capture using the official cleanshot:// URL scheme.",
            parameters: {
                type: "object",
                additionalProperties: false,
                required: ["mode"],
                properties: {
                    mode: captureModeSchema,
                    action: captureActionSchema,
                    x: { type: "number" },
                    y: { type: "number" },
                    width: { type: "number" },
                    height: { type: "number" },
                    display: { type: "number" }
                }
            },
            async execute(_toolCallId, rawParams) {
                const params = normalizeCaptureParams(rawParams);
                const result = await cleanshotCapture(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot capture launched."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_all_in_one",
            label: "CleanShot All-In-One",
            description: "Launch CleanShot All-In-One mode.",
            parameters: regionParameterSchema,
            async execute(_toolCallId, rawParams) {
                const params = normalizeAllInOneParams(rawParams);
                const result = await cleanshotAllInOne(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot All-In-One launched."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_scrolling_capture",
            label: "CleanShot Scrolling Capture",
            description: "Start CleanShot scrolling capture.",
            parameters: {
                ...regionParameterSchema,
                properties: {
                    ...regionParameterSchema.properties,
                    start: { type: "boolean" },
                    autoscroll: { type: "boolean" }
                }
            },
            async execute(_toolCallId, rawParams) {
                const params = normalizeScrollingCaptureParams(rawParams);
                const result = await cleanshotScrollingCapture(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot scrolling capture launched."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_ocr",
            label: "CleanShot OCR",
            description: "Start CleanShot OCR / text recognition from screen or image file.",
            parameters: {
                ...regionParameterSchema,
                properties: {
                    filepath: { type: "string" },
                    ...regionParameterSchema.properties,
                    linebreaks: { type: "boolean" }
                }
            },
            async execute(_toolCallId, rawParams) {
                const params = normalizeOcrParams(rawParams);
                const result = await cleanshotOcr(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot OCR launched."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_record_screen",
            label: "CleanShot Record Screen",
            description: "Start CleanShot screen recording mode.",
            parameters: regionParameterSchema,
            async execute(_toolCallId, rawParams) {
                const params = normalizeRecordScreenParams(rawParams);
                const result = await cleanshotRecordScreen(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot screen recording launched."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_annotate_file",
            label: "CleanShot Annotate File",
            description: "Open an image file in CleanShot Annotate.",
            parameters: filepathParameterSchema,
            async execute(_toolCallId, rawParams) {
                const params = normalizeFileParams(rawParams, "Annotate file");
                const result = await cleanshotAnnotateFile(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot Annotate opened."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_pin_file",
            label: "CleanShot Pin File",
            description: "Pin an image file as a floating CleanShot screenshot/reference.",
            parameters: filepathParameterSchema,
            async execute(_toolCallId, rawParams) {
                const params = normalizeFileParams(rawParams, "Pin file");
                const result = await cleanshotPinFile(params, {
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot file pinned."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_quick_access",
            label: "CleanShot Quick Access",
            description: "Open CleanShot Quick Access.",
            parameters: emptyParameterSchema,
            async execute() {
                const result = await cleanshotQuickAccess({
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot Quick Access opened."
                        }
                    ],
                    details: result
                };
            }
        });
        api.registerTool({
            name: "cleanshot_settings",
            label: "CleanShot Settings",
            description: "Open CleanShot Settings.",
            parameters: emptyParameterSchema,
            async execute() {
                const result = await cleanshotSettings({
                    config: getPluginConfig(api)
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: "CleanShot Settings opened."
                        }
                    ],
                    details: result
                };
            }
        });
    }
};
export default plugin;
//# sourceMappingURL=index.js.map