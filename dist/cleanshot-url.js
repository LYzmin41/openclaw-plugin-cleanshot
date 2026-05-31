export const supportedCleanShotCommands = [
    "capture-area",
    "capture-previous-area",
    "capture-fullscreen",
    "capture-window",
    "self-timer",
    "all-in-one",
    "scrolling-capture",
    "capture-text",
    "record-screen",
    "open-annotate",
    "pin",
    "quick-access",
    "settings"
];
export function isCleanShotCommand(command) {
    return supportedCleanShotCommands.includes(command);
}
export function buildCleanShotUrl(command, params = {}) {
    if (!isCleanShotCommand(command)) {
        throw new Error(`Unsupported CleanShot command: ${command}`);
    }
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) {
            continue;
        }
        searchParams.set(key, typeof value === "boolean" ? String(value) : String(value));
    }
    const query = searchParams.toString();
    return `cleanshot://${command}${query ? `?${query}` : ""}`;
}
//# sourceMappingURL=cleanshot-url.js.map