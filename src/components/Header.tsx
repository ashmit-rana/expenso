import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Lock, Unlock, RefreshCw, Download, Plus, Zap, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenSmsParser: () => void;
  onOpenPinSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickAdd,
  onOpenSmsParser,
  onOpenPinSettings,
}) => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    isPinEnabled, 
    lockApp, 
    reseedDemoData, 
    exportCsv 
  } = useExpenses();

  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="card-brutal p-4 bg-[#FAF4E9] flex flex-wrap items-center justify-between gap-4 border-2 border-[#14110F]">
      
      {/* Brand & Month */}
      <div className="flex items-center gap-3">
        <div className="bg-[#F5B700] text-[#14110F] font-['Bricolage_Grotesque'] font-black text-2xl px-3 py-1 paper-border shadow-[2px_2px_0px_#14110F]">
          ₹
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Bricolage_Grotesque'] font-black text-2xl tracking-tight text-[#14110F]">
              EXPENSO
            </h1>
            <span className="stamp bg-[#1F7A4D] text-white text-[9px] py-0.5">STUDENT LEDGER</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-mono text-xs font-bold text-[#14110F] border-b border-[#14110F] focus:outline-none cursor-pointer"
            >
              <option value="2026-09">SEPTEMBER 2026 (Active)</option>
              <option value="2026-08">AUGUST 2026</option>
              <option value="2026-07">JULY 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSmsParser}
          className="btn-brutal bg-[#F5B700] text-[#14110F] px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
          title="Paste raw Bank / UPI SMS to extract transaction automatically"
        >
          <Zap size={14} />
          <span>PARSE SMS</span>
        </button>

        <button
          onClick={onOpenQuickAdd}
          className="btn-brutal bg-[#1F7A4D] text-white px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>+ ADD SPEND</span>
        </button>

        {/* Security / More menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn-brutal bg-white p-1.5 text-[#14110F]"
            title="More Options"
          >
            <Shield size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 card-brutal bg-[#FFFDF9] p-2 space-y-1 z-40 text-xs font-mono">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenPinSettings();
                }}
                className="w-full text-left p-1.5 hover:bg-[#FAF4E9] font-bold flex items-center gap-2"
              >
                {isPinEnabled ? <Lock size={13} className="text-[#E63B2E]" /> : <Unlock size={13} />}
                <span>{isPinEnabled ? 'PIN Lock Active' : 'Set 4-Digit PIN'}</span>
              </button>

              {isPinEnabled && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    lockApp();
                  }}
                  className="w-full text-left p-1.5 hover:bg-[#FAF4E9] text-[#E63B2E] font-bold flex items-center gap-2"
                >
                  <Lock size={13} />
                  <span>Lock App Now</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowMenu(false);
                  exportCsv();
                }}
                className="w-full text-left p-1.5 hover:bg-[#FAF4E9] font-bold flex items-center gap-2"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  if (confirm('Reset to 90 days of demo data?')) reseedDemoData();
                }}
                className="w-full text-left p-1.5 hover:bg-[#FAF4E9] text-[#F5B700] font-bold flex items-center gap-2 border-t border-[#14110F]/20 pt-1.5"
              >
                <RefreshCw size={13} />
                <span>Reseed 90-Day Demo</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
