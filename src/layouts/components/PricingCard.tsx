import { Tier } from "@/app/actions/paddle/type";
import { BillingCycle } from "@prisma/client";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export default function PricingCard({
  tier,
  isActive,
}: {
  tier: Tier;
  isActive: boolean;
}) {
  return (
    <div
      key={tier.id}
      className="relative overflow-hidden rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            {tier.name.replace("_", " ")}
          </h2>
          <p className="text-muted-foreground">{tier.description}</p>
        </div>

        {/* features */}
        <ul className="space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <svg
                className="h-4 w-4 flex-shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {isActive && (
          <Button className="w-full" disabled>
            Active plan
          </Button>
        )}

        {!isActive && (
          <Link
            href={
              "/checkout/" +
              (BillingCycle.LIFETIME in tier.priceId
                ? tier.priceId[BillingCycle.LIFETIME]
                : tier.priceId[BillingCycle.MONTHLY])
            }
            className={buttonVariants({
              className: "w-full",
              size: "lg",
            })}
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
}
