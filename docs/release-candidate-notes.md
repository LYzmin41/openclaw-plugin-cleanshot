# Release Candidate Notes

## 0.7.0 Verification

Date/time: 2026-05-31 09:18:43 MSK

Publication status: NOT PUBLISHED to OpenClawHub / ClawHub.

## Package Dry Run

`npm pack --dry-run` passed.

- Package: `openclaw-plugin-cleanshot@0.6.0`
- Generated filename: `openclaw-plugin-cleanshot-0.6.0.tgz`
- Package size: 13.1 kB
- Unpacked size: 62.2 kB
- Total files: 22

Included expected release files:

- `dist/`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `openclaw.plugin.json`
- `docs/`
- `examples/`
- `package.json`

No unexpected local-only files were present in the package listing:

- `node_modules/`
- `.git/`
- local screenshots
- temporary files
- `coverage/`
- `.env` files
- unrelated editor/system files

## Generated Tarball

Created local package archive:

```text
openclaw-plugin-cleanshot-0.6.0.tgz
```

This artifact was created for local verification only and was not published.

## Clean Local Package Install

Clean npm install from the generated tarball passed in:

```text
/tmp/openclaw-cleanshot-release-test
```

Verified installed package contents in `node_modules/openclaw-plugin-cleanshot`:

- `dist/index.js` exists
- `openclaw.plugin.json` exists
- `README.md` and docs are packaged
- `examples/prompts.md` is packaged
- `package.json` contains `openclaw.extensions[0]` as `./dist/index.js`

## OpenClaw Local Tarball Install

OpenClaw local install from the tarball passed with the expected static scanner warning:

```sh
openclaw plugins install /Users/lyzmin41/Projects/CleanShot-OCtool/openclaw-plugin-cleanshot/openclaw-plugin-cleanshot-0.6.0.tgz --dangerously-force-unsafe-install --force
```

Expected warning:

- OpenClaw detected `child_process` in `dist/launcher.js`.
- Installation was allowed with `--dangerously-force-unsafe-install` because this local package was reviewed and only uses `execFile("open", [url])` after validating the `cleanshot:` protocol.

OpenClaw installed the archive as:

- Plugin id: `cleanshot`
- Install path: `~/.openclaw/extensions/cleanshot`
- Recorded version: `0.6.0`

During verification, the existing linked development plugin path was temporarily cleared from `plugins.load.paths` so the runtime could load the packaged archive directly. The linked path was restored after the tarball runtime check.

## Runtime Inspect Result

`openclaw plugins inspect cleanshot --runtime` loaded the packaged archive runtime from:

```text
~/.openclaw/extensions/cleanshot/dist/index.js
```

Runtime status:

```text
Status: loaded
Origin: global
Format: openclaw
```

Discovered tools:

- `cleanshot_capture`
- `cleanshot_all_in_one`
- `cleanshot_scrolling_capture`
- `cleanshot_ocr`
- `cleanshot_record_screen`
- `cleanshot_annotate_file`
- `cleanshot_pin_file`
- `cleanshot_quick_access`
- `cleanshot_settings`

## Plugin Doctor Result

`openclaw plugins doctor` reported:

```text
No plugin issues detected.
```

## Remaining Blockers Before v1.0.0

- Compare the coverage table against the official CleanShot URL Scheme API docs.
- Confirm no CleanShot URL commands or documented params are missing.
- Align release version metadata across `package.json` and `openclaw.plugin.json`.
- Decide whether to keep or remove local development linked plugin configuration before public release workflows.
- Recheck whether a future OpenClaw release provides an approved tool-plugin URL opener for custom URL schemes.
- Perform a final OpenClawHub / ClawHub publication dry run when publication is intended.

