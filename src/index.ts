import { buildCleanShotUrl, type CleanShotCommand } from "./cleanshot-url.js";
import { getDisplays, type GetDisplaysOptions } from "./displays.js";
import { openCleanShotUrl } from "./launcher.js";
import {
  captureActionSchema,
  captureActions,
  captureModeSchema,
  captureModes,
  type CaptureAction,
  type CaptureMode
} from "./schemas.js";

export interface CleanShotPluginConfig {
  defaultAction?: CaptureAction;
  includeGeneratedUrlInResult?: boolean;
}

export interface CleanShotCaptureParams {
  mode: CaptureMode;
  action?: CaptureAction;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  display?: number;
}

export interface CleanShotRegionParams {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  display?: number;
}

export interface CleanShotScrollingCaptureParams extends CleanShotRegionParams {
  start?: boolean;
  autoscroll?: boolean;
}

export interface CleanShotOcrParams extends CleanShotRegionParams {
  filepath?: string;
  linebreaks?: boolean;
}

export interface CleanShotFileParams {
  filepath: string;
}

export interface CleanShotGetDisplaysParams extends GetDisplaysOptions {}

export interface OpenClawToolContext {
  config?: CleanShotPluginConfig;
}

interface OpenClawPluginApi {
  pluginConfig?: Record<string, unknown>;
  registerTool(tool: {
    name: string;
    label: string;
    description: string;
    parameters: Record<string, unknown>;
    execute(toolCallId: string, params: unknown): Promise<{
      content: Array<{ type: "text"; text: string }>;
      details: unknown;
    }>;
  }): void;
}

const commandByMode: Record<CaptureMode, CleanShotCommand> = {
  area: "capture-area",
  previous_area: "capture-previous-area",
  fullscreen: "capture-fullscreen",
  window: "capture-window",
  self_timer: "self-timer"
};

function isCaptureMode(value: unknown): value is CaptureMode {
  return typeof value === "string" && captureModes.includes(value as CaptureMode);
}

function isCaptureAction(value: unknown): value is CaptureAction {
  return typeof value === "string" && captureActions.includes(value as CaptureAction);
}

function optionalNumber(value: unknown, key: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number.`);
  }

  return value;
}

function optionalBoolean(value: unknown, key: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`${key} must be a boolean.`);
  }

  return value;
}

function optionalString(value: unknown, key: string): string | undefined {
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

export function validateFilepathParam(value: unknown): string {
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

function normalizeRegionParams(record: Record<string, unknown>): CleanShotRegionParams {
  return {
    x: optionalNumber(record.x, "x"),
    y: optionalNumber(record.y, "y"),
    width: optionalNumber(record.width, "width"),
    height: optionalNumber(record.height, "height"),
    display: optionalNumber(record.display, "display")
  };
}

function normalizeRegionOnlyParams(params: unknown, label: string): CleanShotRegionParams {
  if (typeof params !== "object" || params === null) {
    throw new Error(`${label} parameters must be an object.`);
  }

  return normalizeRegionParams(params as Record<string, unknown>);
}

function normalizeCaptureParams(params: unknown): CleanShotCaptureParams {
  if (typeof params !== "object" || params === null) {
    throw new Error("Capture parameters must be an object.");
  }

  const record = params as Record<string, unknown>;

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

function normalizeAllInOneParams(params: unknown): CleanShotRegionParams {
  return normalizeRegionOnlyParams(params, "All-In-One");
}

function normalizeScrollingCaptureParams(params: unknown): CleanShotScrollingCaptureParams {
  if (typeof params !== "object" || params === null) {
    throw new Error("Scrolling capture parameters must be an object.");
  }

  const record = params as Record<string, unknown>;

  return {
    ...normalizeRegionParams(record),
    start: optionalBoolean(record.start, "start"),
    autoscroll: optionalBoolean(record.autoscroll, "autoscroll")
  };
}

function normalizeOcrParams(params: unknown): CleanShotOcrParams {
  if (typeof params !== "object" || params === null) {
    throw new Error("OCR parameters must be an object.");
  }

  const record = params as Record<string, unknown>;

  return {
    ...normalizeRegionParams(record),
    filepath: optionalString(record.filepath, "filepath"),
    linebreaks: optionalBoolean(record.linebreaks, "linebreaks")
  };
}

function normalizeRecordScreenParams(params: unknown): CleanShotRegionParams {
  return normalizeRegionOnlyParams(params, "Record screen");
}

function normalizeFileParams(params: unknown, label: string): CleanShotFileParams {
  if (typeof params !== "object" || params === null) {
    throw new Error(`${label} parameters must be an object.`);
  }

  const record = params as Record<string, unknown>;

  return {
    filepath: validateFilepathParam(record.filepath)
  };
}

function normalizeGetDisplaysParams(params: unknown): CleanShotGetDisplaysParams {
  if (params === undefined || params === null) {
    return {};
  }

  if (typeof params !== "object") {
    throw new Error("Get displays parameters must be an object.");
  }

  const record = params as Record<string, unknown>;

  return {
    includeVisibleFrame: optionalBoolean(record.includeVisibleFrame, "includeVisibleFrame"),
    includePixelBounds: optionalBoolean(record.includePixelBounds, "includePixelBounds")
  };
}

function getPluginConfig(api: OpenClawPluginApi): CleanShotPluginConfig {
  const config = api.pluginConfig ?? {};
  return {
    defaultAction: isCaptureAction(config.defaultAction) ? config.defaultAction : undefined,
    includeGeneratedUrlInResult:
      typeof config.includeGeneratedUrlInResult === "boolean"
        ? config.includeGeneratedUrlInResult
        : undefined
  };
}

export async function cleanshotCapture(
  params: CleanShotCaptureParams,
  context: OpenClawToolContext = {}
) {
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

export async function cleanshotAllInOne(
  params: CleanShotRegionParams,
  context: OpenClawToolContext = {}
) {
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

export async function cleanshotScrollingCapture(
  params: CleanShotScrollingCaptureParams,
  context: OpenClawToolContext = {}
) {
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

export async function cleanshotOcr(params: CleanShotOcrParams, context: OpenClawToolContext = {}) {
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

export async function cleanshotRecordScreen(
  params: CleanShotRegionParams,
  context: OpenClawToolContext = {}
) {
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

export async function cleanshotAnnotateFile(
  params: CleanShotFileParams,
  context: OpenClawToolContext = {}
) {
  const url = buildCleanShotUrl("open-annotate", {
    filepath: params.filepath
  });
  const result = await openCleanShotUrl(url);
  const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;

  return includeUrl ? result : { ok: result.ok, launched: result.launched };
}

export async function cleanshotPinFile(
  params: CleanShotFileParams,
  context: OpenClawToolContext = {}
) {
  const url = buildCleanShotUrl("pin", {
    filepath: params.filepath
  });
  const result = await openCleanShotUrl(url);
  const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;

  return includeUrl ? result : { ok: result.ok, launched: result.launched };
}

export async function cleanshotQuickAccess(context: OpenClawToolContext = {}) {
  const url = buildCleanShotUrl("quick-access");
  const result = await openCleanShotUrl(url);
  const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;

  return includeUrl ? result : { ok: result.ok, launched: result.launched };
}

export async function cleanshotSettings(context: OpenClawToolContext = {}) {
  const url = buildCleanShotUrl("settings");
  const result = await openCleanShotUrl(url);
  const includeUrl = context.config?.includeGeneratedUrlInResult ?? true;

  return includeUrl ? result : { ok: result.ok, launched: result.launched };
}

export async function cleanshotGetDisplays(params: CleanShotGetDisplaysParams = {}) {
  return getDisplays(params);
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
} as const;

const filepathParameterSchema = {
  type: "object",
  additionalProperties: false,
  required: ["filepath"],
  properties: {
    filepath: { type: "string" }
  }
} as const;

const emptyParameterSchema = {
  type: "object",
  additionalProperties: false,
  properties: {}
} as const;

const getDisplaysParameterSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includeVisibleFrame: { type: "boolean" },
    includePixelBounds: { type: "boolean" }
  }
} as const;

export const plugin = {
  id: "cleanshot",
  name: "CleanShot",
  description: "Control CleanShot X on macOS via its official URL Scheme API.",
  register(api: OpenClawPluginApi) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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
      async execute(_toolCallId: string, rawParams: unknown) {
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

    api.registerTool({
      name: "cleanshot_get_displays",
      label: "CleanShot Get Displays",
      description: "Get macOS display geometry for coordinate-based CleanShot captures.",
      parameters: getDisplaysParameterSchema,
      async execute(_toolCallId: string, rawParams: unknown) {
        const params = normalizeGetDisplaysParams(rawParams);
        const result = await cleanshotGetDisplays(params);

        return {
          content: [
            {
              type: "text",
              text: "macOS display geometry returned."
            }
          ],
          details: result
        };
      }
    });
  }
} as const;

export default plugin;
