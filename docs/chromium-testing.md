# Chromium browser QA

AegisPhish Lab uses Playwright with Chromium as an isolated frontend QA tool. The tests target the local Next.js application only and do not visit or interact with third-party phishing pages.

Checks include initial page rendering, uncaught JavaScript exceptions, and horizontal overflow at mobile (390px), tablet (768px), and desktop (1365px) widths. They do not execute campaigns, collect credentials, or change backend or database state.

## Local use

Start the frontend using the repository's workspace tooling and required development environment. In another terminal:

```bash
python -m pip install -r tests/browser/requirements.txt
python -m playwright install chromium
python -m pytest -q tests/browser
```

Set `AEGISPHISH_BASE_URL` to the local frontend URL if it is not `http://127.0.0.1:3000`. Use only an instance you own or are authorised to test. These smoke tests are not a penetration test or a full campaign workflow test.
