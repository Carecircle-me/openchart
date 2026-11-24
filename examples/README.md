# Examples (synthetic data only)

Every file here is **made up**. The people, offices, phone numbers, conditions and procedures are fictional and are tagged `synthetic` in `meta.tag`. Phone numbers use the 555-01xx fictional range. Domains use `example.org`.

Never add real patient data to this folder or anywhere in this repository.

| File | What it shows |
|---|---|
| `directory.json` | Two synthetic dental offices and their endpoints (FHIR `Organization`, `Endpoint`) |
| `holder-chart-office-a.json` | The synthetic chart the holding office has for "Jane Sample", used by the mock hub |
| `record-request-task.json` | A RecordRequest (`Task`) |
| `consent.json` | A ConsentGrant (`Consent`) with one item excluded by the patient |
| `audit-event.json` | An `AuditEvent` for a release |

A full RecordBundle is produced by running the mock hub demo (`cd reference && npm run demo`).

## Licence

The examples are dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). You can copy them into any product with no attribution.
