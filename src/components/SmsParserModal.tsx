import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { parseBankSms, type ParsedSmsResult } from '../utils/smsParser';
import { BrandIcon } from './BrandIcon';
import { Zap, Check, X } from 'lucide-react';

interface SmsParserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsParserModal: React.FC<SmsParserModalProps> = ({ isOpen, onClose }) => {
  const { addExpense } = useExpenses();
  const [smsText, setSmsText] = useState('');
  const [parsed, setParsed] = useState<ParsedSmsResult | null>(null);

  if (!isOpen) return null;

  const handleParse = (textToParse?: string) => {
    const text = textToParse !== undefined ? textToParse : smsText;
    if (!text.trim()) return;
    const res = parseBankSms(text);
    setParsed(res);
  };

  const handlePresetSample = (type: 'swiggy' | 'uber' | 'metro' | 'spotify' | 'tapri') => {
    let sample = '';
    if (type === 'swiggy') {
      sample = "Sent Rs.349.00 from HDFC Bank AC **4821 to SWIGGY on 28-09-26 via UPI Ref 629103847291. Avail Bal: Rs.4120.00";
    } else if (type === 'uber') {
      sample = "Dear SBI User, A/C 9182 debited by Rs.140.00 on 28Sep26 transfer to UBER INDIA UPI Ref 92837418293.";
    } else if (type === 'metro') {
      sample = "Rs.200.00 debited from ICICI Bank XX1092 on 28-09-2026 for DMRC Metro Recharge UPI.";
    } else if (type === 'spotify') {
      sample = "Dear Customer, Rs.59.00 debited for Spotify Premium Student plan on 28-09-2026.";
    } else if (type === 'tapri') {
      sample = "Paid Rs.45.00 to SHRI GANESH TAPRI via Paytm UPI on 28-09-2026.";
    }
    setSmsText(sample);
    handleParse(sample);
  };

  const handleCommit = () => {
    if (!parsed || parsed.amount <= 0) return;

    addExpense({
      amount: parsed.amount,
      category: parsed.category,
      note: parsed.merchantName,
      date: parsed.date,
      paymentMode: parsed.paymentMode,
      brand: parsed.brand,
      sourceSms: parsed.rawText,
    });

    setSmsText('');
    setParsed(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#14110F]/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
      <div className="card-brutal p-6 bg-[#FAF4E9] max-w-lg w-full space-y-4 border-2 border-[#14110F]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#F5B700] text-[#14110F] font-['Bricolage_Grotesque'] font-black px-2 py-0.5 paper-border text-xs flex items-center gap-1">
              <Zap size={12} />
              UPI REGEX
            </span>
            <h3 className="font-['Bricolage_Grotesque'] font-extrabold text-lg uppercase text-[#14110F]">
              Bank / UPI SMS Paste-Parser
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:text-[#E63B2E] transition-colors">
            <X size={18} />
          </button>
        </div>

        <p className="font-sans text-xs text-[#14110F]/80 leading-relaxed">
          Paste any GPay, Paytm, PhonePe, or Bank debit notification. Our client-side regex engine extracts amount, merchant, and auto-tags category with zero latency.
        </p>

        {/* Text Area */}
        <textarea
          rows={3}
          value={smsText}
          onChange={(e) => {
            setSmsText(e.target.value);
            handleParse(e.target.value);
          }}
          placeholder="Paste SMS here: e.g. 'Dear user, A/C *1234 debited by Rs.185.00 to SWIGGY on 28-Sep-26...'"
          className="w-full p-3 bg-[#FFFDF9] paper-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#14110F]"
        />

        {/* Student Preset Samples */}
        <div className="space-y-1.5 font-mono text-xs">
          <span className="font-bold text-[11px] text-[#14110F]/70 block">
            Click sample to test:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handlePresetSample('swiggy')}
              className="btn-brutal bg-[#FFFDF9] px-2 py-1 text-[11px] font-bold flex items-center gap-1"
            >
              <BrandIcon brand="swiggy" size="sm" /> Swiggy ₹349
            </button>
            <button
              onClick={() => handlePresetSample('metro')}
              className="btn-brutal bg-[#FFFDF9] px-2 py-1 text-[11px] font-bold flex items-center gap-1"
            >
              <BrandIcon brand="metro" size="sm" /> Metro ₹200
            </button>
            <button
              onClick={() => handlePresetSample('tapri')}
              className="btn-brutal bg-[#FFFDF9] px-2 py-1 text-[11px] font-bold flex items-center gap-1"
            >
              <BrandIcon brand="tapri" size="sm" /> Chai ₹45
            </button>
            <button
              onClick={() => handlePresetSample('spotify')}
              className="btn-brutal bg-[#FFFDF9] px-2 py-1 text-[11px] font-bold flex items-center gap-1"
            >
              <BrandIcon brand="spotify" size="sm" /> Spotify ₹59
            </button>
          </div>
        </div>

        {/* Parse Result Card */}
        {parsed && parsed.amount > 0 && (
          <div className="p-4 bg-[#FFFDF9] paper-border space-y-3 font-mono text-xs shadow-[2px_2px_0px_#14110F]">
            <div className="flex justify-between items-center border-b-2 border-[#14110F]/10 pb-2">
              <span className="font-bold text-[#1F7A4D] flex items-center gap-1">
                <Check size={14} /> EXTRACTED DETAILS
              </span>
              <span className="stamp bg-[#1F7A4D] text-white text-[9px]">CONFIDENCE HIGH</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-[#FAF4E9] paper-border">
                <span className="text-[#14110F]/60 block text-[9px] uppercase">Amount</span>
                <span className="font-black text-sm text-[#E63B2E]">₹{parsed.amount.toFixed(2)}</span>
              </div>
              <div className="p-2 bg-[#FAF4E9] paper-border">
                <span className="text-[#14110F]/60 block text-[9px] uppercase">Merchant</span>
                <span className="font-bold text-xs truncate block">{parsed.merchantName}</span>
              </div>
              <div className="p-2 bg-[#FAF4E9] paper-border">
                <span className="text-[#14110F]/60 block text-[9px] uppercase">Category</span>
                <span className="font-bold text-xs uppercase text-[#1F7A4D]">{parsed.category}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleCommit}
                className="btn-brutal bg-[#1F7A4D] text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>+ COMMIT TO EXPENSO LEDGER</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t-2 border-[#14110F]">
          <button
            onClick={onClose}
            className="btn-brutal bg-[#E6D9C0] px-4 py-2 font-mono font-bold text-xs"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
