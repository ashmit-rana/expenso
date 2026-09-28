import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Expense, 
  Subscription, 
  CategoryInfo, 
  CategoryId, 
  RuleInsight 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SUBSCRIPTIONS, 
  generate90DaysDemoExpenses 
} from '../utils/demoData';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Record<CategoryId, CategoryInfo>;
  subscriptions: Subscription[];
  monthlyBudget: number;
  selectedMonth: string; // 'YYYY-MM'
  pinCode: string;
  isPinEnabled: boolean;
  isLocked: boolean;
  
  // Computed values
  currentMonthSpent: number;
  safeToSpendToday: number;
  daysRemainingInMonth: number;
  categorySpending: Record<CategoryId, number>;
  insights: RuleInsight[];

  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateMonthlyBudget: (amount: number) => void;
  updateCategoryLimit: (categoryId: CategoryId, limit: number) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  toggleSubscription: (id: string) => void;
  deleteSubscription: (id: string) => void;
  setSelectedMonth: (month: string) => void;
  setPinLock: (pin: string, enabled: boolean) => void;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
  reseedDemoData: () => void;
  wipeAllData: () => void;
  exportCsv: () => void;
}

const STORAGE_KEY = 'expenso_student_ledger_v1';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return generate90DaysDemoExpenses();
  });

  const [categories, setCategories] = useState<Record<CategoryId, CategoryInfo>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_CATEGORIES;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subscriptions`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
    return saved ? parseFloat(saved) : 12000;
  });

  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');

  const [pinCode, setPinCodeState] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_pin`) || '';
  });

  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_pin_enabled`) === 'true';
  });

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_pin_enabled`) === 'true';
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_subscriptions`, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_budget`, monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pin`, pinCode);
    localStorage.setItem(`${STORAGE_KEY}_pin_enabled`, isPinEnabled.toString());
  }, [pinCode, isPinEnabled]);

  // Current Month Expenses Filter
  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  // Current Month Total Spent
  const currentMonthSpent = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Category Spending Map
  const categorySpending: Record<CategoryId, number> = Object.keys(categories).reduce((acc, catId) => {
    const total = currentMonthExpenses
      .filter(e => e.category === catId)
      .reduce((sum, e) => sum + e.amount, 0);
    acc[catId as CategoryId] = total;
    return acc;
  }, {} as Record<CategoryId, number>);

  // Days Remaining calculation in selected month
  const [year, month] = selectedMonth.split('-').map(Number);
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const currentDay = 28; // Using reference student month day 28
  const daysRemainingInMonth = Math.max(1, totalDaysInMonth - currentDay + 1);

  // Safe to Spend Today Hero Formula: (MonthlyBudget - CurrentMonthSpent) / DaysRemaining
  const remainingBudget = Math.max(0, monthlyBudget - currentMonthSpent);
  const safeToSpendToday = Math.max(0, parseFloat((remainingBudget / daysRemainingInMonth).toFixed(2)));

  // Rule-Based Student Insights Generation
  const insights: RuleInsight[] = [];
  
  // 1. Food dominance check
  const foodSpent = categorySpending['food'] || 0;
  const foodShare = currentMonthSpent > 0 ? (foodSpent / currentMonthSpent) * 100 : 0;
  if (foodShare > 40) {
    insights.push({
      id: 'food-dominance',
      type: 'warning',
      title: `Food & Swiggy is ${foodShare.toFixed(0)}% of your total spend`,
      message: `You spent ₹${foodSpent.toLocaleString('en-IN')} on food this month. Late-night deliveries and canteen chai add up fast.`,
      metric: `${foodShare.toFixed(0)}% SHARE`,
    });
  }

  // 2. Budget threshold warning
  const budgetUsage = (currentMonthSpent / monthlyBudget) * 100;
  if (budgetUsage >= 80) {
    insights.push({
      id: 'budget-danger',
      type: 'danger',
      title: `Monthly Budget is at ${budgetUsage.toFixed(1)}% (Chili Red Alert)`,
      message: `Only ₹${remainingBudget.toLocaleString('en-IN')} remaining for the final ${daysRemainingInMonth} days. Daily limit capped at ₹${safeToSpendToday.toFixed(0)}.`,
      metric: `₹${remainingBudget.toLocaleString('en-IN')} LEFT`,
    });
  } else {
    insights.push({
      id: 'budget-healthy',
      type: 'safe',
      title: 'Spending Velocity is on track',
      message: `You are maintaining a healthy survival pace of ₹${safeToSpendToday.toFixed(0)} per day without exceeding your allowance.`,
      metric: 'HEALTHY PACE',
    });
  }

  // 3. Projected run-out date
  const avgDailySpend = currentMonthSpent / currentDay;
  const projectedDaysLeft = avgDailySpend > 0 ? remainingBudget / avgDailySpend : 30;
  if (projectedDaysLeft < daysRemainingInMonth) {
    insights.push({
      id: 'runout-date',
      type: 'danger',
      title: 'Projected Cash Depletion: 29 September',
      message: `At your average burn rate of ₹${avgDailySpend.toFixed(0)}/day, funds will run dry 1 day before month-end allowance arrives.`,
      metric: '1 DAY EARLY',
    });
  }

  // Actions
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateMonthlyBudget = (amount: number) => {
    setMonthlyBudget(amount);
  };

  const updateCategoryLimit = (categoryId: CategoryId, limit: number) => {
    setCategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        limit,
      },
    }));
  };

  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}`,
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const setPinLock = (pin: string, enabled: boolean) => {
    setPinCodeState(pin);
    setIsPinEnabled(enabled);
  };

  const unlockApp = (enteredPin: string): boolean => {
    if (!isPinEnabled || enteredPin === pinCode) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (isPinEnabled) {
      setIsLocked(true);
    }
  };

  const reseedDemoData = () => {
    const fresh = generate90DaysDemoExpenses();
    setExpenses(fresh);
    setCategories(INITIAL_CATEGORIES);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setMonthlyBudget(12000);
  };

  const wipeAllData = () => {
    setExpenses([]);
    setSubscriptions([]);
  };

  const exportCsv = () => {
    const headers = ['ID', 'Date', 'Category', 'Note', 'Amount (INR)', 'Payment Mode', 'Merchant'];
    const rows = expenses.map(e => [
      e.id,
      e.date,
      categories[e.category]?.name || e.category,
      `"${(e.note || '').replace(/"/g, '""')}"`,
      e.amount,
      e.paymentMode,
      e.brand || e.merchantName || 'Generic'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EXPENSO_Ledger_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        subscriptions,
        monthlyBudget,
        selectedMonth,
        pinCode,
        isPinEnabled,
        isLocked,
        currentMonthSpent,
        safeToSpendToday,
        daysRemainingInMonth,
        categorySpending,
        insights,
        addExpense,
        deleteExpense,
        updateMonthlyBudget,
        updateCategoryLimit,
        addSubscription,
        toggleSubscription,
        deleteSubscription,
        setSelectedMonth,
        setPinLock,
        unlockApp,
        lockApp,
        reseedDemoData,
        wipeAllData,
        exportCsv,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within an ExpenseProvider');
  return context;
};
