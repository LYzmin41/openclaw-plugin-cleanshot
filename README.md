# CleanShot Tool

CleanShot Tool is an OpenClaw Tool Plugin that adds agent-callable tools for controlling CleanShot X on macOS via its official URL Scheme API.

It exposes focused OpenClaw tools for screenshots, OCR launch, recording launch, file annotation/pinning, Quick Access, and Settings. It does not expose arbitrary shell execution.

## Release Status

- Publication status: not yet published to OpenClawHub / ClawHub.
- Current stable local version: `v1.0.2`.
- Ready for manual Hub dry-run/publish review, but actual publication has not happened.

## Tool Plugin vs Skill

This repository is the universal CleanShot Tool Plugin. It provides executable tools that OpenClaw agents can call.

A separate optional CleanShot Skill can provide workflow and decision guidance outside this repository. This public plugin intentionally stays focused on executable tools, parameters, URL Scheme behavior, and safety documentation.

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

## Local Install

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
