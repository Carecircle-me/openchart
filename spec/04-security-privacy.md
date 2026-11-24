# Security, privacy and compliance

Draft 24 Nov 2026. **This is not legal advice.** It is a map for a privacy lawyer to review before any real patient data moves. Statements marked "to confirm" are our current understanding only. OpenChart makes **no certification or compliance claims** (no "HIPAA compliant", "PHIPA certified" or "SOC 2" badges) until they are real and verified. Marketing says what we actually do.

---

## 1. Roles under the law (Ontario first)

| Party | Likely role under PHIPA (to confirm) | What it means |
|---|---|---|
| Holding provider (dentist, physician, pharmacist, physio, chiro, optometrist) | **Health information custodian** | Decides what to disclose; must follow consent rules, lock-box and access rules; keeps the original record |
| Requesting provider | Custodian (once it receives the record) | Responsible for the copy it imports |
| Any hub operator (for example CareCircle Link) | **Health information network provider (HINP)** under O. Reg. 329/04 s. 6, and an **electronic service provider** | Must not use or disclose PHI except to provide the service. HINP duties include breach notice to custodians, a plain description of services and safeguards, a public description, an electronic record of all accesses and transfers, threat/risk and privacy impact assessments, and a written agreement with each custodian ([O. Reg. 329/04](https://www.ontario.ca/laws/regulation/040329)) |
| Patient app | Tool for the individual; operated by CareCircle as the patient's service provider | Patient-facing terms, separate from custodian agreements; no secondary use |
| Bridge agent / SDK vendor | Agent or service provider of the custodian (to confirm) | Covered by the custodian's agreement with the vendor |


---

## 2. Ontario: PHIPA, the colleges and access rules
- **Consent.** PDRE records **express consent** for every transfer, even where assumed implied consent in the circle of care might apply ([IPC Circle of Care](https://www.ipc.on.ca/sites/default/files/legacy/Resources/circle-of-care.pdf)). Disclosure outside Ontario relies on consent ([PHIPA](https://www.ontario.ca/laws/statute/04p03/)).
- **Lock-box.** Patient restrictions are respected, and the receiver is told when information reasonably necessary for care was withheld, without saying what ([IPC lock-box fact sheet](https://www.ipc.on.ca/en/media/1666/download?attachment=)).
- **Right of access.** Patient requests are answered within the PHIPA timelines (30 days, one 30-day extension). Fees must be reasonable cost recovery with an estimate first ([IPC](https://www.ipc.on.ca/en/health-organizations/access-and-correction)).
- **No broadcast search.** The fact that someone is a patient can be PHI. Requests go only to providers the patient names. The holder's local match is never revealed before consent. Counsel must confirm whether even a local pre-consent match is acceptable ([01-protocol](01-protocol.md) section 5).
- **Breach.** Custodians must notify affected individuals and, where regulation thresholds are met, the IPC. As a HINP, the hub must notify custodians. The incident runbook is in [05-reference-architecture](05-reference-architecture.md).
- **Colleges.** Recordkeeping expectations, for example the RCDSO's release documentation and its 1 to 2 week transfer guideline ([RCDSO FAQ](https://www.rcdso.org/en-ca/standards-guidelines-resources/rcdso-news/frequently-asked-questions/information-on-dental-recordkeeping)), are built into the release log. For each new discipline, check that college's guidance: CPSO, OCP, College of Physiotherapists, CCO, College of Optometrists. **E-signature acceptance must be confirmed with each college.**
- **Provincial systems.** We do not copy data from ConnectingOntario, ClinicalConnect, DHDR or OLIS into the network without Ontario Health agreements.

## 3. Other Canadian law (each needs a legal check before launch there)

| Jurisdiction | Main law(s) | Notes |
|---|---|---|
| Federal / private sector | **PIPEDA** | Applies to commercial activity where no substantially similar provincial law covers it, and to cross-border flows. Ontario's PHIPA is deemed substantially similar for custodians. |
| Alberta | **Health Information Act** (custodians), PIPA | HIA covers many regulated providers. Netcare rules apply to provincial EHR access. |
| British Columbia | **PIPA** (private practices), FIPPA (public bodies), E-Health Act | Note the data-residency expectations for public bodies |
| Quebec | **Law 25** (private sector), and the **Act respecting health and social services information** | French-language obligations and privacy impact assessments for transfers outside Quebec. Treat as a separate project. |
| Manitoba | PHIA | |
| Saskatchewan | HIPA | |
| Nova Scotia, New Brunswick, Newfoundland and Labrador | PHIA / PHIPAA / PHIA | |
| PEI, territories | Respective health information acts | |
| **Federal Bill S-5** (Connected Care for Canadians Act) | Not law. At second reading in the House of Commons as of 24 Nov 2026 ([LEGISinfo](https://www.parl.ca/LEGISInfo/en/bill/45-1/s-5)) | Would require interoperability and prohibit data blocking by health IT vendors. Details are left to regulations. Track it, don't depend on it. |

## 4. United States (later phase)
- **HIPAA.** Providers may disclose PHI to another provider for treatment without authorization (45 CFR 164.506). Patients have a right of access, generally within 30 days (45 CFR 164.524). A hub operator such as CareCircle Link would act as a **business associate** with BAAs. PDRE still records patient consent by design, which is stricter than HIPAA requires for treatment.
- **Information blocking (21st Century Cures Act; 45 CFR Part 171).** This applies to health care providers, developers of certified health IT, and **health information networks / exchanges**. A US hub network could fall under the HIN/HIE definition (to confirm). Then its own policies, such as requiring patient consent or a human release, must fit an exception (privacy, security, infeasibility, manner) and not be an unreasonable barrier. The HTI-1 rule also added a TEFCA manner exception ([eCFR 45 CFR 171](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171/subpart-B); [ONC HTI-1](https://healthit.gov/regulations/hti-rules/hti-1-final-rule/)). **US launch needs specific legal design work.**
- **42 CFR Part 2** (substance use disorder records), state privacy laws (for example sensitive data and minors' consent) and state e-signature rules.
- **TEFCA.** Consider connecting via a QHIN for reach rather than building a parallel US network.

## 5. GDPR-style principles (applied everywhere, whatever the law)
1. **Lawfulness and transparency:** express, plain-language consent; a public service description.
2. **Purpose limitation:** transfers for care and patient access only; no secondary use, analytics on PHI, sale or AI training.
3. **Data minimisation:** the hub sees minimal demographics for routing; clinical payloads are end-to-end encrypted.
4. **Accuracy:** external data flagged until verified.
5. **Storage limitation:** hub payloads deleted (crypto-shredded) after delivery plus a short retry window.
6. **Integrity and confidentiality:** section 6.
7. **Accountability:** PIA, TRA, audit, a named privacy officer, annual review.
8. **Individual rights:** access, withdraw, see history, restrict.

---

## 6. Security controls

### 6.1 Zero-trust architecture
- Every call is authenticated (mTLS + OAuth 2.0 tokens), authorised (scoped to tenant and Task), and logged. Network location grants nothing.
- **Tenant isolation:** each organisation is a tenant. Postgres row-level security keyed to tenant, per-tenant encryption keys, and no cross-tenant queries in application code (enforced by tests).
- **Scoped, short-lived tokens:** access tokens ≤ 5 min; refresh via signed client assertions only; **single-use release tokens** bound to Task + recipient + payload hash.
- **Least privilege** for staff and services; separate roles for request vs release; optional two-person release.
- **Approval gates:** no API path releases records without a recorded human approval at the holder.

### 6.2 Cryptography
- TLS 1.3 preferred (1.2 minimum) and mTLS between systems.
- **End-to-end encryption** of RecordBundles (JWE ECDH-ES + A256GCM) to the recipient's key; the hub holds ciphertext only.
- **Signed messages** (JWS ES256) for non-repudiation.
- At rest: AES-256, keys in cloud KMS/HSM in a Canadian region, **per-tenant keys**, rotation at least yearly and on incident.
- Patient app record copies encrypted to device keys.

### 6.3 Data residency
- A Canadian hub (CareCircle Link included) should run in **Canadian regions only** for Canadian tenants (primary and backup both in Canada). There are no PHI-processing sub-processors outside Canada for Canadian data.
- A US deployment would be a separate US-region stack with its own keys. There is no cross-border mixing.
- Self-hosted operators choose their own residency and must declare it in the directory.

### 6.4 AI and LLMs
- **PHI never goes to an LLM unredacted.** Any AI feature (for example summarising an incoming chart, or mapping free-text medications to codes) either runs on **redacted** data or on inference that is approved for PHI and hosted in Canada, or locally.
- AI output is always labelled as a suggestion, and a clinician confirms it. AI never makes release or import decisions.
- Shadow evaluations use de-identified or synthetic data only.

### 6.5 Immutable audit
- Hash-chained, append-only audit with the chain head anchored to WORM storage (object lock). Each custodian and patient can view or export their slice. Retention follows legal requirements, to confirm per province.

### 6.6 Secure development and operations
- Threat model (STRIDE) per component. Dependency and container scanning; SBOM per release; signed builds and reproducible releases for the bridge.
- Secrets in a managed vault, never in code. Infrastructure as code. Strict egress allow-lists.
- Penetration test before pilot with real data (spend needs approval). Coordinated vulnerability disclosure (`SECURITY.md`). Bug bounty later.
- Rate limits and abuse detection on requests (anti-fishing), OTP sends and directory search.
- Backups encrypted and tested; disaster recovery in a second Canadian region.

---

## 7. Required before any real patient data (gates)
1. Privacy lawyer review: roles (HINP / ESP), consent model, the pre-consent match step, e-signature validity, delegation, cross-province transfers.
2. **Privacy impact assessment** and **threat/risk assessment**, completed and signed off.
3. Custodian participation agreement and HINP/ESP agreement templates, drafted by counsel.
4. Patient terms and privacy notice.
5. Incident and breach runbooks, tested in a tabletop exercise.
6. External penetration test on the pilot stack.
7. Written go-live approval from the operator's accountable executive.

## 8. Wording rules for marketing and docs
- Say: "Hosted in Canada", "encrypted end to end", "every action is logged", "patient consent required", "a privacy impact assessment has been completed" (only once it has).
- Don't say: "HIPAA compliant", "PHIPA certified", "fully secure", "government approved", "Canada's leading" or any unmeasured time-saving number.
