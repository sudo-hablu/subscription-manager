export interface Subscription {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  nextPayment: string;
  category: 'Entertainment' | 'Productivity' | 'Health' | 'Education' | 'Social' | 'Other';
  description?: string;
  paymentMethod?: string;
  reminderDays?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFour: string;
  expiryDate: string;
  holderName: string;
  isDefault: boolean;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}