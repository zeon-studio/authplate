import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/paddle/parseMoney";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { CheckoutPriceAmount } from "./CheckoutPriceAmount";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function CheckoutPriceContainer({ checkoutData }: Props) {
  const recurringTotal =
    checkoutData?.recurring_totals?.total ?? checkoutData?.totals.total;

  return (
    <>
      <div className={"text-base font-semibold leading-[20px]"}>
        Order summary
      </div>
      <CheckoutPriceAmount checkoutData={checkoutData} />
      {recurringTotal !== undefined ? (
        <div
          className={
            "pt-4 text-base font-medium leading-[20px] text-muted-foreground"
          }
        >
          then{" "}
          {formatMoney(
            checkoutData?.recurring_totals?.total,
            checkoutData?.currency_code,
          )}{" "}
          monthly
        </div>
      ) : (
        <Skeleton className="mt-4 h-[20px] w-full bg-border" />
      )}
    </>
  );
}
