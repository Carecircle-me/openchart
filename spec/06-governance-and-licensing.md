# Governance and licensing

Draft 24 Nov 2026. This is the governance and licensing model for the project. It is not legal advice. The repository files [LICENSE](../LICENSE), [LICENSE-SPEC](../LICENSE-SPEC), [PATENTS.md](../PATENTS.md), [TRADEMARKS.md](../TRADEMARKS.md) and [GOVERNANCE.md](../GOVERNANCE.md) are the operative texts.

---

## 1. What gets which licence

| Asset | Recommended licence | Why |
|---|---|---|
| **Spec prose** (this protocol document, presets, guides) | **CC BY 4.0** | Anyone may copy, adapt and redistribute with attribution. Easy for vendors and governments to reference and embed. |
| **FHIR conformance artifacts** (StructureDefinitions, ValueSets, CodeSystems we author, CapabilityStatements, examples) | **CC0 1.0** | Vendors can paste profiles and examples into products with no attribution friction. This follows common FHIR IG practice. Third-party terminologies (SNOMED CT, LOINC, CDA codes) keep their own licences and are **not** relicensed. |
| **Reference code** (hub, SDKs, bridge, web app, patient app, conformance suite) | **Apache License 2.0** | Permissive and business-friendly, with an **explicit patent grant** and patent-retaliation clause. Widely accepted by hospital and vendor legal teams. |
| **Patent pledge for the spec** | **Royalty-free patent commitment.** Recommended: the **Open Web Foundation Final Specification Agreement (OWFa 1.0)**, or a W3C-style royalty-free commitment signed by CareCircle and all spec contributors | Apache-2.0 covers code but not independent implementations of the spec. A pledge assures vendors that implementing PDRE won't draw patent claims from contributors. |
| **Names and logos** | **Trademark policy** (section 3) | Open spec, but protected names, so "Certified" means something |

Considered and rejected:
- **AGPL/GPL for code.** Copyleft would scare off PMS vendors who want to embed the SDK in closed products, and slow adoption.
- **A source-available or "open core" spec.** Vendors won't build to a spec that the owner can restrict later.
- **Keeping the spec proprietary and licensing it per vendor.** This defeats the goal of every vendor using one protocol.

---

## 2. Contribution process
- **DCO (Developer Certificate of Origin)** sign-off on every commit (`Signed-off-by:`). It is lighter than a CLA and works with Apache-2.0's inbound=outbound model.
- Spec contributors also sign the **patent pledge**, as an individual or for their organisation.
- **RFC process** for spec changes: open an issue → write an RFC (problem, proposal, FHIR impact, privacy impact, backward compatibility) → 30-day public comment (14 days for minor changes) → work group decision → merge into the next version.
- **Privacy and safety review** is required for any change touching consent, identity, matching or data scope.
- Code: pull requests with review by two maintainers, CI (tests, conformance suite, lint, security scans), and signed releases.
- See [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md), [SECURITY.md](../SECURITY.md) and [GOVERNANCE.md](../GOVERNANCE.md).

---

## 3. Trademark policy (summary)

| Mark | Owner | Use |
|---|---|---|
| **OpenChart** | CareCircle Connect Inc. | The name of the open-source project, repo, site and community. Anyone may say their product "works with OpenChart" or "implements PDRE" when true. |
| **OpenChart Certified** (certification mark) | CareCircle Connect Inc. | Only for products that pass certification at a stated level and discipline, with a current listing |
| **CareCircle Link** | CareCircle Connect Inc. | CareCircle's own hosted network and apps built on OpenChart. One operator among any number. |
| **PDRE** (technical protocol name) | Held by CareCircle **in trust**, with a public commitment to transfer it to the neutral governing body | Anyone implementing the spec may say "implements PDRE 1.x". Forks must use a different name. |

Notes:
- Write "OpenChart" as one word with a capital O and C. Names may change if a conflict comes to light. See [NAMING.md](../NAMING.md).
- Keep HL7 trademark rules: say "HL7® FHIR® standard", and never imply HL7 endorsement ([HL7 FHIR licence](https://hl7.org/fhir/R4/license.html)).

---

## 4. Governance model: phases

### Phase A. Founder-led, open by default (now to first public release)
- CareCircle Connect Inc. is the steward and maintainer.
- Spec repo and drafts are public.
- An **advisory group** is invited: 2 to 3 practising clinicians from different disciplines, 1 to 2 PMS vendors, a privacy expert and a patient representative. The group is unpaid at first; any honoraria need approval.
- A **public commitment** in GOVERNANCE.md: the spec will move to neutral governance once it has two or more independent implementations.

### Phase B. Steering committee (after the pilot, 2+ vendors implementing)
- **PDRE Steering Committee** with a charter: seats for vendors (rotating, with no single company holding a majority), clinicians (by discipline), patient representatives, privacy/security and hub operators. CareCircle holds a seat but **not a veto**.
- Work groups: Core protocol, Dental, Medical and pharmacy, Allied health (physio, chiro, optometry), Security and trust, Patient experience.
- Decisions by lazy consensus, with a two-thirds vote fallback. Meeting notes are public.

### Phase C. Neutral home (when adoption justifies it)
Options, to be chosen with the steering committee:
1. **A Canadian not-for-profit foundation** (for example "PDRE Foundation") holding the spec, the neutral name and the certification mark, with CareCircle as a founding member.
2. **Hand the spec to an established standards body**: publish PDRE as an FHIR Implementation Guide through **HL7 International** (ballot) and/or through **Canada Health Infoway**'s pan-Canadian standards processes alongside CA Core+ and PS-CA ([Infoway standards](https://www.infoway-inforoute.ca/en/what-we-do/connected-care/digital-health-standards)). How Infoway and Canada's HL7 affiliate would take on a new IG is to be confirmed with them.
3. **An existing open-source foundation** (for example the Linux Foundation family) for the code, with the spec at HL7/Infoway.

The likely end state: the **spec goes to HL7/Infoway**, the **code and certification sit with a neutral foundation**, and **CareCircle runs the leading hosted network** as one of several certified hub operators.

---

## 5. Conflict-of-interest safeguards (because CareCircle also sells products)
- CareCircle PMS gets **no** privileged API, early spec access, or certification shortcuts. It goes through the same tests.
- The directory ranking is neutral (alphabetical or distance), and there is **no paid placement**.
- Other certified hubs must be able to federate on equal terms.
- Steering committee decisions on spec changes that benefit CareCircle products need a vote of non-CareCircle members.
- Every operator, including CareCircle, publishes an annual transparency report: uptime, incidents, requests served, government data requests.
