import { getActiveSubscriptions } from "@/app/actions/subscriptions";
import { auth } from "@/auth";
import SubscriptionCard from "./_components/SubscriptionCard";

export default async function Subscriptions() {
  const { user } = (await auth()) || {};
  const currentActiveSubscriptions = await getActiveSubscriptions(user?.id!);

  if (!currentActiveSubscriptions?.success) {
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
    <>
      <div className="px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Subscription Details
            </h1>
            <p className="text-muted-foreground">
              View and manage your subscription information
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {currentActiveSubscriptions?.data?.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
