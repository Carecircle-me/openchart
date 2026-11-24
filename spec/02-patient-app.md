# Patient app

Draft 24 Nov 2026. The patient app is the patient's remote control for their own records. It is **optional**: every flow also works through a one-time text or email link with no download, so nobody is excluded.

An open-source **OpenChart reference patient app** (iOS, Android, and web as a progressive web app) ships with the spec. Hub operators can offer their own branded app; CareCircle's is part of CareCircle Link.

---

## 1. Principles
- **The patient is in control.** Nothing moves without their signature. Every movement is visible to them.
- **Free, with no ads, no data sale, no tracking SDKs** and no secondary use of their data. This is written into the terms and checked in code review: no third-party analytics SDKs in the app bundle.
- **Minimum data on the device and in the cloud.** The app shows *where* records are and *what moved*. It holds a full chart copy only when the patient asks for their own copy, encrypted on the device.
- **Works for everyone:** accessible, multilingual, low-bandwidth, and usable by a caregiver.

---

## 2. Features

| Feature | What it does |
|---|---|
| **Consent inbox** | Every pending request in one place: who is asking, from whom, what (preset in plain words), why, until when, and any fee estimate |
| **One-tap sign** | Verify (OTP and DOB the first time; passkey or Face ID after binding), review, untick anything, sign. A signed PDF copy is saved. |
| **Decline or edit** | Decline a request, or narrow it (for example "X-rays only") |
| **Who has my records** | A list the patient builds and controls: past dentists, family doctor, pharmacy, physio, and so on. It is filled from completed transfers and manual adds. It is **never** built by searching providers. |
| **Request my own records** | Right-of-access request to any listed provider; the copy arrives encrypted in the app |
| **Share to a new provider (QR)** | At a new office: tap Share, pick previous provider(s) and a preset, then scan the office's QR code or show the patient's own. This creates a pre-consented request, and the holder still approves. |
| **Revoke** | Withdraw any active consent with one tap. Pending releases stop, and receivers are notified. |
| **Activity and audit history** | Timeline of every request, consent, release, delivery and import about them, from the immutable audit |
| **Receipts** | "Sample Family Dentistry sent 14 items to Example Dental on 24 Nov 2026 at 2:03 PM" |
| **Family and caregiver delegation** | Parents of minors, substitute decision-makers and caregivers act on someone's behalf with recorded authority. Delegation is time-limited and revocable, and every action is labelled with who acted. |
| **Multi-provider requests** | One screen to approve dental + pharmacy + family doctor requests together (for example before surgery) |
| **Notifications** | Push, SMS or email, as the patient chooses. Messages never contain clinical details, only "You have a records request from Example Dental." |
| **Lock-box controls** | Ask a provider to restrict specific information. The app sends the instruction; the provider applies it. |
| **Data export** | Download their own records (FHIR JSON, PDF, images) to share however they like |
| **Delete account** | Deletes the app account and on-device data. Audit records held by custodians and the network stay as the law requires, and the patient is told this plainly. |

---

## 3. Key screens

1. **Welcome / verify.** Phone number → OTP → name and DOB. No password; set up a passkey or biometric unlock.
2. **Home.** Cards: "1 request waiting", "Records moved this year: 3", "My providers".
3. **Request detail.** Example: "Example Dental (London ON, verified) asks Sample Family Dentistry (Ajax ON) for your dental records so they can continue your care." Plain list of items with toggles, a fee line ("No fee" or "$X estimate from Sample Family Dentistry"), and an expiry date. Buttons: **Sign and send**, **Change what's shared**, **Decline**.
4. **Signed.** "Done. Sample Family Dentistry will review and send. We'll tell you when it arrives." Progress tracker: Signed → Approved → Sent → Received.
5. **My providers.** A list with "Request my copy" and "Share with…" actions.
6. **Share (QR).** Pick providers → pick what → show/scan QR → confirm.
7. **Activity.** Filterable timeline.
8. **Family.** People I manage, and people who manage me.
9. **Settings.** Language, notifications, accessibility, privacy, export, delete.

All consent text has two layers: **plain summary first**, and the full legal text one tap away.

---

## 4. Accessibility and language
- Target WCAG 2.2 AA (and AODA alignment in Ontario). Screen-reader labels, dynamic type, high contrast, no colour-only meaning, large touch targets, and no time-outs during signing beyond the security minimum.
- Plain language aimed at a broad reading level, tested with real patients in the pilot.
- Languages: English and French at launch, as required for national credibility. Then add by demand, for example Punjabi, Gujarati, Hindi, Mandarin, Cantonese, Arabic, Tagalog, Spanish, Tamil, Urdu, Farsi and Portuguese. **Professional or reviewed translation only** for consent text, never raw machine output.
- Assisted mode: front-desk staff can help a patient sign on an office tablet after an ID check (path C in [01-protocol](01-protocol.md) section 10).

---

## 5. Security
- Passkeys (WebAuthn) or OTP plus device binding. Biometric unlock for repeat use. No SMS-only login for high-risk actions after binding.
- On-device data encrypted with keys in the Secure Enclave (iOS) or StrongBox/Keystore (Android). The patient's own record copies are encrypted end-to-end to the device key.
- Certificate pinning to the hub, jailbreak/root signals as a risk input (not a hard block), and screenshot protection on record views (optional and patient-controllable).
- Session timeouts, re-auth before signing or revoking, and rate limits on OTP.
- No third-party analytics, ad or tracking SDKs. Crash reporting only with PHI scrubbing and opt-in.
- Delegate accounts are separate identities. A delegate never logs in "as" the patient.

---

## 6. Delegation rules (need legal review per province)

| Situation | Who can act | Evidence |
|---|---|---|
| Child under the provincial capacity threshold | Parent or guardian | Attestation + provider confirmation on file |
| Capable minor | The minor. Parents do not automatically get access. | Provider's capacity judgement |
| Substitute decision-maker | SDM per provincial law (for example Ontario's Health Care Consent Act hierarchy) | Attestation, document upload, provider confirmation |
| Caregiver helping a capable adult | Delegate with the patient's grant | Grant recorded in-app, revocable |
| Deceased patient | Estate trustee | Document upload, provider confirmation |

---

## 7. What the app will never do
- Show ads, sell or share data, or train AI models on patient data.
- Search providers for the patient's records without the patient naming them.
- Release anything by itself. The holding provider always approves.
- Include clinical details in notifications.
