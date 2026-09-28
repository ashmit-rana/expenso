import type { Expense, Subscription, CategoryInfo, CategoryId } from '../types';

export const INITIAL_CATEGORIES: Record<CategoryId, CategoryInfo> = {
  food: { id: 'food', name: 'Food & Mess', icon: '🍔', color: '#E63B2E', limit: 6000 },
  transport: { id: 'transport', name: 'Metro & Travel', icon: '🚕', color: '#1F7A4D', limit: 2000 },
  academics: { id: 'academics', name: 'Books & Xerox', icon: '📚', color: '#F5B700', limit: 1500 },
  subscriptions: { id: 'subscriptions', name: 'Subscriptions', icon: '🔄', color: '#E63B2E', limit: 1500 },
  outing: { id: 'outing', name: 'Outing & Movies', icon: '🎉', color: '#F5B700', limit: 2000 },
  personal: { id: 'personal', name: 'Personal Care', icon: '🛍️', color: '#1F7A4D', limit: 1000 },
  utilities: { id: 'utilities', name: 'Hostel WiFi & Dues', icon: '⚡', color: '#14110F', limit: 1000 },
  others: { id: 'others', name: 'Miscellaneous', icon: '📦', color: '#14110F', limit: 500 },
};

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Spotify Student Premium',
    amount: 59,
    billingDay: 2,
    category: 'subscriptions',
    brand: 'spotify',
    paymentMode: 'UPI',
    active: true,
  },
  {
    id: 'sub-2',
    name: 'Hostel PG WiFi Share',
    amount: 350,
    billingDay: 5,
    category: 'utilities',
    brand: 'generic',
    paymentMode: 'UPI',
    active: true,
  },
  {
    id: 'sub-3',
    name: 'YouTube Premium Student',
    amount: 79,
    billingDay: 18,
    category: 'subscriptions',
    brand: 'youtube',
    paymentMode: 'UPI',
    active: true,
  },
  {
    id: 'sub-4',
    name: 'Hostel Mess Night Canteen Allowance',
    amount: 710,
    billingDay: 30,
    category: 'food',
    brand: 'mess',
    paymentMode: 'Cash',
    active: true,
  },
];

export function generate90DaysDemoExpenses(): Expense[] {
  const expenses: Expense[] = [];
  const today = new Date('2026-09-28');

  // Helper to format date YYYY-MM-DD
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const studentCatalog = [
    { note: 'Chai & Bun Maska @ Tapri', amount: 45, category: 'food' as CategoryId, brand: 'tapri' as const, mode: 'UPI' as const },
    { note: 'Delhi Metro Smartcard Recharge', amount: 200, category: 'transport' as CategoryId, brand: 'metro' as const, mode: 'UPI' as const },
    { note: 'Swiggy Midnight Biryani Share', amount: 289, category: 'food' as CategoryId, brand: 'swiggy' as const, mode: 'UPI' as const },
    { note: 'Zomato Pizza Treat with Roommates', amount: 399, category: 'food' as CategoryId, brand: 'zomato' as const, mode: 'UPI' as const },
    { note: 'Assignment Xerox & Spiral Binding', amount: 85, category: 'academics' as CategoryId, brand: 'xerox' as const, mode: 'Cash' as const },
    { note: 'Uber Auto to Metro Station', amount: 95, category: 'transport' as CategoryId, brand: 'uber' as const, mode: 'UPI' as const },
    { note: 'Semester Textbook - Data Structures', amount: 450, category: 'academics' as CategoryId, brand: 'xerox' as const, mode: 'UPI' as const },
    { note: 'Evening Cold Coffee & Maggi', amount: 80, category: 'food' as CategoryId, brand: 'tapri' as const, mode: 'UPI' as const },
    { note: 'Weekend Movie Ticket & Popcorn', amount: 320, category: 'outing' as CategoryId, brand: 'generic' as const, mode: 'UPI' as const },
    { note: 'Hostel Night Canteen Thali', amount: 110, category: 'food' as CategoryId, brand: 'mess' as const, mode: 'UPI' as const },
    { note: 'Ola Cab to Railway Station', amount: 240, category: 'transport' as CategoryId, brand: 'ola' as const, mode: 'UPI' as const },
    { note: 'Lab Record Sheets & Geometry Box', amount: 160, category: 'academics' as CategoryId, brand: 'xerox' as const, mode: 'Cash' as const },
    { note: 'Blinkit Late Night Snacks & Chips', amount: 185, category: 'food' as CategoryId, brand: 'blinkit' as const, mode: 'UPI' as const },
    { note: 'Amazon Earphones replacement', amount: 399, category: 'personal' as CategoryId, brand: 'amazon' as const, mode: 'Card' as const },
    { note: 'Chai & Samosa group treat', amount: 90, category: 'food' as CategoryId, brand: 'tapri' as const, mode: 'UPI' as const },
    { note: 'Metro token for weekend market', amount: 60, category: 'transport' as CategoryId, brand: 'metro' as const, mode: 'UPI' as const },
  ];

  let idCounter = 1;

  // Generate 90 days backwards from 2026-09-28
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);

    // Number of transactions per day: 1 to 3
    const txnCount = (i % 3 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;

    for (let t = 0; t < txnCount; t++) {
      const itemIndex = (i * 3 + t) % studentCatalog.length;
      const item = studentCatalog[itemIndex];

      // Add slight price variation +/- 10%
      const jitter = Math.floor(Math.random() * 20) - 10;
      const finalAmount = Math.max(20, item.amount + jitter);

      expenses.push({
        id: `exp-${idCounter++}`,
        amount: finalAmount,
        category: item.category,
        note: item.note,
        date: dateStr,
        paymentMode: item.mode,
        brand: item.brand,
        merchantName: item.note.split(' ')[0],
      });
    }
  }

  return expenses;
}
