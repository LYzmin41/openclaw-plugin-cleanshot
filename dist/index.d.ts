import { type CaptureAction, type CaptureMode } from "./schemas.js";
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
            content: Array<{
                type: "text";
                text: string;
            }>;
            details: unknown;
        }>;
    }): void;
}
export declare function validateFilepathParam(value: unknown): string;
export declare function cleanshotCapture(params: CleanShotCaptureParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotAllInOne(params: CleanShotRegionParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotScrollingCapture(params: CleanShotScrollingCaptureParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotOcr(params: CleanShotOcrParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotRecordScreen(params: CleanShotRegionParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotAnnotateFile(params: CleanShotFileParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotPinFile(params: CleanShotFileParams, context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotQuickAccess(context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare function cleanshotSettings(context?: OpenClawToolContext): Promise<import("./launcher.js").OpenCleanShotUrlResult | {
    ok: true;
    launched: true;
}>;
export declare const plugin: {
    readonly id: "cleanshot";
    readonly name: "CleanShot";
    readonly description: "Control CleanShot X on macOS via its official URL Scheme API.";
    readonly register: (api: OpenClawPluginApi) => void;
};
export default plugin;
