# OpenClawHub Publication Readiness

## Current Release Readiness Status

- Current latest local tag: `v1.0.1`
- Current publish candidate: `1.0.1`
- Package verification passed with `npm pack --dry-run`
- Clean package install from the generated tarball passed
- OpenClaw packaged install from the generated tarball passed locally
- Runtime loading from the packaged artifact was verified
- Runtime tools were discovered successfully
- OpenClawHub / ClawHub publication status: NOT PUBLISHED
- Author / maintainer: Lyzmin41

Verified runtime tools:

- `cleanshot_capture`
- `cleanshot_all_in_one`
- `cleanshot_scrolling_capture`
- `cleanshot_ocr`
- `cleanshot_record_screen`
- `cleanshot_annotate_file`
- `cleanshot_pin_file`
- `cleanshot_quick_access`
- `cleanshot_settings`

## Required Before Publishing

- Confirm the official CleanShot URL Scheme docs against `docs/cleanshot-api-coverage.md`.
- Confirm there are no missing CleanShot commands or params.
- Confirm `package.json` and `openclaw.plugin.json` version alignment.
- Confirm final package name and description.
- Confirm repository URL / GitHub repo.
- Confirm license.
- Confirm security docs.
- Confirm child_process warning strategy.
- Confirm ClawHub / OpenClawHub submission format.

## GitHub Repository Status

GitHub repository URL is configured:

```text
https://github.com/LYzmin41/openclaw-plugin-cleanshot
```

Repository visibility at creation time: private.

`origin` is configured as:

```text
https://github.com/LYzmin41/openclaw-plugin-cleanshot.git
```

`main` and all tags from `v0.1.0` through `v1.0.0` were pushed successfully.

Package metadata now includes:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/LYzmin41/openclaw-plugin-cleanshot.git"
},
"bugs": {
  "url": "https://github.com/LYzmin41/openclaw-plugin-cleanshot/issues"
},
"homepage": "https://github.com/LYzmin41/openclaw-plugin-cleanshot#readme"
```

## Publication Metadata

- Author / maintainer: Lyzmin41
- Repository: `https://github.com/LYzmin41/openclaw-plugin-cleanshot`
- Publication status: NOT PUBLISHED
- OpenClaw compatibility metadata:
  - `openclaw.compat.pluginApi`: `>=2026.5.12`
  - `openclaw.build.openclawVersion`: `2026.5.12`

Author metadata lives in `package.json`, `README.md`, this publication readiness document, and the Hub listing. `openclaw.plugin.json` is intentionally unchanged because local manifest references did not clearly establish author or maintainer fields for this plugin manifest shape.

## Expected Publication Command

Project-owner review of ClawHub publication docs confirmed this command shape:

Dry run:

```sh
clawhub package publish . --family code-plugin --dry-run
```

Actual publish:

```sh
clawhub package publish . --family code-plugin
```

Do not run the actual publish command until manual approval.

The `clawhub` CLI was not available on PATH during earlier v0.8/v0.9/v1.0 checks. For publication readiness, `clawhub@0.18.0` was installed locally as a dev dependency and invoked through `npx`.

Local dry run succeeded:

```sh
npx clawhub package publish . --family code-plugin --dry-run
```

Dry-run summary:

- Source: `github:LYzmin41/openclaw-plugin-cleanshot@main`
- Family: `code-plugin`
- Name: `openclaw-plugin-cleanshot`
- Display: `CleanShot`
- Version: `1.0.1`
- Files: 25 files
- Tags: `latest`
- Actual publication status: NOT PUBLISHED

The final manual publish command is documented here but has not been executed:

```sh
npx clawhub package publish . --family code-plugin
```

Do not run this command until manual approval is granted.

## Security Warning Disclosure

This plugin uses `execFile("open", [url])` only to dispatch validated `cleanshot://` URLs through macOS. CleanShot X exposes an official URL Scheme API, and macOS `open` is the normal system mechanism for dispatching custom URL schemes.

The launcher validates that the URL protocol is exactly `cleanshot:` before launching. It does not expose arbitrary shell execution and does not use `exec`.

OpenClaw static scanning may still flag the package because it imports Node `child_process`. This must be clearly disclosed before public release, along with the reason `--dangerously-force-unsafe-install` may be required for local installs.

## Known Blockers

- Hub reviewer handling for the expected `child_process` static scanner warning needs a decision.
- Actual publication requires manual approval.

## Final Publish Checklist

- Run `npm run build`.
- Run `npm run typecheck`.
- Run `npm test`.
- Run `npm pack --dry-run`.
- Run `npm pack`.
- Perform a clean install from the generated tarball.
- Install the tarball into OpenClaw locally.
- Run `openclaw plugins inspect cleanshot --runtime`.
- Run `openclaw plugins doctor`.
- Run the ClawHub dry run: `clawhub package publish . --family code-plugin --dry-run`.
- Get manual approval.
- Run the actual publish command only after manual approval.
