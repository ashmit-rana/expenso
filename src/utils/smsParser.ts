import type { CategoryId, MerchantBrand, PaymentMode } from '../types';

export interface ParsedSmsResult {
  amount: number;
  merchantName: string;
  category: CategoryId;
  brand: MerchantBrand;
  paymentMode: PaymentMode;
  date: string; // 'YYYY-MM-DD'
  confidence: 'high' | 'medium' | 'low';
  rawText: string;
}

export function parseBankSms(smsText: string): ParsedSmsResult | null {
  if (!smsText || !smsText.trim()) return null;

  const text = smsText.trim();
  const lower = text.toLowerCase();

  // 1. Amount Extraction Regex
  // Matches: Rs. 149.00, Rs 500, INR 120.50, ₹45, debited by 350.00
  const amountPatterns = [
    /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /debited\s*(?:by|for|of)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /sent\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /paid\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /vpa\s*[\w\.\-]+.*?(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];

  let amount = 0;
  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const parsed = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed;
        break;
      }
    }
  }

  // 2. Brand & Merchant Detection
  let brand: MerchantBrand = 'generic';
  let category: CategoryId = 'others';
  let merchantName = 'Unknown Merchant';
  let paymentMode: PaymentMode = 'UPI';

  if (lower.includes('upi') || lower.includes('vpa') || lower.includes('gpay') || lower.includes('phonepe') || lower.includes('paytm')) {
    paymentMode = 'UPI';
  } else if (lower.includes('card') || lower.includes('pos ') || lower.includes('debit card') || lower.includes('credit card')) {
    paymentMode = 'Card';
  } else if (lower.includes('netbanking') || lower.includes('neft') || lower.includes('imps')) {
    paymentMode = 'NetBanking';
  }

  // Keyword lookup table
  if (lower.includes('swiggy')) {
    brand = 'swiggy';
    category = 'food';
    merchantName = 'Swiggy Food / Instamart';
  } else if (lower.includes('zomato')) {
    brand = 'zomato';
    category = 'food';
    merchantName = 'Zomato Online Ordering';
  } else if (lower.includes('tapri') || lower.includes('chai') || lower.includes('tea stall') || lower.includes('bun maska')) {
    brand = 'tapri';
    category = 'food';
    merchantName = 'Campus Chai Tapri';
  } else if (lower.includes('mess') || lower.includes('canteen') || lower.includes('dhaba')) {
    brand = 'mess';
    category = 'food';
    merchantName = 'Hostel Mess & Canteen';
  } else if (lower.includes('uber')) {
    brand = 'uber';
    category = 'transport';
    merchantName = 'Uber India';
  } else if (lower.includes('ola')) {
    brand = 'ola';
    category = 'transport';
    merchantName = 'Ola Cabs';
  } else if (lower.includes('dmrc') || lower.includes('metro') || lower.includes('delhi metro') || lower.includes('smart card')) {
    brand = 'metro';
    category = 'transport';
    merchantName = 'Delhi Metro Rail (DMRC)';
  } else if (lower.includes('spotify')) {
    brand = 'spotify';
    category = 'subscriptions';
    merchantName = 'Spotify Student Plan';
  } else if (lower.includes('netflix')) {
    brand = 'netflix';
    category = 'subscriptions';
    merchantName = 'Netflix India';
  } else if (lower.includes('youtube') || lower.includes('google *youtube')) {
    brand = 'youtube';
    category = 'subscriptions';
    merchantName = 'YouTube Student Premium';
  } else if (lower.includes('xerox') || lower.includes('stationery') || lower.includes('printout') || lower.includes('book store')) {
    brand = 'xerox';
    category = 'academics';
    merchantName = 'Campus Xerox & Book Store';
  } else if (lower.includes('blinkit')) {
    brand = 'blinkit';
    category = 'food';
    merchantName = 'Blinkit Instant Delivery';
  } else if (lower.includes('zepto')) {
    brand = 'zepto';
    category = 'food';
    merchantName = 'Zepto 10m Grocery';
  } else if (lower.includes('amazon') || lower.includes('amzn')) {
    brand = 'amazon';
    category = 'personal';
    merchantName = 'Amazon Shopping';
  } else {
    // Attempt generic merchant extraction
    const toMatch = text.match(/(?:to|towards|at|vpa)\s+([A-Za-z0-9\s\.\*]{3,20})(?:\s+on|\s+ref|\s+via|\s+upi|\.|\,|$)/i);
    if (toMatch && toMatch[1]) {
      merchantName = toMatch[1].trim();
    }
  }

  // 3. Date extraction (defaults to today)
  const todayStr = new Date().toISOString().split('T')[0];

  return {
    amount,
    merchantName,
    category,
    brand,
    paymentMode,
    date: todayStr,
    confidence: amount > 0 && brand !== 'generic' ? 'high' : amount > 0 ? 'medium' : 'low',
    rawText: text,
  };
}
