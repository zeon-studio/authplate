import { toCamelCase, toSnakeCase } from "@/lib/paddle/dataHelper";
import {
  convertAmountFromLowestUnit,
  formatMoney,
} from "@/lib/paddle/parseMoney";
import assert from "node:assert";
import { describe, it } from "vitest";

describe("dataHelper — camelCase / snake_case object transforms", () => {
  it("converts snake_case keys to camelCase, recursively", () => {
    const input = {
      transaction_id: "txn_1",
      billing_details: {
        customer_id: "cus_1",
        line_items: [{ price_id: "pri_1" }],
      },
    };
    const output = toCamelCase<any>(input);
    assert.deepStrictEqual(output, {
      transactionId: "txn_1",
      billingDetails: {
        customerId: "cus_1",
        lineItems: [{ priceId: "pri_1" }],
      },
    });
  });

  it("converts camelCase keys to snake_case, recursively", () => {
    const input = {
      transactionId: "txn_1",
      billingDetails: { customerId: "cus_1" },
    };
    const output = toSnakeCase<any>(input);
    assert.deepStrictEqual(output, {
      transaction_id: "txn_1",
      billing_details: { customer_id: "cus_1" },
    });
  });

  it("round-trips through both conversions", () => {
    const original = { orderId: "ord_1", nextBillingDate: "2026-01-01" };
    const roundTripped = toCamelCase(toSnakeCase(original));
    assert.deepStrictEqual(roundTripped, original);
  });

  it("leaves arrays of primitives and non-object values untouched", () => {
    assert.deepStrictEqual(toCamelCase([1, 2, 3]), [1, 2, 3]);
    assert.strictEqual(toCamelCase(null as any), null);
    assert.strictEqual(toCamelCase("plain_string" as any), "plain_string");
  });
});

describe("parseMoney — Paddle lowest-unit currency conversion", () => {
  it("divides by 100 for standard 2-decimal currencies", () => {
    assert.strictEqual(convertAmountFromLowestUnit("2500", "USD"), 25);
    assert.strictEqual(convertAmountFromLowestUnit("999", "EUR"), 9.99);
  });

  it("does not divide zero-decimal currencies (JPY/KRW)", () => {
    assert.strictEqual(convertAmountFromLowestUnit("2500", "JPY"), 2500);
    assert.strictEqual(convertAmountFromLowestUnit("15000", "KRW"), 15000);
  });

  it("formatMoney renders a localized currency string", () => {
    const formatted = formatMoney(25, "USD");
    assert.ok(formatted.includes("25"));
    assert.ok(formatted.includes("$") || formatted.includes("USD"));
  });

  it("formatMoney defaults to $0.00-equivalent when no amount is given", () => {
    const formatted = formatMoney(undefined, "USD");
    assert.ok(formatted.includes("0"));
  });
});
