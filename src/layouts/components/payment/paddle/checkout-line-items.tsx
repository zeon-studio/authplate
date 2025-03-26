import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

import { formatMoney } from "@/lib/paddle/parse-money";
interface LoadingTextProps {
  value: number | undefined;
  currencyCode: string | undefined;
}

function LoadingText({ value, currencyCode }: LoadingTextProps) {
  if (value === undefined) {
    return <Skeleton className="h-[20px] w-[75px] bg-border" />;
  } else {
    return formatMoney(value, currencyCode);
  }
}

interface Props {
  checkoutData: CheckoutEventsData | null;
  quantity: number;
}

export function CheckoutLineItems({ checkoutData }: Props) {
  return (
    <>
      <div className={"text-base font-medium leading-[20px] md:pt-12"}>
        {checkoutData?.items[0].price_name}
      </div>
      <Separator className={"mt-6 bg-border/50"} />
      <div className={"flex justify-between pt-6"}>
        <span
          className={
            "text-base font-medium leading-[20px] text-muted-foreground"
          }
        >
          Subtotal
        </span>
        <span className={"text-base font-semibold leading-[20px]"}>
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.subtotal}
          />
        </span>
      </div>
      <div className={"flex justify-between pt-6"}>
        <span
          className={
            "text-base font-medium leading-[20px] text-muted-foreground"
          }
        >
          Tax
        </span>
        <span className={"text-base font-semibold leading-[20px]"}>
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.tax}
          />
        </span>
      </div>
      <Separator className={"mt-6 bg-border/50"} />
      <div className={"flex justify-between pt-6"}>
        <span
          className={
            "text-base font-medium leading-[20px] text-muted-foreground"
          }
        >
          Due today
        </span>
        <span className={"text-base font-semibold leading-[20px]"}>
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.total}
          />
        </span>
      </div>
    </>
  );
}
