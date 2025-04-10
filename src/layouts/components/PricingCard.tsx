import { Tier } from "@/app/actions/paddle/type";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export default function PricingCard({
  tier,
  isActive,
}: {
  tier: Tier;
  isActive: boolean;
}) {
  const priceId = Object.values(tier.priceId)[0];
  return (
    <div
      key={tier.id}
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-background p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full"
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
              <span className="text-base">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {isActive && (
          <Button
            className="w-full !text-base h-auto !py-2.5"
            size="lg"
            disabled
          >
            Active plan
          </Button>
        )}

        {!isActive && (
          <Link
            href={priceId ? `/checkout/${priceId}` : `/contact`}
            className={buttonVariants({
              className: "w-full !text-base h-auto !py-2.5",
              size: "lg",
            })}
          >
            {priceId ? "Get Started" : "Contact us"}
          </Link>
        )}
      </div>
    </div>
  );
}
