export type CategoryId = 
  | 'food'
  | 'transport'
  | 'academics'
  | 'subscriptions'
  | 'outing'
  | 'personal'
  | 'utilities'
  | 'others';

export type PaymentMode = 'UPI' | 'Cash' | 'Card' | 'NetBanking';

export type MerchantBrand = 
  | 'swiggy'
  | 'zomato'
  | 'uber'
  | 'ola'
  | 'metro'
  | 'tapri'
  | 'spotify'
  | 'netflix'
  | 'youtube'
  | 'xerox'
  | 'amazon'
  | 'blinkit'
  | 'zepto'
  | 'mess'
  | 'generic';

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  note: string;
  date: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:MM'
  paymentMode: PaymentMode;
  merchantName?: string;
  brand?: MerchantBrand;
  sourceSms?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  limit: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number; // 1 to 31
  category: CategoryId;
  brand?: MerchantBrand;
  paymentMode: PaymentMode;
  active: boolean;
}

export interface ExpensoState {
  monthlyBudget: number;
  categories: Record<CategoryId, CategoryInfo>;
  expenses: Expense[];
  subscriptions: Subscription[];
  pinCode?: string;
  isPinEnabled: boolean;
  selectedMonth: string; // 'YYYY-MM'
}

export interface RuleInsight {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'safe';
  title: string;
  message: string;
  metric?: string;
}
