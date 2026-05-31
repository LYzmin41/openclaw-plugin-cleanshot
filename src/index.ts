import { buildCleanShotUrl, type CleanShotCommand } from "./cleanshot-url.js";
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
    x: optionalNumber(record.x, "x"),
    y: optionalNumber(record.y, "y"),
    width: optionalNumber(record.width, "width"),
    height: optionalNumber(record.height, "height"),
    display: optionalNumber(record.display, "display")
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
  }
} as const;

export default plugin;
