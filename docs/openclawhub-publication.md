# OpenClawHub Publication Readiness

## Current Release Readiness Status

- Current latest local tag: `v0.7.0`
- Package verification passed with `npm pack --dry-run`
- Clean package install from the generated tarball passed
- OpenClaw packaged install from the generated tarball passed locally
- Runtime loading from the packaged artifact was verified
- Runtime tools were discovered successfully
- OpenClawHub / ClawHub publication status: NOT PUBLISHED

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

## Expected Publication Command

The `clawhub` CLI was not available on PATH during this readiness audit, and `openclaw docs clawhub` did not return usable documentation. Treat the publication command as a TODO until confirmed from official OpenClawHub / ClawHub docs.

Tentative shape to confirm:

```sh
clawhub package publish . --family code-plugin --dry-run
clawhub package publish . --family code-plugin
```

Do not run the actual publish command until the dry run, review, and manual approval are complete.

## Security Warning Disclosure

This plugin uses `execFile("open", [url])` only to dispatch validated `cleanshot://` URLs through macOS. CleanShot X exposes an official URL Scheme API, and macOS `open` is the normal system mechanism for dispatching custom URL schemes.

The launcher validates that the URL protocol is exactly `cleanshot:` before launching. It does not expose arbitrary shell execution and does not use `exec`.

OpenClaw static scanning may still flag the package because it imports Node `child_process`. This must be clearly disclosed before public release, along with the reason `--dangerously-force-unsafe-install` may be required for local installs.

## Known Blockers

- No GitHub repository / repository URL is configured yet.
- A final `v1.0.0` tag has not been created.
- Final API comparison against the official CleanShot URL Scheme docs is still required.
- ClawHub dry-run command and submission format have not been confirmed.
- Hub reviewer handling for the expected `child_process` static scanner warning needs a decision.

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
- Confirm the ClawHub dry-run command.
- Run the ClawHub dry run, for example `clawhub package publish . --family code-plugin --dry-run`, only after the command is confirmed.
- Get manual approval.
- Run the actual publish command only after manual approval.
