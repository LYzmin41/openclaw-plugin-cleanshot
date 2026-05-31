# CleanShot API Coverage

This document maps the CleanShot URL Scheme commands currently implemented by the OpenClaw CleanShot plugin to plugin tools, parameters, tests, and agent smoke verification.

This is an implementation audit for the current plugin state. It should be checked against the official CleanShot URL Scheme API documentation before v1.0.0.

## Coverage Table

| CleanShot URL command | Current plugin tool | Supported params | URL builder test coverage | Agent verified | Notes / limitations |
| --- | --- | --- | --- | --- | --- |
| `capture-area` | `cleanshot_capture` with `mode: "area"` | `action`, `x`, `y`, `width`, `height`, `display` | Area coordinates test | Yes, via `cleanshot_capture` in v0.1.0 | Agent smoke verified the capture tool; individual capture modes can receive additional pre-v1.0 smoke tests. |
| `capture-previous-area` | `cleanshot_capture` with `mode: "previous_area"` | `action`, `x`, `y`, `width`, `height`, `display` | Previous area with `copy` test | Yes, via `cleanshot_capture` in v0.1.0 | Agent smoke verified the capture tool; individual capture modes can receive additional pre-v1.0 smoke tests. |
| `capture-fullscreen` | `cleanshot_capture` with `mode: "fullscreen"` | `action`, `x`, `y`, `width`, `height`, `display` | Fullscreen with `save` test | Yes, v0.1.0 | First end-to-end OpenClaw agent call used fullscreen save. |
| `capture-window` | `cleanshot_capture` with `mode: "window"` | `action`, `x`, `y`, `width`, `height`, `display` | Null and undefined param skipping test | Yes, via `cleanshot_capture` in v0.1.0 | Agent smoke verified the capture tool; individual capture modes can receive additional pre-v1.0 smoke tests. |
| `self-timer` | `cleanshot_capture` with `mode: "self_timer"` | `action`, `x`, `y`, `width`, `height`, `display` | Boolean serialization test | Yes, via `cleanshot_capture` in v0.1.0 | Agent smoke verified the capture tool; individual capture modes can receive additional pre-v1.0 smoke tests. |
| `all-in-one` | `cleanshot_all_in_one` | `x`, `y`, `width`, `height`, `display` | No params; coordinates and display tests | Yes, v0.2.0 | Launches CleanShot All-In-One mode. |
| `scrolling-capture` | `cleanshot_scrolling_capture` | `x`, `y`, `width`, `height`, `display`, `start`, `autoscroll` | No params; `start` and `autoscroll`; coordinates and display tests | Yes, v0.2.0 | Smoke test used `start: false` to verify UI launch without forcing automated scrolling. |
| `capture-text` | `cleanshot_ocr` | `filepath`, `x`, `y`, `width`, `height`, `display`, `linebreaks` | No params; filepath; `linebreaks`; coordinates and display tests | Yes, v0.3.0 | Triggers CleanShot OCR only. It does not guarantee returning recognized text to OpenClaw. |
| `record-screen` | `cleanshot_record_screen` | `x`, `y`, `width`, `height`, `display` | No params; coordinates and display tests | Yes, v0.3.0 | Opens CleanShot screen recording mode. Recording workflow may require CleanShot UI confirmation. |
| `open-annotate` | `cleanshot_annotate_file` | `filepath` | Filepath test; filepath with spaces covered by utility encoding test | Yes, v0.4.0 | Filepath is validated locally, then passed to CleanShot. The plugin does not read or modify the file. |
| `pin` | `cleanshot_pin_file` | `filepath` | Filepath test; filepath with spaces test | Yes, v0.4.0 | Filepath is validated locally, then passed to CleanShot. The plugin does not read or modify the file. |
| `quick-access` | `cleanshot_quick_access` | none | No params test | Yes, v0.4.0 | Opens CleanShot Quick Access. |
| `settings` | `cleanshot_settings` | none | No params test; null and undefined skipping test | Yes, v0.4.0 | Opens CleanShot Settings. |

## Potential Missing CleanShot API Surface

This section should not be treated as a list of known missing features. It is a placeholder for a future comparison against the official CleanShot URL Scheme API documentation before v1.0.0.

- [ ] Missing commands
- [ ] Missing params
- [ ] Changed params
- [ ] Unsupported commands
- [ ] Behavior that cannot be verified without CleanShot UI interaction

## Known Limitations

- `cleanshot_ocr` triggers CleanShot OCR through the URL Scheme, but does not guarantee returning recognized text to OpenClaw. Recognized text may be handled by CleanShot UI or clipboard depending on CleanShot behavior and settings.
- The plugin uses macOS `open` via Node `execFile` because OpenClaw 2026.5.12 did not expose a tool-plugin URL opener for custom schemes like `cleanshot://`.
- OpenClaw may require `--dangerously-force-unsafe-install` because static scanning detects `child_process`.
- File tools pass filepaths to CleanShot but do not read, stat, modify, or upload files themselves.
- The `upload` action depends on CleanShot Cloud configuration.

## Pre-v1.0 API Audit Checklist

- [ ] Compare this table against the official CleanShot API docs.
- [ ] Confirm all URL commands are represented.
- [ ] Confirm all documented params are represented.
- [ ] Confirm all commands have URL builder tests.
- [ ] Confirm all tools have at least one agent smoke test.
- [ ] Confirm README and examples match actual behavior.
