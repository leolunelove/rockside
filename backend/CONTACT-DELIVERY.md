# Rockside contact delivery

The compact full-screen contact form sends email through an isolated `rockside-contact` Edge Function in the existing mail-enabled Supabase project. Existing project functions were not changed. The frontend remains on GitHub Pages.

## Private configuration

The fixed destination and verified sender live in `rockside_private.mail_settings`, not browser assets or repository files. RLS is enabled. Anonymous and authenticated visitors have no table access or permission to execute the configuration RPC. Only the server role can read it. The Resend API key stays in the existing server environment. The publishable application key in the client is intentionally public and cannot retrieve the settings.

Change the recipient privately through the database using an authorised server/admin session. Do not add the address to the migration or public source.

## Delivery and abuse controls

The endpoint validates the application key, exact Origin allowlist, method, JSON byte size, honeypot, request UUID, interest and all input limits. Destination and sender cannot be chosen by visitors. The visitor address is Reply-To, never From.

A transaction-locked reservation limits new requests to three per hour for the same hashed email/IP and fifty per day globally. The private metadata table contains IDs, salted hashes and timestamps; it does not store message bodies, names, raw email addresses or raw IPs. Metadata older than 24 hours is pruned on the next request. The same UUID with the same fingerprint is allowed as a retry; changed content with the same UUID is rejected. Resend also receives the same idempotency key on retries, preventing duplicate emails within its cache window.

The client disables submission while pending, uses a 25-second timeout, retains drafts on failure and reuses the ID for unchanged retries. On success it shows a sent state and offers Write another message. Closing the view does not abort an already submitted message. Keyboard focus, native scrolling and reduced-motion behaviour are retained.

## Verification — 26 November 2026

- Six frontend/motion tests and ten backend tests pass.
- A labelled browser-submitted test reached the configured inbox; Resend reported `delivered`.
- Reposting the exact request returned success and produced no additional email; the provider still showed one Rockside test, with one private reservation row.
- Database transaction tests passed for the hourly limit, identical retry and changed-payload rejection. Test fixture rows were rolled back.
- Both private tables have RLS enabled; anonymous/authenticated SELECT access is false; anonymous RPC access is false. No Rockside-specific security advisories were returned.
- Browser failure fixture preserved the draft, showed a retry message, hid success and restored enabled controls. The fixture was removed after testing and is not deployed.
- Browser validation, sending state, success state, focus loop and Write another message flow were checked.
- Responsive view checks passed at 320×740, 390×844, 768×1024, 844×390 and 1440×900 with no horizontal overflow.

Run `node --test contact.test.mjs ../redesign/tests/*.test.cjs` from this directory. Backend deployment uses `index.ts` plus `contact-core.mjs`; `schema.sql` defines the private storage and restricted RPCs without seeding personal configuration.
