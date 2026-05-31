import { execFile } from "node:child_process";

export interface OpenCleanShotUrlResult {
  ok: true;
  launched: true;
  url: string;
}

export function validateCleanShotUrl(url: unknown): string {
  if (typeof url !== "string") {
    throw new Error("CleanShot URL must be a string.");
  }

  if (url.length === 0) {
    throw new Error("CleanShot URL cannot be empty.");
  }

  if (url.includes("\n") || url.includes("\r")) {
    throw new Error("CleanShot URL cannot contain newline characters.");
  }

  if (!url.startsWith("cleanshot://")) {
    throw new Error("Refusing to open a non-CleanShot URL.");
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("CleanShot URL must be a valid URL.");
  }

  if (parsed.protocol !== "cleanshot:") {
    throw new Error("CleanShot URL protocol must be cleanshot:.");
  }

  return url;
}

export function openCleanShotUrl(url: unknown): Promise<OpenCleanShotUrlResult> {
  const validatedUrl = validateCleanShotUrl(url);

  // CleanShot X exposes an official macOS URL Scheme API. On macOS, `open`
  // is the normal way to dispatch URL schemes to their registered apps.
  // Use execFile instead of exec so the URL is passed as an argv value rather
  // than interpolated through a shell command string. The protocol is validated
  // above so this function only launches cleanshot:// URLs. OpenClaw may still
  // flag this file during static scans because it imports child_process.
  return new Promise((resolve, reject) => {
    execFile("open", [validatedUrl], (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        ok: true,
        launched: true,
        url: validatedUrl
      });
    });
  });
}
