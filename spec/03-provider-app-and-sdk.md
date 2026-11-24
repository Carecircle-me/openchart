# Provider app, vendor integration and SDKs

Draft 24 Nov 2026. This doc covers what providers and PMS/EMR vendors get: the in-product **Request records** button and **Approve release** inbox, SDKs, a desktop bridge, a sandbox, a conformance suite, certification, and a standalone web app for offices whose software hasn't integrated yet.

---

## 1. Provider experience (any discipline)

### 1.1 "Request records" button (requesting office)
- Lives on the patient profile in the PMS/EMR (or the web app).
- Opens a small panel:
  1. **From:** directory autocomplete (name, city, discipline; verified badge). The patient can also pick on their phone.
  2. **What:** preset (Full transfer, Referral, Medication list, Pre-op summary, Imaging only, Custom).
  3. **Why:** Continuing care / Referral / Second opinion / Pre-procedure.
  4. **Patient contact for consent:** pre-filled from the chart.
- **Send** = one click. The status chip on the profile then shows: Awaiting patient → Signed → Approved → Arrived.
- Several sources in one go: "+ Add pharmacy", "+ Add family doctor".

### 1.2 "Approve release" inbox (holding office)
- A badge in the PMS/EMR toolbar. Each card shows: requester (verified), patient match confidence, consent status and signature evidence, preset, any lock-box flags, and the fee setting.
- **Preview** shows exactly what will go, with toggles per item.
- **Release** = one tap by an authorised role (office setting: clinician, manager, privacy lead, or two-person approval for full transfers). **Decline** gives a reason.
- After release, the system writes the release log into the chart (date, recipient, items, method) automatically.

### 1.3 Incoming queue (requesting office)
- New bundles land in **quarantine**. Staff confirm the patient match (side by side), then **Import all** or item by item.
- Imaging goes to the imaging module or document centre; PDFs go to documents; structured allergies, meds and conditions go in as **external, needs verification**.
- **Wrong patient? Reject** sends an Ack with `rejected-wrong-patient` and starts the incident runbook.

### 1.4 Office settings
- Who can request or approve; default presets; years of notes in a full transfer; fees (off by default); auto-reminders; restricted-item handling; notification channels; data retention for received bundles before import.

---

## 2. Ways to integrate (vendor options)

| Option | Effort for vendor | Conformance | Notes |
|---|---|---|---|
| **A. Native (SDK)** | Medium | L2 to L4 | Best UX. The button and inbox are built into the product. |
| **B. Embedded UI components** | Low | L2 | Drop-in web components or iframe with SMART-style launch context. The vendor supplies patient context and a document-write API. |
| **C. Desktop bridge** | Low for vendor, small install for office | L1 to L2 (L3 with mapping) | For Windows desktop PMSs. Uses documented exports, vendor APIs, or permissioned DB read for export, plus a document-import folder or API for receive. **No screen scraping.** |
| **D. Aggregator connector** | None for vendor | L1 to L2 | Via an official read/write aggregator (for example NexHealth Synchronizer or Sikka). Costs per office and Canadian data hosting must be confirmed. Treat as temporary. |
| **E. Web app only** | None | L0 | The office uses the OpenChart web app next to its PMS |

---

## 3. SDKs (Apache-2.0, open source)

| SDK | Target | Contents |
|---|---|---|
| **TypeScript / JavaScript** (`@pdre/sdk`, placeholder name) | Cloud PMS/EMR, web apps, Node services | FHIR models for PDRE profiles, hub client, JWS/JWE helpers, Task state machine, webhooks, UI web components (`<pdre-request-button>`, `<pdre-release-inbox>`) |
| **C# / .NET** (`Pdre.Sdk`) | Windows desktop practice systems (many clinic, dental and allied-health systems) | Same core plus Windows Certificate Store / DPAPI key storage, background service template, import-to-folder helpers |
| **Java / Kotlin** (`org.pdre:sdk`) | Hospital and EMR back ends, Android | Same core, built on the HAPI FHIR models |
| **Python** (`pdre`) | Scripts, data mapping, test tools, small vendors | Same core, plus mapping toolkit and test harness |

Common to all SDKs:
- Typed builders for RecordRequest, Consent read, ReleaseApproval, RecordBundle and Ack.
- **Crypto done right by default**: key generation, rotation, JWS sign/verify and JWE encrypt/decrypt, with no algorithm choices exposed to the developer.
- Token handling for SMART Backend Services and UDAP registration.
- Resumable large-file upload/download with hash checks.
- Idempotency and retry with backoff.
- Mapping helpers from common PMS fields to FHIR (tooth numbering FDI↔Universal, perio, medication text → coded where possible, flagged otherwise).
- Fixtures with **synthetic patients only**.

---

## 4. Desktop bridge agent

For desktop and on-premise systems that can't call out to the cloud themselves.

- **What it is:** a small signed Windows service (.NET), installed on the office server with the office's and the vendor's permission.
- **Network:** **outbound-only** mTLS WebSocket to the hub. No inbound ports, no VPN.
- **Export:** reads through, in order of preference, (1) the vendor API, (2) documented export files, (3) read-only permissioned database access where the vendor allows it. Writes into the PMS only through supported import paths (document import, the vendor API).
- **Never:** screen-scraping, UI automation, or storing PHI longer than needed. The local cache is encrypted and purged after Ack.
- **Keys** are held in the Windows certificate store (TPM-backed where available) and rotated automatically.
- **Updates:** signed auto-updates with staged rollout and rollback.
- **Health:** heartbeat, version and queue depth reported to the hub, with no PHI in telemetry.
- **Admin:** a local tray app shows status and lets the office pause the bridge.

---

## 5. Standalone web app (no integration needed)

So every office can join on day one, even if its PMS vendor hasn't integrated.

- Request, consent tracking, approve release, upload (drag in PDFs and images, or export files from the PMS) and download (a packaged ZIP with PDF summary, images and FHIR JSON ready to import).
- **Secure-link fallback for non-members:** when a request goes to an office not on the network, that office receives a **one-time secure link** by email or fax-to-link. It can verify, view the signed consent, and upload or approve without creating an account. Every such request is also an invitation to join.
- Roles, MFA and audit, the same as the integrated version.

---

## 6. Sandbox
- A public sandbox hub with **synthetic data only** (Synthea-style generated patients plus hand-built fixtures for medical, pharmacy, physio, mental health and dental).
- Self-serve vendor sign-up, test certificates from a test CA, and test directory entries.
- Simulated patients: test OTPs, no real SMS or email (the sandbox never sends to real numbers).
- Scenario runner: happy path, decline, revoke, wrong-patient, partial release with withheld notice, recall, large CBCT, expired consent.

---

## 7. Conformance test suite
- Open source (Apache-2.0), runnable locally in CI or against the sandbox.
- Modelled on ONC's open **Inferno** approach: test kits per conformance level and discipline ([Inferno](https://fhir.healthit.gov/test-kits/onc-certification-g10/)).
- Checks: profile validation (FHIR validator plus PDRE profiles), state machine transitions, signatures and encryption, token scopes, idempotency, error handling, Ack timing, withheld notice handling, external-unverified tagging on import, audit event emission, and accessibility of embedded UI.
- Output: a signed test report that can be attached to a certification application.

---

## 8. Certification ("OpenChart Certified")

| Step | What happens |
|---|---|
| 1. Self-test | Vendor passes the conformance suite for its level and discipline |
| 2. Submit | Signed test report, security questionnaire, privacy summary, support contacts |
| 3. Review | Live test with the certification team in the sandbox, plus a spot check of UX (consent display, release preview, quarantine) |
| 4. Pilot | Production access for a limited number of offices, with monitoring |
| 5. Listed | Directory listing with level badges and use of the mark per trademark policy |
| 6. Renewal | Annual re-test, and re-test on major spec versions |

Certification terms will be published separately. Certification is **not** a privacy or security compliance certification, and must never be marketed as one.

---

## 9. Engineering requirements for implementers
- **Tenant isolation**: each office is its own tenant on the hub. Vendor tokens are scoped to the offices that authorised them.
- **Scoped, short-lived tokens** (≤ 5 minutes) and single-use release tokens.
- **No PHI to LLMs unredacted.** Any AI helper in a vendor or CareCircle app (for example an incoming-chart summary) runs on redacted data, or on approved Canadian PHI-compliant or local inference only.
- **Immutable audit** of every action.
- **Approval gates**: the release is always a human action. The SDK has no "auto-release" API.
