import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/paddle/parseMoney";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function CheckoutPriceAmount({ checkoutData }: Props) {
  const total = checkoutData?.totals.total;
  return (
    <>
      {total !== undefined ? (
        <div className={"flex items-end gap-2 pt-8"}>
          <span className={"text-5xl"}>
            {formatMoney(total, checkoutData?.currency_code)}
          </span>
          <span className={"text-base leading-[16px]"}>inc. tax</span>
        </div>
      ) : (
        <Skeleton className="mt-8 h-[48px] w-full bg-border" />
      )}
    </>
  );
}
