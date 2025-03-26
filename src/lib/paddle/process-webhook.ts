import { OrderStatus, OrderType } from "@/actions/subscription/type";
import {
  CustomData,
  PackageType,
  PaymentStatus,
  PaymentType,
} from "@/types/paddle";
import {
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  TransactionCompletedEvent,
  TransactionPaidEvent,
  TransactionPaymentFailedEvent,
} from "@paddle/paddle-node-sdk";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { API_URL, Token } from "../constant";
import { toCamelCase } from "./data-helper";

// create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    authorization_token: `Bearer ${Token}`,
  },
});

export class ProcessWebhook {
  generateUserId(email: string) {
    return (
      "@user_" +
      email
        .replace(/ /g, "_")
        .replace(/[@.!#$%&'*+-/=?^_`{|}~]/g, "_")
        .toLowerCase()
    );
  }
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        await this.createSubscriptionData(toCamelCase(eventData));
        break;
      case EventName.TransactionCompleted:
        await this.orderCreated(toCamelCase(eventData));
        await this.createPayment(toCamelCase(eventData));
        break;
      case EventName.TransactionPaymentFailed:
        await this.createPayment(toCamelCase(eventData));
        break;
    }
  }

  // create order only when lifetime subscription is created
  async orderCreated(eventData: TransactionPaidEvent) {
    const { id: transactionId, customData, subscriptionId } = eventData.data;
    const {
      package: packageName,
      email: userEmail,
      billingFrequency,
    } = customData as CustomData;

    if (subscriptionId || billingFrequency !== "lifetime") {
      return;
    }

    const userId = this.generateUserId(userEmail ?? "");
    const postOrderData: OrderType = {
      checkout_id: transactionId,
      order_id: transactionId,
      subscription_id: "",
      user_id: userId,
      package: packageName as PackageType,
      expires_date: undefined,
      next_payment_amount: "0",
      billing_period: billingFrequency,
      status: OrderStatus.ACTIVE,
      package_change_date: new Date().toISOString(),
    };
    // create order in database
    await axiosInstance.post(`/order`, postOrderData);
  }

  // create order and update subscription data when subscription is created
  async createSubscriptionData(eventData: SubscriptionCreatedEvent) {
    const {
      id: subscriptionId,
      transactionId,
      customData,
      nextBilledAt,
      scheduledChange,
    } = eventData.data;

    if (scheduledChange?.action === "cancel") {
      return;
    }

    const {
      package: packageName,
      email: userEmail,
      billingFrequency,
    } = customData as CustomData;
    const userId = this.generateUserId(userEmail ?? "");
    const postOrderData: OrderType = {
      checkout_id: transactionId,
      order_id: transactionId,
      subscription_id: subscriptionId,
      user_id: userId,
      package: packageName as PackageType,
      expires_date: nextBilledAt ? new Date(nextBilledAt) : undefined,
      next_payment_amount: "0",
      billing_period: billingFrequency,
      status: OrderStatus.ACTIVE,
      package_change_date: new Date().toISOString(),
    };

    // create order in database
    await axiosInstance.post(`/order`, postOrderData);
    revalidateTag("subscriptions");
  }

  // after payment completed create payment in database
  async createPayment(eventData: TransactionCompletedEvent) {
    const {
      id: transactionId,
      details,
      invoiceId,
      customData,
      discountId,
      billingPeriod,
    } = eventData.data;

    try {
      const {
        package: packageName,
        email: userEmail,
        billingFrequency,
      } = customData as CustomData;
      const userId = this.generateUserId(userEmail);
      const earnings = +(details?.totals?.total ?? "0") / 100;
      const taxAmount = +(details?.totals?.tax ?? "0") / 100;
      const processingFee = +(details?.totals?.fee ?? "0") / 100;

      const totalAmount = +(earnings + taxAmount + processingFee).toFixed(2);

      const postPaymentData: PaymentType = {
        order_id: transactionId,
        checkout_id: transactionId,
        plan_name: packageName as PackageType,
        currency: details?.totals?.currencyCode ?? "",
        coupon_code: discountId ?? "",
        payment_method: "paddle",
        earnings: earnings,
        expires_date: billingPeriod?.endsAt
          ? new Date(billingPeriod.endsAt)
          : undefined,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        processing_fee: processingFee,
        user_id: userId,
        refund_amount: 0,
        billing_period: billingFrequency,
        status: PaymentStatus.COMPLETED,
        receipt_url: `https://www.paddle.com/invoice/${invoiceId}`,
      };
      await axiosInstance.post("/payment", postPaymentData);
    } catch (error) {
      console.log({ error });
    }
  }

  // update payment status when payment fails
  async updatePaymentStatus(eventData: TransactionPaymentFailedEvent) {
    const { id: transactionId, customData } = eventData.data;
    await axiosInstance.put(`/payment/${transactionId}`, {
      status: PaymentStatus.FAILED,
    });
  }
}
