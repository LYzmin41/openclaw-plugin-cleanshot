# CleanShot Tool

CleanShot Tool is an OpenClaw Tool Plugin that adds agent-callable tools for controlling CleanShot X on macOS via its official URL Scheme API.

It exposes focused OpenClaw tools for screenshots, OCR launch, recording launch, file annotation/pinning, Quick Access, and Settings. It does not expose arbitrary shell execution.

Published on ClawHub as `cleanshot-tool`.

## Install

```sh
openclaw plugins install clawhub:cleanshot-tool
```

Package identity:

- Package slug: `cleanshot-tool`
- GitHub repository: `openclaw-plugin-cleanshot`
- Display name: CleanShot Tool
- Plugin id: `cleanshot`

## Tool Plugin vs Skill

CleanShot Tool is the executable OpenClaw Tool Plugin. It provides callable tools for capture, OCR, recording, annotation, pinned references, Quick Access, settings, and display geometry.

CleanShot Skill is a separate optional workflow layer that can help an agent interpret natural language requests such as named screen regions, multi-monitor captures, and default capture behavior.

The Tool stays universal and function-focused; the Skill contains workflow guidance.

Public Skill slug: `cleanshot-skill`

## Use Cases

- Capture the full screen, a window, a selected area, or the previous capture area.
- Copy screenshots directly to the clipboard or save them through CleanShot.
- Open CleanShot All-In-One capture mode from an OpenClaw agent.
- Start scrolling capture for long pages, chats, documents, and feeds.
- Run CleanShot OCR / text capture through the agent.
- Start screen recording mode from the agent.
- Open a local image/file in CleanShot Annotate.
- Pin an image or file as a floating CleanShot reference.
- Open CleanShot Quick Access to browse recent captures.
- Open CleanShot Settings.
- Query display geometry for coordinate-based captures, including multi-monitor workflows.

## Example Agent Requests

- "Take a fullscreen screenshot and copy it."
- "Capture the left half of the main display."
- "Capture the right half of the second monitor."
- "Start a scrolling screenshot."
- "Extract text from the screen with CleanShot OCR."
- "Record the screen."
- "Open CleanShot Quick Access."
- "Pin this image as a floating reference."
- "Open this file in CleanShot Annotate."

Advanced workflow interpretation can be handled by the separate CleanShot Skill.

## Requirements

- macOS
- CleanShot X installed
- CleanShot API enabled
- OpenClaw
- Node.js 22 or newer for local development

Enable CleanShot control in:

```text
CleanShot X -> Settings -> Advanced -> API -> Allow Applications to control CleanShot
```

You can test CleanShot URL Scheme support manually with:

```sh
open "cleanshot://capture-fullscreen?action=save"
```

## Local Development Install

```sh
npm install
npm run build
openclaw plugins install . --link --dangerously-force-unsafe-install
openclaw gateway restart
```

OpenClaw 2026.5.12 may require `--dangerously-force-unsafe-install` because static scanning detects `child_process`. This plugin uses `execFile("open", [url])` only after validating a `cleanshot://` URL.

## Verification

```sh
npm run typecheck
npm test
openclaw plugins inspect cleanshot --runtime
openclaw plugins doctor
```

Expected runtime tools:

```text
cleanshot_capture
cleanshot_all_in_one
cleanshot_scrolling_capture
cleanshot_ocr
cleanshot_record_screen
cleanshot_annotate_file
cleanshot_pin_file
cleanshot_quick_access
cleanshot_settings
cleanshot_get_displays
```

## Tools

| Tool | Summary |
| --- | --- |
| `cleanshot_capture` | Start a standard CleanShot capture. |
| `cleanshot_all_in_one` | Launch CleanShot All-In-One mode. |
| `cleanshot_scrolling_capture` | Start CleanShot scrolling capture. |
| `cleanshot_ocr` | Trigger CleanShot OCR / text recognition from screen or image file. |
| `cleanshot_record_screen` | Start CleanShot screen recording mode. |
| `cleanshot_annotate_file` | Open an image file in CleanShot Annotate. |
| `cleanshot_pin_file` | Pin an image file as a floating CleanShot screenshot/reference. |
| `cleanshot_quick_access` | Open CleanShot Quick Access. |
| `cleanshot_settings` | Open CleanShot Settings. |
| `cleanshot_get_displays` | Returns macOS display geometry for coordinate-based CleanShot captures. |

`cleanshot_get_displays` is a plugin utility tool. It does not call CleanShot and is not a CleanShot URL Scheme command.

Neutral tool-call examples:

```text
Call cleanshot_capture with mode fullscreen and action save.
Call cleanshot_all_in_one.
Call cleanshot_scrolling_capture.
Call cleanshot_ocr with linebreaks true.
Call cleanshot_record_screen.
Call cleanshot_annotate_file with filepath /tmp/example.png.
Call cleanshot_pin_file with filepath /tmp/example.png.
Call cleanshot_quick_access.
Call cleanshot_settings.
Call cleanshot_get_displays to inspect display bounds.
Use display bounds to calculate an area capture.
```

## Security Note

This plugin validates that generated URLs use the exact `cleanshot:` protocol and launches them with `execFile`, not `exec`, to avoid shell string interpolation.

File tools pass filepaths to CleanShot via URL Scheme. They do not read, stat, modify, or upload files themselves.

## Known Limitations

- `cleanshot_ocr` triggers CleanShot OCR, but does not guarantee returning recognized text to OpenClaw. CleanShot may handle recognized text in its UI or clipboard depending on app behavior and settings.
- The `upload` action depends on CleanShot Cloud configuration.
- Runtime install may require forced unsafe install until OpenClaw exposes an approved tool-plugin URL opener for custom URL schemes.

## Documentation

- [CleanShot API Coverage](docs/cleanshot-api-coverage.md)
- [Security Model](docs/security.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Release Checklist](docs/release-checklist.md)
- [Release Candidate Notes](docs/release-candidate-notes.md)
- [OpenClawHub Publication Readiness](docs/openclawhub-publication.md)
- [Final Release Audit](docs/final-release-audit.md)

## Author

Created and maintained by Lyzmin41.

## Development

```sh
npm install
npm run build
npm run typecheck
npm test
```
