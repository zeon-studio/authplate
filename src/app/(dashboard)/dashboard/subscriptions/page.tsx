import {
  getActiveSubscriptions,
  getExpiredSubscriptions,
} from "@/app/actions/subscriptions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/layouts/components/ui/tabs";
import { auth } from "@/lib/auth";
import SubscriptionCard from "./_components/SubscriptionCard";

export default async function Subscriptions() {
  const { user } = (await auth()) || {};
  const currentActiveSubscriptions = await getActiveSubscriptions(user?.id!);
  const expiredSubscriptions = await getExpiredSubscriptions(user?.id!);

  if (!currentActiveSubscriptions?.success || !expiredSubscriptions?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold mb-2">
          Error loading subscriptions
        </h1>
        <p className="text-muted-foreground">
          There was an error loading your subscription information. Please try
          again later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">Subscription Details</h1>
          <p className="text-muted-foreground">
            View and manage your subscription information
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="expired">Expired Subscriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="grid grid-cols-3 gap-4 mt-6">
              {currentActiveSubscriptions?.data?.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
              {currentActiveSubscriptions?.data?.length === 0 && (
                <p className="text-muted-foreground col-span-3 text-center py-4">
                  No active subscriptions found.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="expired">
            <div className="grid grid-cols-3 gap-4 mt-6">
              {expiredSubscriptions?.data?.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
              {expiredSubscriptions?.data?.length === 0 && (
                <p className="text-muted-foreground col-span-3 text-center py-4">
                  No expired subscriptions found.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
