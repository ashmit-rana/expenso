import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { CategoryId } from '../types';
import { Edit2, Check } from 'lucide-react';

export const BudgetsView: React.FC = () => {
  const { 
    categories, 
    categorySpending, 
    monthlyBudget, 
    updateMonthlyBudget, 
    updateCategoryLimit, 
    currentMonthSpent 
  } = useExpenses();

  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetVal, setBudgetVal] = useState(monthlyBudget.toString());
  
  const [editingCategory, setEditingCategory] = useState<CategoryId | null>(null);
  const [catLimitVal, setCatLimitVal] = useState('');

  const handleSaveBudget = () => {
    const val = parseFloat(budgetVal);
    if (val && val > 0) {
      updateMonthlyBudget(val);
      setEditingBudget(false);
    }
  };

  const handleSaveCatLimit = (catId: CategoryId) => {
    const val = parseFloat(catLimitVal);
    if (val && val > 0) {
      updateCategoryLimit(catId, val);
      setEditingCategory(null);
    }
  };

  const totalBudgetUsage = Math.min(100, Math.round((currentMonthSpent / monthlyBudget) * 100));
  const isOverallDanger = totalBudgetUsage >= 80;

  return (
    <div className="space-y-6">
      
      {/* Overall Monthly Allowance Banner */}
      <div className="card-brutal p-5 bg-[#FFFDF9] space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`stamp font-mono text-[10px] ${
                isOverallDanger ? 'bg-[#E63B2E] text-white' : 'bg-[#1F7A4D] text-white'
              }`}>
                {isOverallDanger ? '🚨 OVERALL BUDGET >80% WARNING' : '✅ BUDGET ON TRACK'}
              </span>
            </div>
            <h2 className="font-['Bricolage_Grotesque'] font-black text-xl text-[#14110F]">
              Total Monthly Student Budget
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {editingBudget ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value)}
                  className="w-28 p-1.5 bg-[#FAF4E9] paper-border font-bold text-sm focus:outline-none"
                />
                <button
                  onClick={handleSaveBudget}
                  className="btn-brutal bg-[#1F7A4D] text-white p-1.5"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] font-black text-xl text-[#14110F]">
                  ₹{monthlyBudget.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => {
                    setBudgetVal(monthlyBudget.toString());
                    setEditingBudget(true);
                  }}
                  className="btn-brutal bg-[#FAF4E9] p-1.5 text-xs font-bold"
                  title="Edit Total Monthly Budget"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-5 bg-[#FAF4E9] paper-border p-0.5 overflow-hidden">
            <div
              className={`h-full border-r-2 border-[#14110F] transition-all duration-300 ${
                isOverallDanger ? 'bg-[#E63B2E]' : 'bg-[#1F7A4D]'
              }`}
              style={{ width: `${totalBudgetUsage}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs font-bold text-[#14110F]/70">
            <span>Spent: ₹{currentMonthSpent.toLocaleString('en-IN')} ({totalBudgetUsage}%)</span>
            <span>Remaining: ₹{Math.max(0, monthlyBudget - currentMonthSpent).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Per Category Limits Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-2">
          <h3 className="font-['Bricolage_Grotesque'] font-black text-lg uppercase text-[#14110F]">
            Category Spending Caps & Danger Gauges (&gt;80% = Chili Red)
          </h3>
          <span className="font-mono text-xs text-[#14110F]/60">Auto-calculated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(categories) as CategoryId[]).map((catId) => {
            const cat = categories[catId];
            const spent = categorySpending[catId] || 0;
            const limit = cat.limit || 1000;
            const pct = Math.min(100, Math.round((spent / limit) * 100));
            const isCatDanger = pct >= 80;

            return (
              <div
                key={catId}
                className={`card-brutal p-4 space-y-3 bg-[#FFFDF9] transition-all ${
                  isCatDanger ? 'border-[#E63B2E] shadow-[4px_4px_0px_#E63B2E]' : 'border-[#14110F]'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-['Bricolage_Grotesque'] font-bold text-base text-[#14110F]">
                        {cat.name}
                      </h4>
                      <p className="font-mono text-[10px] text-[#14110F]/60">
                        {isCatDanger ? 'Approaching max limit' : 'Within safe boundaries'}
                      </p>
                    </div>
                  </div>

                  <span className={`stamp text-[9px] ${
                    isCatDanger ? 'bg-[#E63B2E] text-white' : 'bg-[#1F7A4D] text-white'
                  }`}>
                    {pct}% {isCatDanger ? 'CHILI ALERT' : 'SAFE'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3.5 bg-[#FAF4E9] paper-border p-0.5 overflow-hidden">
                  <div
                    className={`h-full border-r-2 border-[#14110F] transition-all duration-300 ${
                      isCatDanger ? 'bg-[#E63B2E]' : 'bg-[#1F7A4D]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Stats & Edit Limit */}
                <div className="flex justify-between items-center font-mono text-xs pt-1">
                  <div>
                    <span className="text-[#14110F]/60 block text-[10px]">SPENT</span>
                    <span className={`font-black ${isCatDanger ? 'text-[#E63B2E]' : 'text-[#14110F]'}`}>
                      ₹{spent.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#14110F]/60 block text-[10px]">MONTHLY LIMIT</span>
                    {editingCategory === catId ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={catLimitVal}
                          onChange={(e) => setCatLimitVal(e.target.value)}
                          className="w-20 p-1 bg-[#FAF4E9] paper-border font-bold text-xs"
                        />
                        <button
                          onClick={() => handleSaveCatLimit(catId)}
                          className="btn-brutal bg-[#1F7A4D] text-white p-1"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="font-bold text-[#14110F]">
                          ₹{limit.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => {
                            setCatLimitVal(limit.toString());
                            setEditingCategory(catId);
                          }}
                          className="text-[#14110F]/50 hover:text-[#14110F]"
                          title="Edit Limit"
                        >
                          <Edit2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
