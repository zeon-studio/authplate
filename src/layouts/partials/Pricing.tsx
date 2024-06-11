"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/shadcn";
import { Package, Pricing as PricingType } from "@/types/index.js";
import { useState } from "react";
import PricingCard from "./PricingCard";

const Pricing = ({ pricing_card, title }: PricingType) => {
  const [selectedPackage, setPackage] = useState<Package>("monthly");

  const handleChangePackage = (value: Package) => {
    setPackage(value);
  };

  return (
    <section className="section bg-light/30" id="pricing">
      <div className="container">
        <div className="row justify-center">
          <div className="mb-12 text-center md:col-12 lg:col-4">
            <h2 className="mb-6">{title}</h2>
            <div className="border-2 border-border rounded-lg p-2 mx-auto flex justify-between space-x-3 text-center font-bold text-dark">
              <Button
                className={cn(
                  "bg-transparent flex-1 text-inherit",
                  selectedPackage === "monthly" && "bg-primary text-light",
                )}
                onClick={() => handleChangePackage("monthly")}
              >
                Monthly
              </Button>
              <Button
                onClick={() => handleChangePackage("yearly")}
                className={cn(
                  "bg-transparent flex-1 text-inherit",
                  selectedPackage === "yearly" && "bg-primary text-light",
                )}
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>

        <div className="row">
          {pricing_card.map((product) => {
            return (
              <div className="col-12 md:col-4" key={product.name}>
                <PricingCard
                  selectedPackage={selectedPackage}
                  {...product}
                ></PricingCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
