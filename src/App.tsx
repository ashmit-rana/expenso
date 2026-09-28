import React, { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Header } from './components/Header';
import { Navigation, type ActiveTab } from './components/Navigation';
import { SafeHeroCard } from './components/SafeHeroCard';
import { LedgerView } from './components/LedgerView';
import { BudgetsView } from './components/BudgetsView';
import { ChartsView } from './components/ChartsView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { InsightsView } from './components/InsightsView';
import { QuickAddModal } from './components/QuickAddModal';
import { SmsParserModal } from './components/SmsParserModal';
import { PinLockModal } from './components/PinLockModal';

const AppContent: React.FC = () => {
  const { isLocked } = useExpenses();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSmsParserOpen, setIsSmsParserOpen] = useState(false);
  const [isPinSettingsOpen, setIsPinSettingsOpen] = useState(false);

  // If app is locked with PIN, show full screen unlock
  if (isLocked) {
    return <PinLockModal mode="unlock" isOpen={true} />;
  }

  return (
    <div className="min-h-screen p-3 md:p-8 flex justify-center selection:bg-[#F5B700] selection:text-[#14110F]">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header with quick actions & month selector */}
        <Header
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenSmsParser={() => setIsSmsParserOpen(true)}
          onOpenPinSettings={() => setIsPinSettingsOpen(true)}
        />

        {/* Navigation Tabs */}
        <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Tab Content Views */}
        <main className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Daily Survival Quota Hero Card */}
              <SafeHeroCard />

              {/* Quick Ledger Preview (Latest 5 entries) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-['Bricolage_Grotesque'] font-black text-lg uppercase text-[#14110F]">
                    Recent Ledger Activity
                  </h3>
                  <button
                    onClick={() => setActiveTab('ledger')}
                    className="font-mono text-xs font-bold underline hover:text-[#E63B2E]"
                  >
                    View All Entries →
                  </button>
                </div>
                <LedgerView onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <LedgerView onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView />
          )}

          {activeTab === 'charts' && (
            <ChartsView />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsView />
          )}

          {activeTab === 'insights' && (
            <InsightsView />
          )}
        </main>

        {/* Footer */}
        <footer className="pt-6 pb-4 border-t-2 border-[#14110F]/20 text-center font-mono text-xs text-[#14110F]/60 flex flex-wrap justify-between items-center gap-2">
          <span>EXPENSO // STUDENT EXPENSE LEDGER</span>
          <span>100% LOCALSTORAGE PERSISTED • ZERO BACKEND</span>
        </footer>

        {/* Modals */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />

        <SmsParserModal
          isOpen={isSmsParserOpen}
          onClose={() => setIsSmsParserOpen(false)}
        />

        <PinLockModal
          mode="settings"
          isOpen={isPinSettingsOpen}
          onClose={() => setIsPinSettingsOpen(false)}
        />

      </div>
    </div>
  );
};

export function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
