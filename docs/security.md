# Security Model

This plugin controls CleanShot X through CleanShot's official macOS URL Scheme API.

## URL Launching

The plugin does not expose arbitrary shell execution to the agent. It builds and launches validated CleanShot URLs only.

The launcher validates that:

- the URL is a string
- the URL is not empty
- the URL contains no newline or carriage return characters
- the URL starts with `cleanshot://`
- the parsed URL protocol is exactly `cleanshot:`

The plugin uses Node `execFile`, not `exec`, to call macOS `open`:

```ts
execFile("open", [url])
```

Passing the URL as an argv value avoids shell string interpolation.

## OpenClaw Warning

OpenClaw 2026.5.12 static scanning still flags `child_process`, even though this plugin uses `execFile` narrowly with validated `cleanshot://` URLs.

Local installation may require:

```sh
openclaw plugins install . --link --dangerously-force-unsafe-install
```

Users should review the source before forcing unsafe install.

## File Tools

File tools pass file paths to CleanShot via URL Scheme. They do not read, stat, modify, upload, or otherwise access files themselves.

Filepath validation rejects:

- non-string values
- empty strings
- newline or carriage return characters

## Display Geometry Helper

`cleanshot_get_displays` uses Node `execFile` to call macOS `osascript` with a fixed JavaScript for Automation script:

```ts
execFile("osascript", ["-l", "JavaScript", "-e", script])
```

The script queries AppKit `NSScreen` display geometry. It does not include user-provided command text, does not use shell interpolation, does not capture the screen, and does not read or modify files. It only returns local display bounds, visible frames, scale values, and derived pixel bounds when available.

## Known Security-Relevant Limitations

- The `upload` action depends on CleanShot Cloud settings and user configuration.
- `cleanshot_ocr` triggers CleanShot OCR and does not guarantee recognized text is returned to OpenClaw.
- The plugin should be re-reviewed if OpenClaw adds an approved tool-plugin URL opener for custom schemes like `cleanshot://`.
