import { PricingTier } from "@/app/actions/paddle/pricing-tier";
import { buttonVariants } from "@/layouts/components/ui/button";
import Link from "next/link";

export default function PurchasePage() {
  return (
    <div className="container">
      <div className="grid grid-cols-4 gap-4">
        {PricingTier.map((tier) => {
          console.log(tier);
          return (
            <div
              key={tier.id}
              className="space-y-3 rounded-lg border p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold capitalize">
                  {tier.name.replace(/-/g, " ")}
                </h2>
                <p className="text-sm">{tier.description}</p>
                {/* features */}
                <ul className="space-y-2 pl-5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="list-disc">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={
                  "/checkout/" +
                  ("lifetime" in tier.priceId
                    ? tier.priceId.lifetime
                    : tier.priceId.month)
                }
                className={buttonVariants({
                  className: "",
                })}
              >
                Purchase
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
