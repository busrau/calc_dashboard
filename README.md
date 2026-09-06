# Calc Dashboard

A React + TypeScript calculator UI backed by a small Express API. The browser talks to the same origin (`http://localhost:8080/`); arithmetic is computed on the server so validation and math stay in one place.

## Setup

Prerequisites: Node.js 20+ and npm.

```bash
npm install
npm test
npm run dev
```

Then open [http://localhost:8080/](http://localhost:8080/).

| Process | Port | Role |
| --- | --- | --- |
| Vite (UI) | `8080` | Calculator frontend; proxies `/health` and `/v1/*` |
| Express (API) | `3001` | Calculator operations |

Production (UI + API on one port):

```bash
npm run build
set PORT=8080
npm start
```

On Unix shells use `PORT=8080 npm start`. The server serves `client/dist` and the API together on port 8080.

## API usage

JSON request bodies. Successful responses are `{ "result": <number> }`. Validation failures are `400` with `{ "error": "<message>" }`.

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| `GET` | `/health` | — | `{"status":"ok"}` |
| `POST` | `/v1/add` | `{"a":2,"b":3}` | `a + b` |
| `POST` | `/v1/subtract` | `{"a":10,"b":4}` | `a - b` |
| `POST` | `/v1/multiply` | `{"a":3,"b":7}` | `a * b` |
| `POST` | `/v1/divide` | `{"a":9,"b":3}` | `a / b` |
| `POST` | `/v1/power` | `{"a":2,"b":10}` | `a ^ b` |
| `POST` | `/v1/sqrt` | `{"a":81}` | `√a` |
| `POST` | `/v1/percentage` | `{"value":80,"percent":25}` | `percent%` of `value` |

Examples:

```bash
curl http://localhost:8080/health
curl -X POST http://localhost:8080/v1/add -H "Content-Type: application/json" -d "{\"a\":2,\"b\":3}"
curl -X POST http://localhost:8080/v1/percentage -H "Content-Type: application/json" -d "{\"value\":80,\"percent\":25}"
```

In local `npm run dev`, call the API on port `3001` or through the Vite proxy on `8080`.

### Validation

- Operands must be JSON numbers (`typeof number`) and finite (not `NaN` / `Infinity`).
- Strings such as `"2"` are rejected.
- Division by zero is rejected.
- Square root of a negative number is rejected.
- Overflow that yields `Infinity` is rejected.

## UI behavior

- Binary operations (`+ − × ÷ xʸ % of`): enter the first operand, tap the operator, enter the second, tap `=`.
- Square root applies immediately to the current display.
- `% of` follows the API: `80`, `% of`, `25`, `=` → `20`.
- Errors from the API (for example division by zero) appear under the display.

## Tests

```bash
npm test
```

- Server: pure math in `server/src/calculator.test.ts`, HTTP contract in `server/src/app.test.ts`.
- Client: display helpers in `client/src/api.test.ts`, keypad + mocked `fetch` in `client/src/Calculator.test.tsx`.

## Docker

```bash
docker compose up --build
```

The image builds both packages and listens on `8080`.

## Design rationale

- **Thin UI, trusted math.** The keypad only collects operands. Results always come from the API, so the browser never silently diverges from server rules.
- **Pure functions behind HTTP.** `calculator.ts` is framework-free and unit-tested; `routes.ts` only parses JSON and maps errors. That split keeps handlers small and makes edge cases (zero, negatives, overflow) easy to cover twice: once without I/O, once over HTTP.
- **Same-origin in the browser.** Vite proxies `/v1` and `/health` in development; production Express serves the built SPA. The client can use relative URLs with no CORS configuration for the happy path.
- **Explicit percentage contract.** The API is “percent of value,” not calculator-style “add 10%.” The `% of` label and the pending-operation hint (`80 % of`) match that contract so the UI does not imply a different formula.
- **Responsive without a component library.** A two-column layout collapses to a single column under 760px, with 56px keys for touch.
