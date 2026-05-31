# Troubleshooting

## CleanShot Does Nothing

Enable CleanShot API control:

```text
CleanShot X -> Settings -> Advanced -> API -> Allow Applications to control CleanShot
```

Test the URL Scheme manually:

```sh
open "cleanshot://capture-fullscreen?action=save"
```

## Install Says package.json Missing openclaw.extensions

Verify `package.json` includes:

```json
{
  "openclaw": {
    "extensions": [
      "./dist/index.js"
    ]
  }
}
```

## Install Says Extension Entry Not Found

Build the plugin:

```sh
npm run build
```

Verify:

```sh
test -f dist/index.js && echo ok
```

## OpenClaw Blocks Dangerous Code

OpenClaw may flag `child_process` because this plugin calls macOS `open` via `execFile`.

For trusted local development after reviewing source:

```sh
openclaw plugins install . --link --dangerously-force-unsafe-install
```

## Runtime Tool List Does Not Update

Rebuild and restart Gateway:

```sh
npm run build
openclaw gateway restart
openclaw plugins inspect cleanshot --runtime
```

## Agent Does Not Call a CleanShot Tool

Check runtime discovery:

```sh
openclaw plugins inspect cleanshot --runtime
```

Check tool policy and allowlisting:

```sh
openclaw config get tools
```

If needed, add current CleanShot tool names to `tools.alsoAllow`.

## OCR Does Not Return Text

This is expected for the current implementation. `cleanshot_ocr` triggers CleanShot OCR through the URL Scheme, but does not guarantee returning recognized text to OpenClaw.

## File Tools Fail

Verify the filepath:

- is a non-empty string
- contains no newline or carriage return characters
- points to a harmless test image when smoke testing

Example local test image path:

```text
/tmp/cleanshot-openclaw-test.png
```
