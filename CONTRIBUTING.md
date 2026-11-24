# Contributing

Thanks for helping build an open way for patients to move their health records. Contributions from clinicians, office staff, PMS/EMR vendors, developers, privacy and security people, and patients are all welcome.

## Ground rules

- **Synthetic data only.** Never put real patient data, real personal information, secrets, API keys or credentials in issues, pull requests, commits, examples or logs.
- Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Report security problems privately. See [SECURITY.md](SECURITY.md).

## Developer Certificate of Origin (DCO)

We use the [Developer Certificate of Origin 1.1](https://developercertificate.org/) instead of a CLA. Every commit must be signed off:

```
git commit -s -m "Explain the change"
```

This adds a line like `Signed-off-by: Your Name <you@example.com>`, which certifies that you wrote the change or have the right to submit it under the project's licences.

By contributing you agree that:
- code contributions are licensed under [Apache-2.0](LICENSE);
- specification text contributions are licensed under [CC BY 4.0](LICENSE-SPEC);
- FHIR examples and conformance artifacts are dedicated under CC0 1.0;
- specification contributions are covered by the royalty-free commitment in [PATENTS.md](PATENTS.md).

## How to propose a change

**Code, docs, typos:** open a pull request. Keep it small and focused. Run `cd reference && npm test` first.

**Spec changes** (messages, profiles, consent, identity, trust, audit):
1. Open an issue describing the problem.
2. Write a short RFC in the issue or as a PR: problem, proposal, FHIR impact, privacy impact, backward compatibility.
3. Public comment for 30 days (14 days for minor changes).
4. Maintainers decide, recording the reasons, and merge into the next draft.

Any change that touches consent, patient identity, matching or data scope needs a privacy and safety review comment before merge.

## Development

Requires Node.js 22.18 or later (TypeScript runs natively, no build step and no dependencies).

```
cd reference
npm test       # run the test suite
npm run demo   # walk through the one-click flow with synthetic data
npm start      # run the mock hub on http://127.0.0.1:8787
```
