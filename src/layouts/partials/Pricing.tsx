"use client";

import { PricingTier } from "@/app/actions/paddle/pricing-tier";
import PricingCard from "../components/PricingCard";

const Pricing = () => {
  return (
    <section className="section bg-light/30" id="pricing">
      <div className="container">
        <div className="grid grid-cols-4 gap-4">
          {PricingTier.map((tier) => {
            return <PricingCard isActive={false} key={tier.id} tier={tier} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
