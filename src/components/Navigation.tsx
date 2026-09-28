import React from 'react';
import { LayoutDashboard, ReceiptText, Target, PieChart, RefreshCcw, Lightbulb, Bot } from 'lucide-react';

export type ActiveTab = 'overview' | 'ledger' | 'budgets' | 'charts' | 'subscriptions' | 'insights' | 'ai';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'OVERVIEW', icon: <LayoutDashboard size={14} /> },
    { id: 'ledger' as ActiveTab, label: 'EXPENSE LEDGER', icon: <ReceiptText size={14} /> },
    { id: 'budgets' as ActiveTab, label: 'BUDGETS & CAPS', icon: <Target size={14} /> },
    { id: 'charts' as ActiveTab, label: 'ANALYTICS & HEATMAP', icon: <PieChart size={14} /> },
    { id: 'subscriptions' as ActiveTab, label: 'SUBSCRIPTIONS', icon: <RefreshCcw size={14} /> },
    { id: 'insights' as ActiveTab, label: 'INSIGHTS', icon: <Lightbulb size={14} /> },
    { id: 'ai' as ActiveTab, label: 'MUNSHI AI', icon: <Bot size={14} /> },
  ];

  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`btn-brutal px-3.5 py-2 font-['Bricolage_Grotesque'] font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all ${
              isActive
                ? 'bg-[#F5B700] text-[#14110F] shadow-[3.5px_3.5px_0px_#14110F]'
                : 'bg-[#FFFDF9] text-[#14110F] hover:bg-[#FAF4E9]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
