"use client";

import { Button } from "@/components/ui/button";
import { Package, PricingCard as PricingCardType } from "@/types";
import { Pin } from "lucide-react";

const PricingCard = ({
  button_label,
  content,
  currency,
  monthly_price,
  name,
  services,
  yearly_price,
  selectedPackage,
}: PricingCardType & { selectedPackage: Package }) => {
  const price = selectedPackage === "monthly" ? monthly_price : yearly_price;

  return (
    <div className="rounded-2xl  bg-light">
      <div className="p-8">
        <h3 className="h4 mb-1 font-semibold">{name}</h3>
        <span className="h3 inline-flex font-bold text-text-dark">
          {price}
          {currency}
        </span>
        <span className="text-monthly inline">/monthly</span>
        <p className="mb-4 border-b pb-4">{content}</p>
        <ul className="mt-4 mb-6">
          {services?.map((service: any, i: any) => (
            <li className="mb-2" key={`service-${i}`}>
              <span className="mr-2">
                <Pin className="mr-1 inline h-[14px] w-[14px] text-primary" />
              </span>
              {service}
            </li>
          ))}
        </ul>
        <Button
          className="w-full font-bold hover:bg-dark hover:text-text-light"
          variant={"outline"}
        >
          {button_label}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
