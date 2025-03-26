import { OrderStatus, TOrder } from "@/actions/subscription/type";
import { PaymentStatus } from "@/types/paddle";

// Helper to check if a date is in the future
const isDateActive = (expiryDate: Date): boolean => {
  if (expiryDate === undefined) return true;
  return new Date(expiryDate) > new Date();
};

const hasValidPayment = (order: TOrder): boolean => {
  return order.payments.some(
    (payment) =>
      (payment.status === PaymentStatus.COMPLETED ||
        payment.status === PaymentStatus.CANCELLED) &&
      isDateActive(payment.expires_date!),
  );
};

const isSubscriptionActive = (order: TOrder): boolean => {
  if (
    order.status === OrderStatus.CANCELLED &&
    order.expires_date === undefined
  ) {
    return false;
  }
  return (
    (order.status === OrderStatus.ACTIVE ||
      order.status === OrderStatus.CANCELLED) &&
    isDateActive(order.expires_date!) &&
    hasValidPayment(order)
  );
};

const sortByDate = (
  a: { createdAt?: string },
  b: { createdAt?: string },
): number => {
  return (
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );
};

export const getCurrentPlanDetails = (subscriptions: TOrder[]): TOrder[] => {
  return subscriptions
    .filter(isSubscriptionActive)
    .map((order) => ({
      ...order,
      payments: [...order.payments].sort(sortByDate),
    }))
    .sort(sortByDate);
};

export const getCurrentPlan = (subscriptions: TOrder[]): TOrder | null => {
  const currentPlans = getCurrentPlanDetails(subscriptions);
  return currentPlans[0] ?? null;
};
