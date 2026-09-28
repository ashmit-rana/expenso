import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { CategoryId, MerchantBrand } from '../types';
import { BrandIcon } from './BrandIcon';
import { Plus, Trash2, Check, Clock } from 'lucide-react';

export const SubscriptionsView: React.FC = () => {
  const { 
    subscriptions, 
    addSubscription, 
    toggleSubscription, 
    deleteSubscription 
  } = useExpenses();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDay, setBillingDay] = useState('5');
  const [brand, setBrand] = useState<MerchantBrand>('spotify');
  const category: CategoryId = 'subscriptions';

  const currentDay = 28; // reference day

  const totalMonthlyCommitment = subscriptions
    .filter(s => s.active)
    .reduce((sum, s) => sum + s.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(amount);
    if (!parsedAmt || parsedAmt <= 0) return;

    addSubscription({
      name: name.trim() || 'Subscription',
      amount: parsedAmt,
      billingDay: parseInt(billingDay) || 1,
      category,
      brand,
      paymentMode: 'UPI',
      active: true,
    });

    setName('');
    setAmount('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Monthly Summary Hero */}
      <div className="card-brutal p-5 bg-[#FAF4E9] flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="stamp bg-[#F5B700] text-[#14110F] text-[10px]">
              FIXED COMMITMENTS
            </span>
          </div>
          <h2 className="font-['Bricolage_Grotesque'] font-black text-2xl text-[#14110F]">
            Recurring Student Subscriptions
          </h2>
          <p className="font-mono text-xs text-[#14110F]/70 mt-0.5">
            {subscriptions.filter(s => s.active).length} active auto-debits tracked
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFFDF9] paper-border font-mono text-right">
            <span className="text-[10px] text-[#14110F]/60 uppercase block font-bold">Monthly Total</span>
            <span className="font-['JetBrains_Mono'] font-black text-2xl text-[#14110F]">
              ₹{totalMonthlyCommitment.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-[#14110F]/60">/mo</span>
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brutal bg-[#1F7A4D] text-white px-3.5 py-3 font-mono font-bold text-xs flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>+ NEW</span>
          </button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((sub) => {
          // Days until next renewal
          let daysLeft = sub.billingDay - currentDay;
          if (daysLeft < 0) daysLeft += 30; // next month

          const isImminent = daysLeft <= 3;

          return (
            <div
              key={sub.id}
              className={`card-brutal p-4 space-y-3 transition-all ${
                !sub.active
                  ? 'bg-[#FAF4E9]/50 opacity-60 border-dashed'
                  : isImminent
                  ? 'bg-[#FFFDF9] border-[#E63B2E] shadow-[4px_4px_0px_#E63B2E]'
                  : 'bg-[#FFFDF9]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <BrandIcon brand={sub.brand} category={sub.category} size="lg" />
                  <div>
                    <h3 className="font-['Bricolage_Grotesque'] font-bold text-base text-[#14110F]">
                      {sub.name}
                    </h3>
                    <p className="font-mono text-[10px] text-[#14110F]/60 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> Renews on day {sub.billingDay} of each month
                    </p>
                  </div>
                </div>

                <span className={`stamp text-[9px] ${
                  isImminent ? 'bg-[#E63B2E] text-white' : 'bg-[#1F7A4D] text-white'
                }`}>
                  {daysLeft === 0 ? 'DUE TODAY' : `IN ${daysLeft} DAYS`}
                </span>
              </div>

              {/* Price & Actions */}
              <div className="flex justify-between items-center pt-2 border-t-2 border-[#14110F]/10 font-mono text-xs">
                <div>
                  <span className="text-[#14110F]/60 block text-[9px]">COST</span>
                  <span className="font-['JetBrains_Mono'] font-black text-lg text-[#14110F]">
                    ₹{sub.amount.toFixed(2)}<span className="text-xs font-normal text-[#14110F]/60">/mo</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubscription(sub.id)}
                    className={`btn-brutal px-2.5 py-1 text-[10px] font-bold ${
                      sub.active ? 'bg-[#FAF4E9] text-[#14110F]' : 'bg-[#F5B700] text-[#14110F]'
                    }`}
                  >
                    {sub.active ? 'Active' : 'Paused'}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove subscription "${sub.name}"?`)) deleteSubscription(sub.id);
                    }}
                    className="p-1 text-[#14110F]/40 hover:text-[#E63B2E]"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#14110F]/70 flex items-center justify-center p-4 z-50">
          <div className="card-brutal p-6 bg-[#FAF4E9] max-w-md w-full space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] font-black text-lg uppercase text-[#14110F]">
              + Add Subscription
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block font-bold mb-1">SERVICE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spotify, WiFi Share, Mess Dues..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-[#FFFDF9] paper-border text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">MONTHLY COST (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 59"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 bg-[#FFFDF9] paper-border font-bold text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">BILLING DAY (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={billingDay}
                    onChange={(e) => setBillingDay(e.target.value)}
                    className="w-full p-2 bg-[#FFFDF9] paper-border font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">SERVICE BRAND</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as MerchantBrand)}
                  className="w-full p-2 bg-[#FFFDF9] paper-border font-bold text-xs focus:outline-none"
                >
                  <option value="spotify">Spotify</option>
                  <option value="youtube">YouTube</option>
                  <option value="netflix">Netflix</option>
                  <option value="mess">Hostel Mess</option>
                  <option value="generic">Other / WiFi</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t-2 border-[#14110F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-brutal bg-[#E6D9C0] px-4 py-2 font-bold text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-brutal bg-[#1F7A4D] text-white px-4 py-2 font-bold text-xs flex items-center gap-1"
                >
                  <Check size={14} />
                  <span>SAVE SUBSCRIPTION</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
