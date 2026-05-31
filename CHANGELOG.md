# Changelog

## Unreleased / 1.0.1

- Added GitHub repository metadata for publication readiness.
- Updated publication documentation with GitHub repository status.
- Documented that ClawHub CLI is not currently available on PATH for local dry-run publishing.

## 1.0.0

- First stable local release candidate of the CleanShot OpenClaw plugin.
- Includes nine CleanShot tools:
  - `cleanshot_capture`
  - `cleanshot_all_in_one`
  - `cleanshot_scrolling_capture`
  - `cleanshot_ocr`
  - `cleanshot_record_screen`
  - `cleanshot_annotate_file`
  - `cleanshot_pin_file`
  - `cleanshot_quick_access`
  - `cleanshot_settings`
- Confirmed official CleanShot URL Scheme API coverage for the implemented scope.
- Confirmed package build, typecheck, tests, and npm package dry-run.
- Prepared documentation for security, troubleshooting, release checklist, API coverage, release candidate notes, and OpenClawHub publication readiness.
- Publication to OpenClawHub has not yet happened.

## Unreleased / 0.9.0

- Added final pre-v1.0 release audit documentation.
- Added v1.0.0 go/no-go checklist.
- Updated package and plugin manifest versions to 0.9.0.

## Unreleased / 0.8.0

- Added OpenClawHub publication readiness documentation.
- Audited package/plugin version metadata for release readiness.
- Improved public-facing README publication status and documentation links.
- Aligned package and plugin manifest versions for the v0.8.0 release-readiness checkpoint.

## Unreleased / 0.7.0

- Added release candidate verification notes.
- Verified npm package contents with npm pack.
- Verified clean local package install.
- Verified OpenClaw runtime loading from packaged artifact.

## Unreleased / 0.6.0

- Added release checklist documentation.
- Added security documentation.
- Added troubleshooting documentation.
- Improved package metadata for release readiness.
- Improved README documentation links and public install guidance.

## Unreleased / 0.5.0

- Added CleanShot API coverage audit documentation.
- Added pre-v1.0 API audit checklist.

## Unreleased / 0.4.0

- Added `cleanshot_annotate_file`
- Added `cleanshot_pin_file`
- Added `cleanshot_quick_access`
- Added `cleanshot_settings`
- Added tests for utility/file URL commands

## Unreleased / 0.3.0

- Added `cleanshot_ocr`
- Added `cleanshot_record_screen`
- Added URL builder tests for `capture-text` and `record-screen`

## Unreleased / 0.2.0

- Added `cleanshot_all_in_one`
- Added `cleanshot_scrolling_capture`
- Added URL builder tests for new commands

## 0.1.0

- Initial MVP
- Added `cleanshot_capture` tool
- Added CleanShot URL builder
- Added macOS launcher with strict `cleanshot://` validation
- Added tests
- Verified end-to-end OpenClaw agent call
