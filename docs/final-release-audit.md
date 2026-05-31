# Final Release Audit

## Release Candidate Status

- Current version: `0.8.0`
- Next planned checkpoint: `0.9.0`
- Planned stable release: `1.0.0`
- Publication status: not published

## Implemented Tools

- `cleanshot_capture`
- `cleanshot_all_in_one`
- `cleanshot_scrolling_capture`
- `cleanshot_ocr`
- `cleanshot_record_screen`
- `cleanshot_annotate_file`
- `cleanshot_pin_file`
- `cleanshot_quick_access`
- `cleanshot_settings`

## Verified Milestones

- `v0.1.0`: capture MVP verified end to end.
- `v0.2.0`: All-In-One and scrolling capture verified.
- `v0.3.0`: OCR and screen recording verified.
- `v0.4.0`: utility and file tools verified.
- `v0.5.0`: API coverage documentation added.
- `v0.6.0`: release, security, and troubleshooting documentation added.
- `v0.7.0`: tarball clean install and OpenClaw packaged runtime verified.
- `v0.8.0`: OpenClawHub publication readiness docs and version metadata alignment completed.

## Current Package Verification

Current local verification commands:

- `npm run build`
- `npm run typecheck`
- `npm test`
- `npm pack --dry-run`

The package dry run includes the expected package surface:

- `dist/`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `openclaw.plugin.json`
- `docs/`
- `examples/`
- `package.json`

The package dry run excludes local-only files:

- `node_modules/`
- `.git/`
- `.env` files
- temporary files
- editor/system files

## Known Limitations

- `cleanshot_ocr` triggers CleanShot OCR but does not guarantee returning text to OpenClaw.
- The plugin uses `execFile("open", [url])` for macOS URL Scheme dispatch.
- OpenClaw static scanning detects `child_process`.
- Installation may require `--dangerously-force-unsafe-install`.
- The `upload` action depends on CleanShot Cloud configuration.
- File tools pass filepaths to CleanShot but do not read, stat, or modify files themselves.

## Remaining Blockers Before v1.0.0

- Manually compare against the official CleanShot URL Scheme API docs.
- Confirm no missing commands or params.
- Decide final strategy for the `child_process` warning in the public Hub listing.
- Create or confirm the GitHub repository URL.
- Add the `repository` field to `package.json` once the GitHub repo exists.
- Confirm ClawHub / OpenClawHub CLI installation and dry-run publish command.
- Do final manual approval before actual publication.

## v1.0.0 Go/No-Go Checklist

- [ ] Build passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] `npm pack --dry-run` is clean.
- [ ] Tarball install is clean.
- [ ] OpenClaw install from tarball works.
- [ ] Runtime lists all 9 tools.
- [ ] Plugin doctor reports no issues.
- [ ] Security docs reviewed.
- [ ] README reviewed.
- [ ] Official CleanShot docs compared.
- [ ] Repository URL set.
- [ ] ClawHub dry run succeeds.
- [ ] Manual approval granted.
