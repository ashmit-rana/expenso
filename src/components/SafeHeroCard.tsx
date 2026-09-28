import React from 'react';
import { useExpenses } from '../context/ExpenseContext';

export const SafeHeroCard: React.FC = () => {
  const { 
    monthlyBudget, 
    currentMonthSpent, 
    safeToSpendToday, 
    daysRemainingInMonth 
  } = useExpenses();

  const remaining = Math.max(0, monthlyBudget - currentMonthSpent);
  const spentPct = Math.min(100, Math.round((currentMonthSpent / monthlyBudget) * 100));
  const isDanger = spentPct >= 80;

  return (
    <div className={`card-brutal p-6 relative overflow-hidden transition-all ${
      isDanger ? 'bg-[#FFFDF9] border-[#E63B2E]' : 'bg-[#FFFDF9] border-[#14110F]'
    }`}>
      
      {/* Top Meta Line */}
      <div className="flex flex-wrap justify-between items-start gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`stamp font-mono text-[10px] ${
              isDanger ? 'bg-[#E63B2E] text-white' : 'bg-[#1F7A4D] text-white'
            }`}>
              {isDanger ? '⚠️ >80% CHILI DANGER' : '✅ SAFE SPEND PACE'}
            </span>
            <span className="font-mono text-[11px] text-[#14110F]/60">
              FORMULA: (BUDGET - SPENT) ÷ DAYS LEFT
            </span>
          </div>
          <h2 className="font-['Bricolage_Grotesque'] font-black text-2xl text-[#14110F]">
            Safe to Spend Today
          </h2>
        </div>

        <div className="bg-[#FAF4E9] paper-border px-3 py-1 font-mono text-xs font-bold text-[#14110F]">
          {daysRemainingInMonth} DAYS REMAINING
        </div>
      </div>

      {/* Big Hero Amount */}
      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className={`font-['JetBrains_Mono'] font-black text-5xl md:text-6xl tracking-tight ${
          isDanger ? 'text-[#E63B2E]' : 'text-[#1F7A4D]'
        }`}>
          ₹{safeToSpendToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
        <span className="font-mono text-xs font-bold text-[#14110F]/70">
          / daily allowance to survive the month
        </span>
      </div>

      {/* Progress Bar with 80% threshold */}
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-xs font-mono font-bold">
          <span className="text-[#14110F]/70">Month Usage: {spentPct}%</span>
          <span className={isDanger ? 'text-[#E63B2E]' : 'text-[#1F7A4D]'}>
            ₹{currentMonthSpent.toLocaleString('en-IN')} of ₹{monthlyBudget.toLocaleString('en-IN')}
          </span>
        </div>
        
        <div className="w-full h-3.5 bg-[#FAF4E9] paper-border p-0.5 overflow-hidden">
          <div 
            className={`h-full border-r-2 border-[#14110F] transition-all duration-300 ${
              isDanger ? 'bg-[#E63B2E]' : 'bg-[#1F7A4D]'
            }`}
            style={{ width: `${spentPct}%` }}
          />
        </div>
      </div>

      {/* 3 Bottom Summary Metrics */}
      <div className="mt-5 pt-4 border-t-2 border-[#14110F]/15 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#FAF4E9] paper-border">
          <span className="text-[#14110F]/60 block text-[10px] uppercase font-bold">Total Monthly Cap</span>
          <span className="font-bold text-base text-[#14110F]">₹{monthlyBudget.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 bg-[#FAF4E9] paper-border">
          <span className="text-[#14110F]/60 block text-[10px] uppercase font-bold">Total Spent</span>
          <span className={`font-bold text-base ${isDanger ? 'text-[#E63B2E]' : 'text-[#14110F]'}`}>
            ₹{currentMonthSpent.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="p-3 bg-[#FAF4E9] paper-border">
          <span className="text-[#14110F]/60 block text-[10px] uppercase font-bold">Remaining Cash</span>
          <span className={`font-bold text-base ${isDanger ? 'text-[#E63B2E]' : 'text-[#1F7A4D]'}`}>
            ₹{remaining.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

    </div>
  );
};
