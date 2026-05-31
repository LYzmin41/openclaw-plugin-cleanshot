# Release Checklist

Use this checklist before tagging or publishing the CleanShot OpenClaw plugin.

## Pre-release Checks

```sh
npm install
npm run build
npm run typecheck
npm test
```

Confirm:

- `dist/index.js` exists after build.
- `package.json` contains `openclaw.extensions: ["./dist/index.js"]`.
- `openclaw.plugin.json` is valid JSON.
- README, examples, changelog, and API coverage docs match actual behavior.
- Repository URL and publishing metadata are added before public release if a remote repository is created.

## Clean Install Test

```sh
npm install
npm run build
openclaw plugins install . --link --dangerously-force-unsafe-install
openclaw gateway restart
```

## OpenClaw Runtime Verification

```sh
openclaw plugins inspect cleanshot --runtime
openclaw plugins doctor
```

Required runtime tools:

- `cleanshot_capture`
- `cleanshot_all_in_one`
- `cleanshot_scrolling_capture`
- `cleanshot_ocr`
- `cleanshot_record_screen`
- `cleanshot_annotate_file`
- `cleanshot_pin_file`
- `cleanshot_quick_access`
- `cleanshot_settings`

## Agent Smoke Tests

Use agent prompts like:

- "Use CleanShot to capture the fullscreen and save it."
- "Use CleanShot All-In-One mode."
- "Call the tool cleanshot_scrolling_capture with start false."
- "Call the tool cleanshot_ocr with linebreaks true."
- "Call the tool cleanshot_record_screen."
- "Call the tool cleanshot_annotate_file with filepath /tmp/cleanshot-openclaw-test.png."
- "Call the tool cleanshot_pin_file with filepath /tmp/cleanshot-openclaw-test.png."
- "Call the tool cleanshot_quick_access."
- "Call the tool cleanshot_settings."

For file tool smoke tests, use a harmless temporary image file, not private or important user files.

## Security Review

- Confirm only `cleanshot://` URLs are launched.
- Confirm launcher uses `execFile`, not `exec`.
- Confirm file tools validate filepaths without reading, statting, modifying, or uploading files.
- Confirm README and security docs explain the OpenClaw dangerous-code warning.
- Confirm no arbitrary shell execution is exposed to the agent.

## ClawHub/OpenClawHub Readiness

- Confirm final package name and description.
- Confirm package files include `dist`, docs, examples, README, changelog, license, and manifest.
- Confirm repository URL before adding it to package metadata.
- Confirm screenshots or demo notes if the hub listing needs them.
- Confirm official CleanShot API docs have been checked against `docs/cleanshot-api-coverage.md`.

## Known Blockers Before Public Release

- Repository URL is not configured yet.
- Official CleanShot URL Scheme API docs still need a final pre-v1.0 comparison.
- OpenClaw 2026.5.12 still requires forced unsafe install for local development because static scanning sees `child_process`.
