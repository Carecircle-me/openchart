# OpenChart mock hub and TypeScript client (PDRE protocol)

A small, dependency-free, in-memory mock of a PDRE hub plus a tiny TypeScript client. It runs the whole one-click flow locally with **synthetic data** from [`../examples`](../examples).

> **Sandbox only.** No real encryption, no real authentication (the `X-PDRE-Org` header stands in for SMART Backend Services), a fixed one-time code (`000000`), and nothing is ever sent by SMS or email. **Never use it with real patient data.** See [DISCLAIMER.md](../DISCLAIMER.md).

Requires Node.js 22.18+ (runs TypeScript natively; no install step).

```
npm test       # 6 tests: happy path, consent checks, withdrawal, auth, decline
npm run demo   # prints each step of request -> sign -> release -> receive -> audit
npm start      # mock hub on http://127.0.0.1:8787 (PORT to change)
```

Try it with curl:

```
curl -s http://127.0.0.1:8787/directory/Organization?name=Sample
curl -s -X POST http://127.0.0.1:8787/requests -H 'X-PDRE-Org: office-b-london' -H 'content-type: application/json' \
  -d '{"holderOrg":"office-a-ajax","preset":"dental-full","patient":{"family":"Sample","given":"Jane","birthDate":"1985-04-12"}}'
```

What it demonstrates:
- No patient search; the holder's local match is never revealed to the requester.
- Patient verification with a code to the holder's contact on file plus date of birth, with one generic error for every failure.
- Granular consent: unticked sections are not sent, and a "withheld at the patient's direction" notice never says what.
- Release is always a named human decision; only the named recipient can fetch the transfer.
- Received clinical items are tagged `external-unverified`.
- Every step writes a FHIR `AuditEvent`.

Files: `src/hub.ts` (protocol logic), `src/server.ts` (HTTP), `src/client.ts` (client), `test/flow.test.ts`, `scripts/demo.ts`.

Licensed under Apache-2.0.
