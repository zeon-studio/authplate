---
name: paddle
description: Complete engineering guide for Paddle Billing V2 integration across Next.js, Node.js, and web applications. Make sure to use this skill whenever the user mentions Paddle, Paddle Billing, recurring subscriptions, checkout modals, Paddle.js, payment processing, webhooks, customer portal, billing history, pricing tables, product catalog setup, plan upgrades, subscription cancellations, or sandbox testing, even if they only ask to "add billing", "accept payments", or "handle subscriptions".
---

# Paddle Billing V2 Architecture & Integration Guide

Paddle is a Merchant of Record (MoR) billing platform handling sales tax, global compliance, invoicing, and subscription billing. Paddle Billing V2 provides modern APIs, webhooks, and client SDKs.

---

## 1. Architecture & Mental Model

Paddle divides responsibilities cleanly between the client and the server:

```
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│           Client Browser             │       │            Backend Server            │
│       (@paddle/paddle-js)            │       │      (@paddle/paddle-node-sdk)       │
│  - PricePreview (localized pricing)  │       │  - Webhook verification & sync       │
│  - Checkout.open() (inline/overlay)  │       │  - Subscriptions API (update/cancel) │
│  - Event callbacks (checkout.loaded) │       │  - Customer Portal sessions          │
└──────────────────┬───────────────────┘       └──────────────────▲───────────────────┘
                   │                                              │
                   │ Paddle Checkout                              │ Webhooks
                   ▼                                              │ (signature verified)
┌─────────────────────────────────────────────────────────────────┴───────────────────┐
│                                Paddle Billing Engine                                │
│        - Subscriptions, Invoices, Tax calculation, Payment processing (MoR)         │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### The Separation Rule
- **Client (`@paddle/paddle-js`):** Lightweight browser library. Used **only** for localized price previews (`Paddle.PricePreview`) and opening checkout frames/overlays (`Paddle.Checkout.open`). Never exposes backend API keys.
- **Server (`@paddle/paddle-node-sdk`):** Node.js SDK initialized with `PADDLE_API_KEY`. Used for webhooks, subscription plan changes, cancellations, transaction lookups, and minting customer portal sessions.

---

## 2. Core Integration Lifecycle

A complete Paddle Billing implementation proceeds through 7 primary stages:

```
[1. Catalog Setup] ──► [2. Pricing Page] ──► [3. Web Checkout] ──► [4. Webhook Sync]
                                                                          │
                                                                          ▼
[7. Sandbox Testing] ◄── [6. Portal / History] ◄── [5. Subscriptions (Update/Cancel)]
```

### Stage 1: Catalog & Price Setup
Model your tiers (e.g. Starter, Pro, Enterprise) with monthly and annual prices in Paddle.
- Prefer using the `paddle-sandbox` / `paddle-live` MCP tools if available.
- Alternatively, execute a Node seed script using `@paddle/paddle-node-sdk`.
- See 📖 [catalog-setup.md](references/catalog-setup.md) for automated creation scripts.

### Stage 2: Pricing Display & Localization
Render localized prices matching customer currency, including tax handling and monthly/annual toggles:
```ts
// Client-side PricePreview
const preview = await Paddle.PricePreview({
  items: [{ priceId: "pri_01...", quantity: 1 }],
  address: { countryCode: userCountry },
});
```
- See 📖 [pricing-pages.md](references/pricing-pages.md) for currency formatting (including zero-decimal currencies like JPY/KRW) and toggles.

### Stage 3: Web Checkout
Mount Paddle Checkout as an overlay or embedded iframe:
```ts
import { initializePaddle } from "@paddle/paddle-js";

const paddle = await initializePaddle({
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production",
  token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
});

paddle.Checkout.open({
  items: [{ priceId, quantity: 1 }],
  customer: { email: user.email },
  customData: { userId: user.id, orgId: user.orgId },
});
```
- See 📖 [checkout-web.md](references/checkout-web.md) for customer pre-filling and event handlers.

### Stage 4: Webhooks & Database Sync
Paddle is event-driven. **Never trust client checkout completion alone**; authorize entitlements only when verified webhooks arrive:
- Endpoints: `POST /api/paddlehooks` or `/api/webhooks/paddle`.
- Verify the HMAC signature in `paddle-signature` against the raw body using `PADDLE_WEBHOOK_SECRET_KEY`.
- Core events: `subscription.created`, `subscription.updated`, `subscription.canceled`, `transaction.completed`.
- See 📖 [webhooks.md](references/webhooks.md) and 📖 [subscription-sync.md](references/subscription-sync.md) for database schemas and idempotent upsert handlers.

### Stage 5: Managing Subscriptions
Handle plan upgrades, downgrades, and cancellations safely:
- **Upgrades / Downgrades:** Use Server Actions with `prorationBillingMode: "prorated_immediately"` (or `full_next_billing_period`). Preview before committing.
  - See 📖 [subscription-update.md](references/subscription-update.md).
- **Cancellations:** Cancel at billing period end (`effectiveFrom: "next_billing_period"`) rather than immediately, allowing the customer to retain access until their paid term finishes.
  - See 📖 [subscription-cancel.md](references/subscription-cancel.md).

### Stage 6: Customer Portal & Invoices
Give customers self-service control over payment methods and transaction history:
- **Paddle Hosted Portal:** Mint an authenticated portal session URL using `paddle.customerPortalSessions.create(...)`.
  - See 📖 [customer-portal.md](references/customer-portal.md).
- **In-App Billing History:** Query `paddle.transactions.list({ customerId })` to render branded invoice tables with PDF download links.
  - See 📖 [billing-history.md](references/billing-history.md).

### Stage 7: Sandbox End-to-End Testing
Test the complete flow without real money:
- Use Paddle test card numbers (`4242...`) and simulated 3D Secure challenges.
- Simulate webhooks locally with tunnels (ngrok/Cloudflare Tunnels) and the Paddle Developer Dashboard webhook simulator.
- See 📖 [sandbox-testing.md](references/sandbox-testing.md).

---

## 3. Detailed Technical References

Consult the dedicated reference documentation for specific implementation details:

| Topic | Reference Document | Key Focus |
| --- | --- | --- |
| **Catalog & Products** | 📖 [catalog-setup.md](references/catalog-setup.md) | Products, prices, trial days, MCP tools, and catalog seed scripts. |
| **Pricing Pages** | 📖 [pricing-pages.md](references/pricing-pages.md) | `Paddle.PricePreview`, country detection, billing cycle toggle, currency formatters. |
| **Checkout UI** | 📖 [checkout-web.md](references/checkout-web.md) | Paddle.js initialize, inline frame vs overlay modal, customData, and event callbacks. |
| **Webhook Ingestion** | 📖 [webhooks.md](references/webhooks.md) | Signature verification, raw body handling, idempotency, and retry semantics. |
| **Database Sync** | 📖 [subscription-sync.md](references/subscription-sync.md) | Database schema, customer mapping, status transitions, and entitlement gating. |
| **Plan Updates** | 📖 [subscription-update.md](references/subscription-update.md) | Upgrades, downgrades, proration modes, previewing charges, and payment failure handling. |
| **Cancellations** | 📖 [subscription-cancel.md](references/subscription-cancel.md) | `effectiveFrom` options (`next_billing_period` vs `immediately`), scheduled changes, access revocation. |
| **Customer Portal** | 📖 [customer-portal.md](references/customer-portal.md) | Minting portal session URLs from Server Actions, security boundaries, and deep links. |
| **Billing History** | 📖 [billing-history.md](references/billing-history.md) | Querying transactions via Node SDK, pagination, status filters, and invoice downloads. |
| **Sandbox Testing** | 📖 [sandbox-testing.md](references/sandbox-testing.md) | Test cards, 3DS flows, local webhook tunneling, and webhook event simulation. |

---

## 4. Critical Engineering Gotchas

1. **Raw Body for Webhook Verification:** The Paddle signature verification requires the **exact, unparsed raw string body** of the incoming HTTP request. Never parse JSON before calling `paddle.webhooks.unmarshal(...)`.
2. **Zero-Decimal Currencies:** Currencies such as `JPY`, `KRW`, `CLP`, `PYG`, and `VND` do not use sub-units (cents). Always format currency using `Intl.NumberFormat` with the appropriate currency code rather than blindly dividing by 100.
3. **Environment Isolation:** Sandbox and Production environments have completely independent products, prices, customer IDs, API keys, and client tokens. Never use a `pdl_sdbx_...` key in production or a live key in sandbox.
4. **Scheduled Changes vs Canceled Status:** When a customer cancels a subscription effective at the end of the billing period, its status remains `active` with `scheduledChange: { action: "cancel", effectiveAt: "..." }`. Do not revoke access until the subscription status actually becomes `canceled`.
