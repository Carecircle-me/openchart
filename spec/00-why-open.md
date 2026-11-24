# Why an open protocol

Draft 24 Nov 2026. This doc covers why OpenChart and its protocol, PDRE, should be open, who benefits, and what can go wrong. No invented statistics appear here. Where we have no measured number we say so. Anything we want to claim will be measured in pilots first.

---

## 1. Short answer

**Yes, make the protocol open.** In health IT, open standards that nobody owns tend to spread, and proprietary formats tend to stay inside one vendor's customers. A PMS vendor will not build to a format a competitor controls. Vendors will build to an open spec with a free licence, a public test suite and neutral governance, especially as governments start to require interoperability. The spec belongs to everyone who implements it.

What we open:
- **The specification**: message types, FHIR profiles, discipline presets, consent model, trust rules and conformance levels.
- **Reference code**: SDKs, a reference hub, the desktop bridge, the conformance test suite and a sample patient app.

---

## 2. Precedents: what worked elsewhere

| Precedent | What it shows | Source |
|---|---|---|
| **HL7 FHIR** | HL7 publishes FHIR openly. Anyone may copy it and build derivative specs and products, and HL7 protects the FHIR trademark. That mix of open content and a protected name is the model we copy. | [HL7 FHIR R4 licence](https://hl7.org/fhir/R4/license.html) |
| **SMART on FHIR / SMART App Launch** | An open authorisation layer on top of FHIR. US certified EHRs must support SMART App Launch under ONC's standardized API criterion § 170.315(g)(10). An open spec became a regulatory baseline. | [ONC (g)(10) API Resource Guide](https://onc-healthit.github.io/api-resource-guide/g10-criterion/); [Inferno SMART test kit](https://fhir.healthit.gov/test-kits/smart-app-launch/) |
| **ONC Inferno test kits** | Free, open test tools let any vendor check conformance before certification. We plan the same for OpenChart. | [Inferno (g)(10) Test Kit](https://fhir.healthit.gov/test-kits/onc-certification-g10/) |
| **CARIN Alliance / Blue Button 2.0** | CMS requires impacted US payers to offer a FHIR Patient Access API, and says the open CARIN IG for Blue Button can meet the technical requirement. Patient-directed access built on an open IG. | [CMS Patient Access API](https://www.cms.gov/initiatives/burden-reduction/overview/interoperability/frequently-asked-questions/patient-access-api); [CARIN IG for Blue Button](https://hl7.org/fhir/us/carin-bb/STU2.1/Use_Case.html) |
| **TEFCA** | A US national "network of networks" under a common agreement. It went live in Dec 2023, and 11 QHINs are designated as of late 2026 per the RCE. Shows that **trust frameworks and legal agreements** matter as much as data formats. | [RCE Designated QHINs](https://rce.sequoiaproject.org/designated-qhins/); [RCE Oracle designation](https://rce.sequoiaproject.org/new-designated-qhin-new-sops-and-more/) |
| **Carequality and CommonWell** | Competing networks that agreed to connect (general availability since Nov 2018). Shows that a neutral framework lets rivals interoperate. | [CommonWell Carequality connectivity](https://www.commonwellalliance.org/connect-to-the-network/carequality/); [Carequality FAQ](https://carequality.org/carequality-commonwell-connectivity-faqs/) |
| **Epic Care Everywhere** | A large vendor-run exchange that works well inside and beyond one vendor's customers. It also shows the limit: a network run by one vendor is a moat. Smaller vendors and small practices need a neutral option. | [Epic Care Everywhere](https://www.epic.com/careeverywhere/) |
| **NHS England GP2GP** | The closest match to our idea. When a patient registers with a new GP, the new GP system requests the record, the old one sends it, and the new practice reviews and files it, then acknowledges. It has been live since 2005 and is mandated in the GP contract. Shows that system-to-system transfer on patient move is achievable at national scale, and that a **mandate** drives use. | [NHS England Digital, GP2GP](https://digital.nhs.uk/services/gp2gp); [GP registration guide](https://digital.nhs.uk/developer/guides-and-documentation/building-healthcare-software/gp-registration) |
| **Australia My Health Record** | A national record. From 1 July 2026, pathology and diagnostic imaging providers must upload reports, with exceptions, under "Sharing by Default" legislation. Shows governments moving from voluntary to required sharing. | [Australian Digital Health Agency](https://www.digitalhealth.gov.au/initiatives-and-programs/my-health-record/pathology-and-diagnostic-imaging-providers-uploading-to-my-health-record); [Sharing by Default Act 2025](https://www.ato.gov.au/law/view/pdf/acts/20250008.pdf) |
| **EU European Health Data Space (EHDS)** | Regulation (EU) 2025/327 entered into force 26 Mar 2025. Patient summaries and ePrescriptions must be exchangeable from 26 Mar 2029, and images, lab results and discharge reports from 26 Mar 2031. EHR systems must meet common specifications. Interoperability is becoming a market-entry rule for vendors. | [European Commission EHDS](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en); [EUR-Lex 2025/327](https://eur-lex.europa.eu/eli/reg/2025/327) |
| **US information blocking rules** | 45 CFR Part 171 defines information blocking and its exceptions for certified health IT developers, HIEs/HINs and providers. Vendors that block exchange face penalties. | [eCFR 45 CFR 171](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171/subpart-B); [ONC HTI-1](https://healthit.gov/regulations/hti-rules/hti-1-final-rule/) |
| **Canada Health Infoway: Shared Pan-Canadian Interoperability Roadmap and CA Core+** | Canada's national plan prioritises patient access, the patient summary (PS-CA) and eReferral/eConsult, with FHIR and conformance testing. CA Core+ is the national core FHIR profile set, with v1.2.x DFT published in 2026. We build on it rather than invent profiles. | [Infoway Roadmap](https://www.infoway-inforoute.ca/en/component/edocman/resources/interoperability/6444-connecting-you-to-modern-health-care-shared-pan-canadian-interoperability-roadmap); [Path to Connected Care](https://connectedcare.infoway-inforoute.ca/); [CA Core+](https://simplifier.net/guide/CA-Core/Index/Technical-Context?version=current); [package versions](https://packages2.fhir.org/packages/ca.infoway.io.core) |
| **Connected Care for Canadians Act (Bill S-5)** | It would require health IT interoperability and prohibit data blocking by vendors. It passed the Senate on 26 May 2026, and **as of 24 Nov 2026 it is at second reading in the House of Commons** (last debated 5 Nov 2026). **Not law.** | [LEGISinfo S-5](https://www.parl.ca/LEGISInfo/en/bill/45-1/s-5) |

**Lesson from the precedents.** Open formats were necessary but not enough on their own. The successes combined (1) an open spec, (2) free test tools, (3) a trust framework with legal agreements, and (4) a reason to adopt, either patient demand, network value or a mandate. OpenChart plans all four.

**What is missing in Canada today.** As far as our research found, no vendor-neutral, patient-consented protocol moves full charts between private-practice systems across disciplines. Dental, physio, chiro and optometry PMSs sit outside the provincial programmes built for physician EMRs and hospitals. That is the gap.

---

## 3. Benefits by group

### Patients
- **One signature instead of phone calls, forms and pickups.** The patient signs on their phone. They do not carry CDs or chase offices.
- **Care isn't delayed.** A dentist planning an implant or a surgical extraction can get the medication list and medical history with the same signature, instead of waiting on faxes.
- **Fewer repeat X-rays and tests**, because prior imaging arrives at diagnostic quality.
- **Control and visibility.** Patients see who holds their records, who asked, what was sent and when. They can untick items or withdraw.
- **Their right of access becomes practical.** Patients can request their own copy into the app.
- **Free for patients.** The network never charges patients. Any release fee is the office's own legally reasonable fee, shown before signing.

### Providers (dental, medical, pharmacy, physio, chiro, optometry, specialists)
- **Admin time back.** Requests and releases become a click and a tap. In our founder's experience as a practising dentist, a transfer takes roughly 20 to 30 minutes of admin across both offices today. That is an observation, not a study; pilots will measure it.
- **Complete referrals.** Reason, images, alerts and history arrive together, and consult notes come back the same way.
- **Automatic documentation.** The release log (date, recipient, items, method) is written for College recordkeeping expectations.
- **Lower risk.** No misdirected faxes or unencrypted USB sticks, verified recipients only, and a full audit trail.
- **No lock-in.** Offices keep their own PMS. If CareCircle disappeared, the open spec and self-hostable code mean another operator could run the network.

### Software vendors (PMS, EMR, pharmacy, imaging)
- **One integration instead of dozens.** Build to one spec and reach every other conformant system.
- **A free spec, free SDKs and a free test suite** lower the cost of interoperability.
- **Ready for regulation.** If Bill S-5 or provincial rules require interoperability and ban data blocking, an implemented open protocol is an easy way to show compliance. That is not guaranteed, and it depends on future regulations.
- **A selling point.** "Switch to us and your patients' records arrive in one click."
- **Neutral governance.** The spec is not controlled by one competitor (see [06-governance-and-licensing](06-governance-and-licensing.md)).

### Payers and insurers
- Fewer duplicated diagnostics and images.
- Better documentation for pre-authorisation, with the patient's consent and only when the patient directs it. Payer access is **not** in the MVP and would need its own consent scope and legal review.

### Governments and health systems
- A **ready-made, standards-based protocol** for private-practice disciplines that provincial systems don't cover today.
- **Aligned with Infoway's roadmap** (patient access, eReferral, CA Core+) and with the direction of Bill S-5.
- **Can be referenced in policy or procurement** because nobody owns it.
- **Patient-consent-first design** fits Canadian privacy law.

### The whole industry
- **A shared foundation, with competition on top.** Vendors compete on features, not on hoarding data.
- **A shared trust layer**: verified directory, signed messages, common consent.
- **Faster innovation.** Apps such as referral tracking, pre-op medication checks and patient timelines can be built on top of the protocol.

---

## 4. Risks of going open, and mitigations

| Risk | Mitigation |
|---|---|
| A competitor runs a rival hub on our spec | Acceptable, even good, because it proves the standard. Hubs must interconnect (federation rule in [01-protocol](01-protocol.md) section 7). CareCircle competes on trust, directory quality, uptime, support and apps. |
| A large vendor forks the spec and fragments it | The spec is CC BY 4.0. Forks must be labelled as derivatives, and the "Certified" mark only applies to the canonical spec. Neutral governance gives big vendors a seat so they don't need to fork. |
| Security flaws are visible in public code | Openness enables review. Mitigate with a coordinated disclosure policy, a bug bounty later (needs spend approval), signed releases and dependency scanning. Security comes from keys and process, not from secrecy. |
| Low-quality implementations hurt patient safety | Conformance levels, a free test suite, a certification programme for production network access, receive-side quarantine and clinician verification of clinical data. |
| Patent claims by third parties | Contributor licence terms with a patent grant (Apache-2.0 for code, a royalty-free patent pledge for the spec). Legal review before publishing. |
| CareCircle loses its business moat | The moat is the network, the trusted directory and the brand, not the format. See section 5. |
| Regulators see a for-profit company "owning" a standard | Commit up front to move the spec to a neutral body (a foundation, or HL7 Canada / Infoway) once it is stable. See [06-governance-and-licensing](06-governance-and-licensing.md). |
| Free-riding (everyone uses, nobody funds) | Paid hosted network, paid certification for large vendors, sponsorships, later grants. Free tiers stay free for small offices and small vendors. |
