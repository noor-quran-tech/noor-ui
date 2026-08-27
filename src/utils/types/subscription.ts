import type { StudentDetails } from "@utils/types/user";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  isActive: boolean;
}

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  TRIAL: "TRIAL",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  FREE: "FREE",
};

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface Subscription {
  id: string;
  studentId: string;
  student?: StudentDetails;
  plan: SubscriptionPlan;
  planId: string;
  priceAtPurchase: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  cancelledAt?: Date;
}
