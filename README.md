# All Together

The All Together public site and private LP staging portal.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## LP staging portal

The navbar exposes `LP Login`, which leads to a password-gated staging portal. Configure it with server-only environment variables:

```bash
LP_PORTAL_PASSWORD="a-long-staging-password"
LP_SESSION_SECRET="a-random-secret-at-least-32-bytes-long"
```

The portal uses signed, eight-hour, HTTP-only sessions; no password or Drive identifier is sent to the browser. Staging data comes from an approved snapshot of the private Drive Schedule of Investments. The snapshot intentionally excludes current fair value, NAV, IRR, and LP capital accounts until an administrator-backed valuation process supplies those figures.

Run the checks with:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm exec playwright test --config=playwright.lp.config.ts
```

See [docs/LP_PORTAL.md](docs/LP_PORTAL.md) for the security boundary and Drive publication workflow.

## Production

The shared staging password is not production LP authentication. Production requires individual identities, MFA/passkeys, vehicle-level entitlements, an external rate-limit store, audit logs, and reconciliation to administrator statements before financial reporting is enabled.
