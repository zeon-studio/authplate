import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Subscription } from "@prisma/client";
import { CalendarClock, Clock } from "lucide-react";

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
  return (
    <Card key={subscription.id}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{subscription.planName}</CardTitle>
            <CardDescription className="mt-1">
              Order ID: {subscription.orderId}
            </CardDescription>
          </div>
          <Badge
            variant={subscription.status === "ACTIVE" ? "default" : "secondary"}
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
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {/* @ts-ignore */}
              Next payment on {formatDate(subscription.nextBillingDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
