export const supportedCleanShotCommands = [
  "capture-area",
  "capture-previous-area",
  "capture-fullscreen",
  "capture-window",
  "self-timer"
] as const;

export type CleanShotCommand = (typeof supportedCleanShotCommands)[number];

export type CleanShotUrlParamValue = string | number | boolean | null | undefined;

export type CleanShotUrlParams = Record<string, CleanShotUrlParamValue>;

export function isCleanShotCommand(command: string): command is CleanShotCommand {
  return supportedCleanShotCommands.includes(command as CleanShotCommand);
}

export function buildCleanShotUrl(
  command: CleanShotCommand,
  params: CleanShotUrlParams = {}
): string {
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
