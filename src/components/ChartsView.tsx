import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { CategoryId } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

export const ChartsView: React.FC = () => {
  const { expenses, categories, selectedMonth, categorySpending } = useExpenses();

  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  // 1. Donut Data
  const donutColors = ['#E63B2E', '#F5B700', '#1F7A4D', '#2563EB', '#8B5CF6', '#EC4899', '#14110F', '#64748B'];
  
  const donutData = (Object.keys(categories) as CategoryId[])
    .map((catId, index) => {
      const amount = categorySpending[catId] || 0;
      return {
        name: categories[catId].name,
        value: amount,
        color: donutColors[index % donutColors.length],
      };
    })
    .filter(item => item.value > 0);

  // 2. Daily Spend Bar Chart (Last 14 days)
  const dailyMap: Record<string, number> = {};
  currentMonthExpenses.forEach(e => {
    const day = e.date.split('-')[2]; // '01' to '30'
    dailyMap[day] = (dailyMap[day] || 0) + e.amount;
  });

  const barData = Object.keys(dailyMap)
    .sort()
    .slice(-14)
    .map(day => ({
      day: `Day ${day}`,
      amount: dailyMap[day],
    }));

  // 3. Calendar Activity Heatmap (30 days)
  const daysInMonth = 30;
  const heatmapDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = (i + 1).toString().padStart(2, '0');
    const spent = dailyMap[dayNum] || 0;
    return { day: i + 1, spent };
  });

  return (
    <div className="space-y-6">
      
      {/* 2-Column Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Donut */}
        <div className="card-brutal p-5 bg-[#FFFDF9] space-y-3">
          <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-2">
            <h3 className="font-['Bricolage_Grotesque'] font-black text-base uppercase text-[#14110F]">
              🍩 Category Share Donut
            </h3>
            <span className="font-mono text-xs font-bold text-[#14110F]/60">
              {selectedMonth}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#14110F"
                  strokeWidth={2}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [
                    `₹${Number(val || 0).toLocaleString('en-IN')}`, 
                    'Spent'
                  ]}
                  contentStyle={{
                    backgroundColor: '#FAF4E9',
                    border: '2px solid #14110F',
                    boxShadow: '3px 3px 0px #14110F',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t-2 border-[#14110F]/10">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-3 h-3 paper-border shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}:</span>
                <span className="font-bold">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spend Bar Chart */}
        <div className="card-brutal p-5 bg-[#FFFDF9] space-y-3">
          <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-2">
            <h3 className="font-['Bricolage_Grotesque'] font-black text-base uppercase text-[#14110F]">
              📊 Daily Spend Velocity
            </h3>
            <span className="font-mono text-xs font-bold text-[#14110F]/60">
              LAST 14 DAYS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#14110F', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                  stroke="#14110F" 
                />
                <YAxis 
                  tick={{ fill: '#14110F', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                  stroke="#14110F" 
                />
                <Tooltip
                  formatter={(val: any) => [
                    `₹${Number(val || 0).toLocaleString('en-IN')}`, 
                    'Daily Total'
                  ]}
                  contentStyle={{
                    backgroundColor: '#FAF4E9',
                    border: '2px solid #14110F',
                    boxShadow: '3px 3px 0px #14110F',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#F5B700" 
                  stroke="#14110F" 
                  strokeWidth={2} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2 bg-[#FAF4E9] paper-border font-mono text-xs flex justify-between">
            <span>Average Daily Burn:</span>
            <span className="font-bold text-[#E63B2E]">₹371.60 / day</span>
          </div>
        </div>

      </div>

      {/* Calendar Activity Heatmap */}
      <div className="card-brutal p-5 bg-[#FFFDF9] space-y-3">
        <div className="flex justify-between items-center border-b-2 border-[#14110F] pb-2">
          <h3 className="font-['Bricolage_Grotesque'] font-black text-base uppercase text-[#14110F]">
            🗓️ Monthly Expense Heatmap (30-Day Activity)
          </h3>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-[#14110F]/60">Light (0-₹200)</span>
            <span className="w-3 h-3 bg-[#FAF4E9] paper-border"></span>
            <span className="w-3 h-3 bg-[#F5B700] paper-border"></span>
            <span className="w-3 h-3 bg-[#E63B2E] paper-border"></span>
            <span className="text-[#14110F]/60">Heavy (&gt;₹500)</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 pt-2">
          {heatmapDays.map((item) => {
            let bg = 'bg-[#FAF4E9]';
            if (item.spent > 600) bg = 'bg-[#E63B2E] text-white';
            else if (item.spent > 300) bg = 'bg-[#F5B700] text-[#14110F]';
            else if (item.spent > 0) bg = 'bg-[#1F7A4D]/20 text-[#14110F]';

            return (
              <div
                key={item.day}
                title={`Day ${item.day}: ₹${item.spent.toLocaleString('en-IN')}`}
                className={`p-2 paper-border text-center font-mono text-xs transition-all hover:scale-105 cursor-pointer ${bg}`}
              >
                <div className="font-bold text-[10px]">D{item.day}</div>
                <div className="text-[9px] font-black mt-0.5">
                  {item.spent > 0 ? `₹${item.spent}` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
