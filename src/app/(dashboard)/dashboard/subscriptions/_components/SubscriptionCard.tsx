import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { humanize } from "@/lib/utils/textConverter";
import { BillingCycle, Subscription, SubscriptionStatus } from "@prisma/client";
import { CalendarClock, Clock } from "lucide-react";
import { CancelSubscriptionDialog } from "./CancelSubscription";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription;
}) {
  const currentDate = new Date();
  let paymentInfo = (
    <div className="flex items-center gap-3 text-sm">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">
        {/* @ts-ignore */}
        Next payment on {formatDate(subscription.nextBillingDate)}
      </span>
    </div>
  );

  if (
    subscription.status === SubscriptionStatus.CANCELED &&
    subscription.lastBillingDate! < currentDate &&
    subscription.nextBillingDate! > currentDate
  ) {
    paymentInfo = (
      <div className="flex items-center gap-3 text-sm">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {/* @ts-ignore */}
          Subscription will be cancel {formatDate(subscription.nextBillingDate)}
        </span>
      </div>
    );
  }

  return (
    <Card key={subscription.id}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{humanize(subscription.planName)}</CardTitle>
            <CardDescription className="mt-1">
              Order ID: {subscription.orderId}
            </CardDescription>
          </div>
          <Badge
            variant={
              subscription.status === SubscriptionStatus.ACTIVE
                ? "success"
                : "destructive"
            }
            className="capitalize"
          >
            {subscription.status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Billing Cycle Info */}
          <div className="flex items-center gap-3 text-sm">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {subscription.billingCycle.toLowerCase()} billing cycle
            </span>
          </div>

          {/* Next Payment Info */}
          {paymentInfo}
          {/* Cancel Subscription Button */}
          {subscription.status === "ACTIVE" &&
            subscription.billingCycle !== BillingCycle.LIFETIME && (
              <div className="pt-2">
                <CancelSubscriptionDialog
                  subscriptionId={subscription.orderId.toString()}
                />
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
