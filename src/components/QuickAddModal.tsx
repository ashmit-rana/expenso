import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { CategoryId, PaymentMode, MerchantBrand } from '../types';
import { BrandIcon } from './BrandIcon';
import { X, Check } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, categories } = useExpenses();

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [brand, setBrand] = useState<MerchantBrand>('generic');

  if (!isOpen) return null;

  // Auto detect brand from note
  const handleNoteChange = (text: string) => {
    setNote(text);
    const lower = text.toLowerCase();
    if (lower.includes('swiggy')) { setBrand('swiggy'); setCategory('food'); }
    else if (lower.includes('zomato')) { setBrand('zomato'); setCategory('food'); }
    else if (lower.includes('uber')) { setBrand('uber'); setCategory('transport'); }
    else if (lower.includes('ola')) { setBrand('ola'); setCategory('transport'); }
    else if (lower.includes('metro') || lower.includes('dmrc')) { setBrand('metro'); setCategory('transport'); }
    else if (lower.includes('spotify')) { setBrand('spotify'); setCategory('subscriptions'); }
    else if (lower.includes('youtube')) { setBrand('youtube'); setCategory('subscriptions'); }
    else if (lower.includes('netflix')) { setBrand('netflix'); setCategory('subscriptions'); }
    else if (lower.includes('chai') || lower.includes('tapri')) { setBrand('tapri'); setCategory('food'); }
    else if (lower.includes('xerox') || lower.includes('print')) { setBrand('xerox'); setCategory('academics'); }
    else if (lower.includes('mess')) { setBrand('mess'); setCategory('food'); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parsedAmount,
      category,
      note: note.trim() || `${categories[category]?.name || 'Expense'}`,
      date,
      paymentMode,
      brand,
    });

    // Reset & close
    setAmount('');
    setNote('');
    setBrand('generic');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#14110F]/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
      <div className="card-brutal p-6 bg-[#FAF4E9] max-w-md w-full space-y-4 border-2 border-[#14110F]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#1F7A4D] text-white font-['Bricolage_Grotesque'] font-black px-2 py-0.5 paper-border text-xs">
              + ADD
            </span>
            <h3 className="font-['Bricolage_Grotesque'] font-extrabold text-lg uppercase text-[#14110F]">
              Record New Expense
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:text-[#E63B2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          {/* Amount Input */}
          <div>
            <label className="block font-bold text-[#14110F] mb-1">
              AMOUNT (₹ RUPEE) <span className="text-[#E63B2E]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-lg text-[#14110F]">₹</span>
              <input
                type="number"
                step="0.01"
                required
                autoFocus
                placeholder="e.g. 185.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 bg-[#FFFDF9] paper-border font-['JetBrains_Mono'] text-lg font-bold text-[#14110F] focus:outline-none focus:ring-2 focus:ring-[#14110F]"
              />
            </div>
          </div>

          {/* Description & Note */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#14110F]">NOTE / MERCHANT</label>
              {brand !== 'generic' && (
                <span className="flex items-center gap-1 text-[10px] text-[#1F7A4D] font-bold">
                  <BrandIcon brand={brand} size="sm" /> Auto-detected
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Swiggy Midnight Burger, DMRC Metro, Tapri Chai..."
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF9] paper-border text-xs focus:outline-none focus:ring-2 focus:ring-[#14110F]"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block font-bold text-[#14110F] mb-1">CATEGORY</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(Object.keys(categories) as CategoryId[]).slice(0, 8).map((catId) => {
                const cat = categories[catId];
                const isSelected = category === catId;
                return (
                  <button
                    type="button"
                    key={catId}
                    onClick={() => setCategory(catId)}
                    className={`p-1.5 text-left border-2 border-[#14110F] text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#F5B700] shadow-[2px_2px_0px_#14110F]'
                        : 'bg-[#FFFDF9] hover:bg-[#FAF4E9]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Mode & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#14110F] mb-1">PAYMENT MODE</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full p-2 bg-[#FFFDF9] paper-border font-bold text-xs focus:outline-none"
              >
                <option value="UPI">⚡ UPI (GPay/Paytm)</option>
                <option value="Cash">💵 Cash</option>
                <option value="Card">💳 Debit/Credit Card</option>
                <option value="NetBanking">🏦 NetBanking</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#14110F] mb-1">DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-[#FFFDF9] paper-border font-bold text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t-2 border-[#14110F]">
            <button
              type="button"
              onClick={onClose}
              className="btn-brutal bg-[#E6D9C0] px-4 py-2 font-bold text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-brutal bg-[#1F7A4D] text-white px-5 py-2 font-bold text-xs flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>SAVE TO EXPENSO</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
