# Disclaimer

**Please read this before using anything in this repository.**

## Experimental software and draft specification

OpenChart, including the PDRE (Patient-Directed Record Exchange) protocol specification, the reference code, the OpenAPI description, the examples and all documentation in this repository (together, the "Materials") are an **experimental v0.1 draft**. They are incomplete, untested in real clinical settings, and may contain bugs, security vulnerabilities, errors and omissions. They can change at any time without notice.

## Provided "AS IS", with no warranty

THE MATERIALS ARE PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OR CONDITION OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, SECURITY, AVAILABILITY OR COMPLIANCE WITH ANY LAW OR STANDARD.

## No liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL CARECIRCLE CONNECT INC., ITS DIRECTORS, OFFICERS, EMPLOYEES, CONTRACTORS, AFFILIATES, OR ANY CONTRIBUTOR TO THIS PROJECT BE LIABLE FOR ANY CLAIM, LOSS OR DAMAGES OF ANY KIND, WHETHER DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE, INCLUDING LOSS OF DATA, PRIVACY BREACHES, SECURITY INCIDENTS, REGULATORY PENALTIES, CLINICAL HARM, BUSINESS INTERRUPTION OR LOST PROFITS, ARISING OUT OF OR IN CONNECTION WITH THE MATERIALS OR THEIR USE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOU USE THE MATERIALS ENTIRELY AT YOUR OWN RISK.

The code licence ([LICENSE](LICENSE), Apache-2.0, sections 7 and 8) and the specification licence ([LICENSE-SPEC](LICENSE-SPEC), CC BY 4.0, section 5) contain their own disclaimers of warranty and limitations of liability, which also apply.

## Not certified. Not a medical device. Not clinical advice.

- The Materials are **not certified** by any standards body, regulator or government, and no compliance certification of any kind is claimed (including PHIPA, PIPEDA, HIPAA, SOC 2, ISO 27001 or any other).
- The Materials are **not a medical device** and are not intended to diagnose, treat, cure or prevent any disease or to support clinical decisions.
- Nothing in this repository is legal, privacy, security, clinical or regulatory advice.
- Mention of HL7®, FHIR®, Medplum or any other third-party standard or product does not mean they endorse this project.

## You are responsible for your own use

If you implement, deploy, modify or operate anything based on the Materials, **you alone are responsible** for:
- complying with every law that applies to you, including health privacy law (for example Ontario's PHIPA, PIPEDA, other provincial health information laws, and HIPAA in the United States);
- your own security design, testing, penetration testing, risk assessments, privacy impact assessments, agreements with custodians and patients, breach response and insurance;
- verifying any clinical information you receive before relying on it.

## Sandbox: synthetic data only

The reference mock hub, the examples and any sandbox are for **synthetic (fake) data only**. **Do not put real patient data, real personal health information or real personal information into the sandbox, the examples, issues, pull requests or anywhere in this repository.** The mock hub has no real encryption, no real authentication and fixed test codes, by design.

## Hosted services, including CareCircle Link

OpenChart is an open-source project, not a service. CareCircle Connect Inc. does not operate a production network for this protocol as of this release. Any hosted service built on OpenChart, including CareCircle Link, will be offered under its own separate terms, which will govern that service.
