# LP portal staging architecture

## Current staging boundary

- `/lp-login` accepts a server-side staging password.
- A successful login creates a signed, eight-hour, HTTP-only, same-site session cookie.
- `/lp` is denied optimistically by the Next proxy and authoritatively by the server layout.
- Portal responses are private, `no-store`, and `noindex`.
- Google Drive file and spreadsheet IDs remain server-only and are removed from the DTO passed to client-facing views.
- Login attempts are rate-limited per forwarded IP in staging.

The portfolio currently renders an approved snapshot of the private Google Drive Schedule of Investments. It includes 44 recorded investments, source dates, cost, round, instrument, platform, entry valuation, review status, and matched public-site logos. It does not claim continuously changing private-company value.

## Approval-safe Drive update workflow

The scheduled automation should treat AI extraction as candidate creation, not as accounting approval:

1. A restricted Google service account reads only the All Together investment folder, Schedule of Investments, and bank-reconciliation inputs.
2. A daily job detects changed rows and newly added investment folders.
3. The extractor maps source fields, links closing documents, and flags missing or anomalous values.
4. Bank activity is used to reconcile expected cash, refunds, and partial allocations; a wire alone never marks an investment closed.
5. Two authorized reviewers approve or reject the candidate record.
6. The job writes a versioned, immutable publication snapshot consumed by the portal.
7. Every published number retains `source modified`, `approved at`, `published at`, and status metadata.

This design prevents an accidental Sheet edit or document-extraction error from becoming an LP-visible financial fact.

## What is needed to enable scheduled ingestion

- A Google Cloud service account or restricted OAuth client shared into the All Together Drive with read-only access.
- A durable publication store (Postgres or administrator data warehouse) for versioned snapshots and audit history.
- A scheduler invoking the ingest job daily and on administrator webhooks where available.
- Operations and second-approver identities for the exception queue.

The current Codex Google Drive connector is an operator session and must not be copied into Vercel. Until the restricted deployment credential and approval store exist, updates should be regenerated from Drive into staging and reviewed before release.

## Production authentication requirements

Before exposing LP-specific statements or documents, replace the shared staging password with invite-only individual accounts, MFA or passkeys, organization and vehicle membership, short-lived signed document URLs, durable rate limiting, append-only access logs, and administrator-backed capital-account entitlements.
