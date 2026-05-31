# CleanShot OpenClaw Plugin

Control CleanShot X on macOS through its official URL Scheme API.

This plugin exposes OpenClaw tools for launching CleanShot captures from an OpenClaw agent/runtime without manually running `open "cleanshot://..."`.

## Requirements

- macOS
- CleanShot X installed
- CleanShot API enabled
- OpenClaw
- Node.js / TypeScript for local development

Enable CleanShot control in:

```text
CleanShot X -> Settings -> Advanced -> API -> Allow Applications to control CleanShot
```

## Local Install

Build and install the plugin locally:

```sh
npm run build
openclaw plugins install . --link --dangerously-force-unsafe-install
openclaw gateway restart
```

OpenClaw 2026.5.12 may require `--dangerously-force-unsafe-install` because this plugin uses Node `child_process` to dispatch a validated macOS URL scheme. See [Security model](#security-model).

## Verification

Check that OpenClaw loaded the plugin runtime:

```sh
openclaw plugins inspect cleanshot --runtime
openclaw plugins doctor
```

Expected runtime tool:

```text
cleanshot_capture
cleanshot_all_in_one
cleanshot_scrolling_capture
```

Example successful agent prompt:

```text
Call the tool cleanshot_capture with mode fullscreen and action save.
```

## Manual CleanShot Test

Run this on macOS to confirm CleanShot URL Scheme support is working:

```sh
open "cleanshot://capture-fullscreen?action=save"
```

## Current MVP Capabilities

Current tools:

- `cleanshot_capture`: start a standard CleanShot capture.
- `cleanshot_all_in_one`: launch CleanShot All-In-One mode.
- `cleanshot_scrolling_capture`: start CleanShot scrolling capture.

`cleanshot_capture` supports these capture modes:

- `area`
- `previous_area`
- `fullscreen`
- `window`
- `self_timer`

It can pass an optional action:

- `copy`
- `save`
- `annotate`
- `upload`
- `pin`

For area-style captures, it can also pass optional numeric `x`, `y`, `width`, `height`, and `display` parameters.

`cleanshot_all_in_one` accepts optional numeric `x`, `y`, `width`, `height`, and `display` parameters.

`cleanshot_scrolling_capture` accepts optional numeric `x`, `y`, `width`, `height`, and `display` parameters, plus optional boolean `start` and `autoscroll` parameters.

Example prompts:

```text
Use CleanShot All-In-One mode.
Start a CleanShot scrolling capture.
Call cleanshot_scrolling_capture with start true and autoscroll true.
```

## Security Model

This plugin does not expose arbitrary shell execution.

The launcher validates that the URL protocol is exactly `cleanshot:` before anything is opened. It rejects empty values, non-string values, malformed URLs, non-CleanShot protocols, and newline characters.

The plugin uses `execFile`, not `exec`, and only calls macOS `open` with an argument array:

```ts
execFile("open", [url])
```

OpenClaw may still require `--dangerously-force-unsafe-install` because static scanning detects `child_process`.

This is currently necessary because OpenClaw 2026.5.12 does not expose an approved tool-plugin URL opener for custom URL schemes like `cleanshot://`. Only install from a trusted source or after reviewing the code.

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
```
