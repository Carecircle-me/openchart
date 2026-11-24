# OpenChart

**Patient records that move in seconds, not faxes. Free and open source, powered by the PDRE (Patient-Directed Record Exchange) protocol.**

Move a patient's records between any two health offices in a few taps, with the patient's signed consent.

> **Status: v0.1 draft / experimental. Sandbox with synthetic data only.**
>
> Provided **AS IS, with no warranty and no liability**. Not certified, not a medical device, not legal or clinical advice. Do not use with real patient data. If you implement or deploy it, you are responsible for your own privacy (PHIPA, PIPEDA, HIPAA and others), security and compliance. Read the full [DISCLAIMER.md](DISCLAIMER.md).

---

## The problem

When a patient moves, switches dentists or gets referred, their records still travel by phone call, fax, CD, USB stick or a large email. In our experience running a dental office, one transfer costs roughly 20 to 30 minutes of admin on both ends, and the patient's care waits while it happens. Every practice system speaks its own language, so there is no common way to ask for records, prove the patient agreed, and send them.

## What OpenChart does

OpenChart is an open-source project for patient-directed record transfer. Its protocol, **PDRE**, is open, vendor-neutral and built on **HL7® FHIR® R4**. It adds the parts FHIR leaves open: a patient-signed consent step, a verified provider directory, a human release decision, encrypted delivery and a full audit trail.

1. **Request.** The new office picks the previous office from a verified directory and clicks **Request records**.
2. **Sign.** The patient gets a text or email link, confirms with a one-time code sent to the contact the previous office already has on file plus their date of birth, and taps **Sign**. They can untick items.
3. **Release.** Someone at the previous office reviews exactly what will go and taps **Release**.
4. **Receive.** Structured FHIR records and images land in the new office's review queue. Everyone gets an audit trail.

No broadcast patient search. No automatic release. No permanent central copy of clinical data.

It's designed for dental first, and for any discipline: medical, pharmacy, physio, chiro, optometry and specialists. Cloud, server or Windows desktop systems.

Who benefits and how: **[BENEFITS.md](BENEFITS.md)** (vendors, dental offices, patients).

## Quickstart (2 minutes, no install)

Requires Node.js 22.18 or later.

```
git clone https://github.com/Carecircle-me/openchart.git
cd openchart/reference
npm test        # run the tests
npm run demo    # watch request -> sign -> release -> receive -> audit with a synthetic patient
npm start       # run the mock hub on http://127.0.0.1:8787
```

## What's in this repo

| Path | What it is | Licence |
|---|---|---|
| [spec/](spec/) | The protocol specification (draft 0.1), including **Built on FHIR** | CC BY 4.0 |
| [openapi/](openapi/) | OpenAPI 3.1 draft of the core hub endpoints | Apache-2.0 |
| [reference/](reference/) | Dependency-free TypeScript mock hub and client, with tests | Apache-2.0 |
| [examples/](examples/) | Synthetic FHIR JSON examples (clearly fake) | CC0 1.0 |
| [BENEFITS.md](BENEFITS.md) | Benefits for vendors, offices and patients | CC BY 4.0 |
| [NAMING.md](NAMING.md) | OpenChart vs PDRE vs CareCircle Link | CC BY 4.0 |

## Built on open standards

HL7 FHIR R4, CA Core+, the HL7 Dental Data Exchange Implementation Guide, DICOM, and **SMART on FHIR** for vendor app authorisation. FHIR validation is required in conformance testing. Medplum (open source) is a suggested option for a reference FHIR server, self-hosted in Canada for any real data. Planned extensions: insurance eligibility (`Coverage`, `CoverageEligibilityRequest`) and booking (`Appointment`). See [spec/01-protocol.md](spec/01-protocol.md#0-built-on-fhir).

## Free and open

- Spec under **CC BY 4.0**, code under **Apache-2.0** (fine for closed commercial products), examples under **CC0**.
- A royalty-free patent commitment: [PATENTS.md](PATENTS.md).
- Implementing PDRE never requires any CareCircle product or service.
- Products that implement PDRE can say "works with OpenChart". The future "OpenChart Certified" badge is for products that pass certification.
- Names and the future "Certified" badge are covered by [TRADEMARKS.md](TRADEMARKS.md).

## Status and roadmap

- **Now (v0.1):** draft spec, OpenAPI draft, mock hub with synthetic data.
- **Next:** feedback from offices and vendors, spec 0.2, conformance test suite, desktop bridge prototype, a pilot with a few Ontario dental offices on synthetic data first.
- Real patient data only after independent security testing, privacy assessments and the agreements the law requires. See [spec/04-security-privacy.md](spec/04-security-privacy.md) section 7.

## Get involved

- Questions and ideas: open an issue (never include real patient data).
- Want to pilot it in your office or implement it in your software? Open an issue titled "Pilot" or "Implementer".
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md) (DCO sign-off, no CLA). Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Governance: [GOVERNANCE.md](GOVERNANCE.md).
- Security issues: report privately per [SECURITY.md](SECURITY.md).

---

Stewarded by CareCircle Connect Inc. (Toronto, Canada). **OpenChart** is the open-source project; **PDRE** is its technical protocol; **CareCircle Link** is CareCircle's own hosted network built on OpenChart, the first of what we hope will be many. See [NAMING.md](NAMING.md).

HL7®, FHIR® and the FHIR® [FLAME DESIGN] are the registered trademarks of Health Level Seven International. Their use does not constitute endorsement by HL7.
