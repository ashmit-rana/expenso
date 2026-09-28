import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { CategoryId } from '../types';
import { BrandIcon } from './BrandIcon';
import { Search, Trash2, Download, Plus, Filter } from 'lucide-react';

interface LedgerViewProps {
  onOpenQuickAdd: () => void;
}

export const LedgerView: React.FC<LedgerViewProps> = ({ onOpenQuickAdd }) => {
  const { 
    expenses, 
    categories, 
    deleteExpense, 
    exportCsv, 
    selectedMonth 
  } = useExpenses();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Filter expenses by selected month, search query, and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchMonth = e.date.startsWith(selectedMonth);
      const matchCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchSearch = 
        searchQuery === '' ||
        e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.merchantName && e.merchantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.brand && e.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchMonth && matchCategory && matchSearch;
    });
  }, [expenses, selectedMonth, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;
  const paginatedExpenses = filteredExpenses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      
      {/* Top Ledger Toolbar */}
      <div className="card-brutal p-4 bg-[#FFFDF9] flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search size={16} className="text-[#14110F]/60" />
          <input
            type="text"
            placeholder="Search note or merchant (Swiggy, Uber, Chai, Metro)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 bg-[#FAF4E9] paper-border font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#14110F]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#14110F]/60" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="p-2 bg-[#FAF4E9] paper-border font-mono text-xs font-bold focus:outline-none"
          >
            <option value="all">ALL CATEGORIES</option>
            {Object.keys(categories).map((catId) => (
              <option key={catId} value={catId}>
                {categories[catId as CategoryId].icon} {categories[catId as CategoryId].name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="btn-brutal bg-[#FFFDF9] text-[#14110F] px-3 py-2 text-xs font-mono font-bold flex items-center gap-1.5"
            title="Download CSV report"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
          
          <button
            onClick={onOpenQuickAdd}
            className="btn-brutal bg-[#1F7A4D] text-white px-3 py-2 text-xs font-mono font-bold flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>+ SPEND</span>
          </button>
        </div>

      </div>

      {/* Main Ledger Table Card */}
      <div className="card-brutal p-0 overflow-hidden bg-[#FFFDF9]">
        
        {/* Table Header */}
        <div className="bg-[#FAF4E9] px-4 py-3 border-b-2 border-[#14110F] flex justify-between items-center font-mono text-xs font-bold text-[#14110F]">
          <div className="flex items-center gap-2">
            <span>TRANSACTION & MERCHANT</span>
            <span className="stamp bg-[#14110F] text-white text-[9px]">
              {filteredExpenses.length} ENTRIES
            </span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">CATEGORY</span>
            <span>TOTAL: ₹{totalFilteredAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Rows List */}
        {paginatedExpenses.length === 0 ? (
          <div className="p-10 text-center font-mono text-xs text-[#14110F]/60 space-y-2">
            <p>No transactions found for this search filter in {selectedMonth}.</p>
            <button
              onClick={onOpenQuickAdd}
              className="btn-brutal bg-[#F5B700] text-[#14110F] px-4 py-1.5 font-bold"
            >
              + Add First Spend
            </button>
          </div>
        ) : (
          <div className="divide-y-2 divide-[#14110F]/10 font-mono text-xs">
            {paginatedExpenses.map((expense) => {
              const cat = categories[expense.category];
              return (
                <div
                  key={expense.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#FAF4E9] transition-colors gap-3"
                >
                  {/* Left: Brand Icon + Merchant & Note */}
                  <div className="flex items-center gap-3 min-w-0">
                    <BrandIcon brand={expense.brand} category={expense.category} size="md" />
                    
                    <div className="truncate">
                      <div className="font-bold text-sm text-[#14110F] truncate flex items-center gap-2">
                        <span>{expense.note}</span>
                        {expense.paymentMode && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#FAF4E9] paper-border text-[#14110F]/80">
                            {expense.paymentMode}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#14110F]/60 mt-0.5">
                        {expense.date} • {cat?.name || expense.category}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete button */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="font-['JetBrains_Mono'] font-black text-base text-[#14110F]">
                        -₹{expense.amount.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${expense.note}" (₹${expense.amount})?`)) {
                          deleteExpense(expense.id);
                        }
                      }}
                      className="p-1.5 text-[#14110F]/40 hover:text-[#E63B2E] transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#FAF4E9] border-t-2 border-[#14110F] flex justify-between items-center font-mono text-xs">
            <span className="text-[#14110F]/70">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="btn-brutal bg-[#FFFDF9] px-3 py-1 font-bold disabled:opacity-40 disabled:pointer-events-none"
              >
                ← PREV
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="btn-brutal bg-[#F5B700] px-3 py-1 font-bold disabled:opacity-40 disabled:pointer-events-none"
              >
                NEXT →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
