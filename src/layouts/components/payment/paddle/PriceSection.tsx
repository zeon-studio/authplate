import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { CheckoutLineItems } from "./CheckoutLineItems";
import { CheckoutPriceAmount } from "./CheckoutPriceAmount";
import { CheckoutPriceContainer } from "./CheckoutPriceContainer";

export function PriceSection({
  checkoutData,
  quantity,
}: {
  checkoutData: CheckoutEventsData | null;
  quantity: number;
}) {
  return (
    <>
      <div className={"hidden md:block"}>
        <CheckoutPriceContainer checkoutData={checkoutData} />
        <CheckoutLineItems checkoutData={checkoutData} quantity={quantity} />
      </div>

      <div className={"block md:hidden"}>
        <CheckoutPriceAmount checkoutData={checkoutData} />
        <Separator
          className={
            "checkout-order-summary-mobile-yellow-highlight relative mt-6 bg-border/50"
          }
        />
        <Accordion type="single" collapsible>
          <AccordionItem className={"border-none"} value="item-1">
            <AccordionTrigger className={"text-muted-foreground !no-underline"}>
              Order summary
            </AccordionTrigger>
            <AccordionContent className={"pb-0"}></AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
