# OpenChart OpenAPI description (draft, PDRE protocol)

`openchart-hub.yaml` is an OpenAPI 3.1 draft of the core hub endpoints: directory lookup, record request, patient consent and withdrawal, release and decline, transfer fetch and acknowledgement, and audit. It matches the mock hub in [`../reference`](../reference) and validates with `openapi-spec-validator`.

Payloads are HL7 FHIR R4 resources. Production authorisation is SMART on FHIR Backend Services; the mock hub's `X-PDRE-Org` header is for the local sandbox only.

Licensed under Apache-2.0. Experimental; see [DISCLAIMER.md](../DISCLAIMER.md).
