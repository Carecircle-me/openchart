# Security policy

OpenChart (the PDRE specification and reference code) is **experimental (v0.1)**. Expect vulnerabilities. Please help us find them.

## Reporting a vulnerability

Please report security issues **privately**. Do not open a public issue for a vulnerability.

- Email: **security@carecircle.me**
- Or use GitHub's private vulnerability reporting on this repository (Security tab, "Report a vulnerability"), if enabled.

Please include:
- what is affected (spec section, file, endpoint or version);
- steps to reproduce, or a proof of concept using **synthetic data only**;
- the impact you expect.

Never include real patient data or real personal information in a report.

## What to expect

- We aim to acknowledge reports within 5 business days.
- We will work with you on a fix and a disclosure date. Our default is coordinated disclosure within 90 days.
- We will credit you in the release notes unless you prefer not to be named.

These are goals, not guarantees. There is no bug bounty at this time.

## Scope

In scope: the specification (design flaws in consent, identity, matching, trust or audit), the OpenAPI description, and the reference code in this repository.

Out of scope: third-party implementations and deployments; social engineering; denial-of-service against infrastructure you don't own.

## Safe harbour

We will not pursue legal action against good-faith research that follows this policy, uses only synthetic data and your own test instances, and does not access, modify or keep data that isn't yours.

## Supported versions

Only the latest commit on the default branch is supported while the project is at v0.x.
