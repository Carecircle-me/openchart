# FAQ

Draft 24 Nov 2026. Plain answers for dentists and other clinicians, vendors and patients. OpenChart is not live yet. Answers describe the plan.

---

## For dentists and other providers

**What does it cost my office?**
The protocol, the spec, the reference code and the sandbox are free and open source. Anyone can implement PDRE without paying anyone. Hosted network operators set their own terms.

**Do I need to change my PMS or EMR?**
No. If your software supports OpenChart (implements PDRE), the buttons appear inside it. If not, you use the web app next to it, or a small connector for desktop systems.

**Does anything get released automatically?**
No. Someone at your office always reviews and taps **Release**. You can untick items or decline with a reason.

**How do I know the request is genuine?**
Every office on the network is verified against its college's public register. Every request carries the patient's signed consent, verified with a code sent to the phone or email *you* already have on file plus a date-of-birth match, or with a fallback that needs your staff to confirm.

**Does this satisfy my College's recordkeeping rules?**
It's designed to. The release log (date, recipient, items, method) is written into the chart automatically, and the signed consent is kept. We'll confirm with each college, starting with the RCDSO, that e-signatures and the log meet their expectations before launch.

**What about patients who asked us to restrict some information (lock-box)?**
Restricted items are never in the default bundle. If something is withheld, the receiving office is told "some information has been withheld at the patient's direction," without saying what, as PHIPA expects.

**Can I still charge a records fee?**
Yes, if it's lawful reasonable cost recovery. The estimate is shown to the patient before they sign. You can waive it.

**What if the records go to the wrong patient file?**
Incoming records sit in a review queue until staff confirm the match. A mistaken send can be recalled before import, and a runbook covers incidents.

**Will incoming allergies and medications overwrite my chart?**
No. They arrive marked "external, needs verification" until a clinician confirms them.

**Does it work with pharmacies and family doctors?**
That's planned after the dental network works. One patient signature can request your previous dentist's records, the pharmacy's medication list and the family doctor's summary together, which helps before implants or extractions. For physician referrals we plan to work with Ontario's existing eReferral system rather than replace it.

**Is patient data stored by CareCircle?**
Only in transit, encrypted end to end so the hub can't read it, and deleted after delivery plus a short retry window. Audit logs keep metadata, not clinical content. Hosting is in Canada.

---

## For software vendors

**Is the protocol really free to implement?**
Yes. That is the plan: spec under CC BY 4.0, FHIR artifacts under CC0, code under Apache-2.0, and a royalty-free patent pledge from contributors. Using the "OpenChart Certified" mark requires certification.

**Do we have to use CareCircle's hub?**
No. You can peer directly, or use any certified hub. Certified hubs must federate, so the network doesn't split.

**What standards is it built on?**
HL7 FHIR R4, CA Core+ and PS-CA in Canada, the HL7 Dental Data Exchange IG for dental, DICOM for imaging, SMART Backend Services and UDAP-style trust for security.

**We're a Windows desktop PMS with no API. Can we join?**
Yes. Use the .NET SDK, or the desktop bridge that runs as an outbound-only service at the office. No screen scraping.

**What's the minimum integration?**
Level L1: receive bundles into your document centre. Level L2 adds the request button and release inbox. See the conformance levels in [01-protocol](01-protocol.md).

**How much does certification cost?**
Certification terms are not set yet and will be published before the programme opens. Implementing the protocol never requires certification. Certification is about protocol conformance. It is not a privacy or security compliance certificate.

**Does CareCircle PMS get an advantage?**
No. It goes through the same tests, gets no private APIs, and gets no special directory placement ([06-governance-and-licensing](06-governance-and-licensing.md) section 5).

**Will this help with Bill S-5?**
Possibly. Bill S-5 would require interoperability and ban data blocking, but as of 24 Nov 2026 it's still before the House of Commons and its details depend on future regulations. We can't promise PDRE will satisfy it.

---

## For patients

**Do I need the app?**
No. You can sign from a text or email link. The app adds a list of who has your records, history, and quick sharing.

**Does it cost me anything?**
The network is free for patients. A provider may charge a lawful records fee, and you'll see the estimate before you sign.

**Can I choose what's shared?**
Yes. You can untick items, decline, or withdraw your consent before release.

**Can I see where my records went?**
Yes. Every request, signature, release and delivery about you is in your activity history.

**Can my family help?**
Yes. Parents, substitute decision-makers and caregivers can act for you with recorded permission, which you can revoke.

**Does anyone sell or advertise with my data?**
No. No ads, no data sales, and no use of your records for AI training.

**Can CareCircle look up which doctors I've seen?**
No. The network never searches providers for you. Requests only go to providers you name.

**What if I withdraw consent after records were sent?**
Withdrawal stops anything pending and future sharing. It can't pull back a copy already in the new provider's chart. That provider is now responsible for it under privacy law.
