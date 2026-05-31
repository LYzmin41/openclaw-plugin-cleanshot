export declare const supportedCleanShotCommands: readonly ["capture-area", "capture-previous-area", "capture-fullscreen", "capture-window", "self-timer", "all-in-one", "scrolling-capture", "capture-text", "record-screen", "open-annotate", "pin", "quick-access", "settings"];
export type CleanShotCommand = (typeof supportedCleanShotCommands)[number];
export type CleanShotUrlParamValue = string | number | boolean | null | undefined;
export type CleanShotUrlParams = Record<string, CleanShotUrlParamValue>;
export declare function isCleanShotCommand(command: string): command is CleanShotCommand;
export declare function buildCleanShotUrl(command: CleanShotCommand, params?: CleanShotUrlParams): string;
