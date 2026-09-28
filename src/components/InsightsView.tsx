import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Lightbulb } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { insights, currentMonthSpent, monthlyBudget } = useExpenses();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-brutal p-5 bg-[#FAF4E9] flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="stamp bg-[#F5B700] text-[#14110F] text-[10px] mb-1">
            RULES ENGINE // OFFLINE
          </span>
          <h2 className="font-['Bricolage_Grotesque'] font-black text-2xl text-[#14110F]">
            Student Financial Diagnostics
          </h2>
          <p className="font-mono text-xs text-[#14110F]/70 mt-0.5">
            Rule-based heuristics analyzing category share, week-over-week trends & run-out projections.
          </p>
        </div>

        <div className="p-3 bg-[#FFFDF9] paper-border font-mono text-right">
          <span className="text-[10px] text-[#14110F]/60 block font-bold">MONTHLY BURN RATIO</span>
          <span className="font-['JetBrains_Mono'] font-black text-xl text-[#E63B2E]">
            {((currentMonthSpent / monthlyBudget) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {insights.map((item) => {
          const isDanger = item.type === 'danger';
          const isWarning = item.type === 'warning';

          return (
            <div
              key={item.id}
              className={`card-brutal p-5 space-y-2 bg-[#FFFDF9] transition-all ${
                isDanger
                  ? 'border-[#E63B2E] shadow-[4px_4px_0px_#E63B2E]'
                  : isWarning
                  ? 'border-[#F5B700] shadow-[4px_4px_0px_#F5B700]'
                  : 'border-[#1F7A4D]'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {isDanger ? '🚨' : isWarning ? '🍔' : '✅'}
                  </span>
                  <div>
                    <h3 className="font-['Bricolage_Grotesque'] font-black text-base text-[#14110F]">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {item.metric && (
                  <span className={`stamp text-[9px] ${
                    isDanger ? 'bg-[#E63B2E] text-white' : isWarning ? 'bg-[#F5B700] text-[#14110F]' : 'bg-[#1F7A4D] text-white'
                  }`}>
                    {item.metric}
                  </span>
                )}
              </div>

              <p className="font-sans text-xs text-[#14110F]/80 leading-relaxed pt-1">
                {item.message}
              </p>
            </div>
          );
        })}

        {/* Actionable Student Advice Card */}
        <div className="card-brutal p-5 bg-[#FFFDF9] space-y-3">
          <h4 className="font-['Bricolage_Grotesque'] font-black text-base uppercase text-[#14110F] flex items-center gap-2">
            <Lightbulb size={16} className="text-[#F5B700]" />
            Student Frugality Heuristics:
          </h4>
          <ul className="list-disc list-inside font-mono text-xs text-[#14110F]/80 space-y-1.5">
            <li><strong>The Tapri Rule:</strong> 3 chai runs a day = ₹45/day = ₹1,350/mo. Consider buying a shared kettle for the hostel wing.</li>
            <li><strong>Swiggy Midnight Surcharge:</strong> Ordering post 11:30 PM carries higher delivery surge. Group orders with floor-mates to split delivery.</li>
            <li><strong>Metro Smart Card Cashback:</strong> Auto top-up via DMRC app earns 10% peak/non-peak discount vs single paper QR tokens.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
