import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Lock, X } from 'lucide-react';

interface PinLockModalProps {
  mode: 'unlock' | 'settings';
  isOpen: boolean;
  onClose?: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({ mode, isOpen, onClose }) => {
  const { isPinEnabled, setPinLock, unlockApp } = useExpenses();

  const [enteredPin, setEnteredPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [enablePin, setEnablePin] = useState(isPinEnabled);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  // Unlock mode handler
  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          const ok = unlockApp(next);
          if (!ok) {
            setError(true);
            setEnteredPin('');
          } else {
            setError(false);
          }
        }, 150);
      }
    }
  };

  // Settings mode handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (enablePin && newPin.length !== 4) {
      alert('Please enter a 4-digit PIN');
      return;
    }
    setPinLock(enablePin ? newPin : '', enablePin);
    if (onClose) onClose();
  };

  if (mode === 'unlock') {
    return (
      <div className="fixed inset-0 bg-[#14110F] flex items-center justify-center p-4 z-50">
        <div className="card-brutal p-8 bg-[#FAF4E9] max-w-sm w-full space-y-6 text-center border-2 border-[#14110F]">
          
          <div className="mx-auto w-12 h-12 bg-[#F5B700] paper-border flex items-center justify-center">
            <Lock size={22} className="text-[#14110F]" />
          </div>

          <div>
            <h2 className="font-['Bricolage_Grotesque'] font-black text-2xl text-[#14110F]">
              EXPENSO LOCKED
            </h2>
            <p className="font-mono text-xs text-[#14110F]/70 mt-1">
              Enter your 4-digit security PIN to access the ledger
            </p>
          </div>

          {/* PIN Dots */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 paper-border rounded-full transition-all ${
                  enteredPin.length > i ? 'bg-[#14110F]' : 'bg-[#FFFDF9]'
                } ${error ? 'bg-[#E63B2E]' : ''}`}
              />
            ))}
          </div>

          {error && (
            <p className="font-mono text-xs font-bold text-[#E63B2E]">
              Incorrect PIN. Try again.
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 font-['JetBrains_Mono'] text-lg font-bold">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleDigit(num.toString())}
                className="btn-brutal bg-[#FFFDF9] py-3 text-[#14110F] hover:bg-[#FAF4E9]"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setEnteredPin('')}
              className="btn-brutal bg-[#E6D9C0] py-3 text-xs"
            >
              CLEAR
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="btn-brutal bg-[#FFFDF9] py-3 text-[#14110F] hover:bg-[#FAF4E9]"
            >
              0
            </button>
            <button
              onClick={() => setEnteredPin(p => p.slice(0, -1))}
              className="btn-brutal bg-[#E6D9C0] py-3 text-xs"
            >
              ⌫
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Settings Mode
  return (
    <div className="fixed inset-0 bg-[#14110F]/70 flex items-center justify-center p-4 z-50">
      <div className="card-brutal p-6 bg-[#FAF4E9] max-w-md w-full space-y-4 border-2 border-[#14110F]">
        <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-3">
          <h3 className="font-['Bricolage_Grotesque'] font-black text-lg uppercase text-[#14110F] flex items-center gap-2">
            <Lock size={16} /> 4-Digit PIN Lock Settings
          </h3>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:text-[#E63B2E]">
              <X size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between p-3 bg-[#FFFDF9] paper-border">
            <div>
              <span className="font-bold text-[#14110F] block">Enable App Security PIN</span>
              <span className="text-[10px] text-[#14110F]/60">Requires PIN upon app reload or manual lock</span>
            </div>
            <input
              type="checkbox"
              checked={enablePin}
              onChange={(e) => setEnablePin(e.target.checked)}
              className="w-4 h-4 accent-[#14110F]"
            />
          </div>

          {enablePin && (
            <div>
              <label className="block font-bold mb-1">ENTER 4-DIGIT PIN</label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="e.g. 1234"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF9] paper-border font-['JetBrains_Mono'] text-lg tracking-widest text-center focus:outline-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-[#14110F]">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn-brutal bg-[#E6D9C0] px-4 py-2 font-bold text-xs"
              >
                CANCEL
              </button>
            )}
            <button
              type="submit"
              className="btn-brutal bg-[#1F7A4D] text-white px-5 py-2 font-bold text-xs"
            >
              SAVE SETTINGS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
