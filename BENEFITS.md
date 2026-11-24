# Who benefits, and how

OpenChart is a free, open-source project for moving patient records, powered by the PDRE (Patient-Directed Record Exchange) protocol. It lets a new office get a patient's records from the previous office in a few taps: the new office requests, the patient signs on their phone, the previous office releases, and the records arrive. Here is what that means for each group.

There are no invented numbers on this page. Today a records transfer means admin on both ends: phone calls, consent forms, scanning, faxing or emailing, and chasing. The goal is to bring that down to seconds of staff time. Pilots will measure the real difference.

> v0.1 is an experimental draft with a sandbox that uses synthetic data only. Some benefits below depend on features that are planned, not built. See [DISCLAIMER.md](DISCLAIMER.md).

---

## For software vendors and existing PMS/EMR providers (cloud and desktop)

**It's free, and it stays free**
- No royalty, no per-transfer fee and no licence fee to implement the protocol.
- Code and toolkits are **Apache-2.0**, so you can use them inside closed, commercial products without opening your own code.
- The spec is **CC BY 4.0**: copy it, quote it and embed it in your docs.
- A **royalty-free patent pledge** ([PATENTS.md](PATENTS.md)) means implementing the spec won't draw patent claims from us or other contributors.
- You never have to use any CareCircle product or service to implement it.

**Very little code to change**
- Built on **HL7 FHIR R4**, the healthcare data standard you may already support, plus CA Core+ and the HL7 Dental Data Exchange guide. No new data format to learn.
- Plain HTTPS and JSON, so it works from any language and any platform: cloud, on-premise server or Windows desktop.
- Toolkits (TypeScript first; C#/.NET, Java and Python planned) and a machine-readable OpenAPI description you can generate clients from.
- For older desktop systems, a planned **drop-in bridge** that runs next to your software and speaks the protocol for you.
- A planned ready-made **"Request records" button** and **"Approve release" inbox** you can embed instead of building screens from scratch.
- A free sandbox with synthetic patients and an open conformance test suite.

**One connection instead of many**
- Implement once and exchange with every other system that implements it.
- No more custom point-to-point integrations, one-off export formats or "send us a CSV" projects for each competitor or partner.

**Win and keep customers**
- Offices increasingly want records to move easily. Supporting an open protocol answers that demand.
- **Winning new customers gets easier.** The biggest fear when an office switches software is losing patient history. With OpenChart, records can come in from the previous system, so moving to your product is less painful.
- Keep existing customers happy: their staff stop faxing, scanning and chasing.
- Your product stays the place where the work happens. The protocol moves records; it doesn't replace your PMS.

**Credibility you can sell**
- Once the certification programme opens, products that pass the open tests can show the **"OpenChart Certified"** badge, a clear signal to buyers that the integration really works.
- Implementing an open, FHIR-based standard positions you well as governments push for interoperability.

**A real say in where it goes**
- Open RFC process, public comment and, once there are two or more independent implementations, a steering committee with vendor seats and no CareCircle veto ([GOVERNANCE.md](GOVERNANCE.md)).
- Equal treatment: CareCircle's own products get no private APIs, early access or shortcuts.

---

## For health offices (any field)

**Less admin on both ends**
- Requesting records: pick the previous office from a verified directory and click **Request records**. No phone calls, no faxed consent forms.
- Sending records: review what will go and tap **Release**. No printing, scanning, burning CDs or emailing large files.
- The aim is seconds of staff time instead of calls, faxes and chasing.

**Records arrive ready to use**
- Allergies, medications, conditions, treatment history, care and treatment plans, images and documents arrive in a structured format, into a review queue, not as a pile of PDFs.
- Clinical items arrive marked "external, needs verification" until a clinician confirms them, so nothing slips into the chart unchecked.

**You stay in control**
- Every release is a human decision by your team. Nothing is released automatically.
- The patient's signed consent comes with every request, naming who gets what, why and until when.
- Requests only reach offices the patient names. There is no broadcast patient search.
- A full audit trail: who asked, who signed, who released, when and what.
- A release note is written into the chart.

**Works with what you have**
- If your PMS supports the protocol, it's built in. If it's an older desktop system, the planned bridge can connect it. If your software doesn't support it yet, a planned web app lets you send and receive anyway.
- One protocol across fields: family doctors, specialists, hospitals, pharmacies, dental, physio, chiro, optometry, mental health and more.

**Better care, faster**
- New patients can start treatment sooner because history, images and test results arrive before or at the first visit.
- Specialist referrals and consult notes can go back and forth the same way.
- Designed with privacy in mind: patient-signed consent, encrypted delivery, minimum data and full logging.

---

## For patients

**Your records follow you**
- Moving cities, switching clinics or seeing a specialist? Your new office asks, you tap **Sign**, and your records move. No forms to carry, no faxes to chase.
- No app needed: you can sign from a text or email link. A patient app is planned for those who want it.

**Nothing moves without you**
- Your signed consent is required for every transfer.
- You see exactly who is asking, what they want, why and until when, before you sign.
- You can untick items you don't want shared. The new office is told only that something was withheld at your direction, never what.
- You can change your mind and withdraw before the records are released.

**Safer care**
- Your new doctor, dentist, pharmacist or therapist sees your allergies, medications and history sooner, so you repeat less and avoid duplicate tests and X-rays where possible.
- Faster referrals and less waiting for paperwork.

**You can see what happened**
- A receipt for every transfer: who sent what, to whom and when.
- Your identity is checked with a one-time code sent to the contact your previous office already has on file, plus your date of birth.

**Free for patients**
- The protocol is free and open source. Signing and moving your records through the protocol costs you nothing. (An office may still charge a lawful records fee; if so, you see the estimate before you sign.)
