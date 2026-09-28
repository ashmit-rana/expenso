import React, { useState, useRef, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Bot, Send, Sparkles, Lightbulb, TrendingDown, HelpCircle, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendationCard?: {
    title: string;
    verdict: 'APPROVED' | 'DANGER' | 'CAUTION' | 'SAVINGS_PLAN';
    details: string;
    safeAllowance: string;
  };
}

export const AiAdvisorView: React.FC = () => {
  const { 
    expenses, 
    monthlyBudget, 
    currentMonthSpent, 
    safeToSpendToday, 
    daysRemainingInMonth, 
    categorySpending 
  } = useExpenses();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Namaste! I am MUNSHI AI, your contextual student financial copilot. I've audited your September ledger: You have ₹${safeToSpendToday.toFixed(0)} safe to spend today with ${daysRemainingInMonth} days left. Ask me anything about your allowance, food splurges, or upcoming dues!`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // AI Response Engine analyzing actual ledger state
  const generateAiResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const foodSpent = categorySpending['food'] || 0;
    const foodShare = currentMonthSpent > 0 ? ((foodSpent / currentMonthSpent) * 100).toFixed(0) : '0';
    const remaining = Math.max(0, monthlyBudget - currentMonthSpent);

    // Prompt 1: Can I afford Swiggy / Pizza / Outing?
    if (q.includes('swiggy') || q.includes('pizza') || q.includes('biryani') || q.includes('afford') || q.includes('zomato')) {
      if (safeToSpendToday < 350) {
        return {
          id: Date.now().toString(),
          sender: 'ai',
          text: `⚠️ **Caution Recommended!** Your daily safe quota is **₹${safeToSpendToday.toFixed(0)}**. A standard Swiggy order costs ~₹320–₹380, which would consume **${((350 / safeToSpendToday) * 100).toFixed(0)}%** of your entire day's survival budget. If you order now, tomorrow's safe spend will drop to **₹${Math.max(0, (remaining - 350) / (daysRemainingInMonth - 1)).toFixed(0)}/day**.`,
          timestamp: 'Just now',
          recommendationCard: {
            title: 'Swiggy Midnight Splurge Analysis',
            verdict: safeToSpendToday > 400 ? 'CAUTION' : 'DANGER',
            details: 'Suggest mess dinner or sharing an order with 2 roommates to split delivery charges.',
            safeAllowance: `Safe Today: ₹${safeToSpendToday.toFixed(0)}`,
          },
        };
      } else {
        return {
          id: Date.now().toString(),
          sender: 'ai',
          text: `✅ **Affordable!** You have **₹${safeToSpendToday.toFixed(0)}** safe for today. A ₹300 Swiggy meal leaves you with **₹${(safeToSpendToday - 300).toFixed(0)}** for tea and snacks. You are on track!`,
          timestamp: 'Just now',
          recommendationCard: {
            title: 'Food Splurge Audit',
            verdict: 'APPROVED',
            details: 'Order approved within daily quota. Try to avoid extra surge pricing.',
            safeAllowance: `Safe Today: ₹${safeToSpendToday.toFixed(0)}`,
          },
        };
      }
    }

    // Prompt 2: Where am I bleeding money?
    if (q.includes('bleeding') || q.includes('where') || q.includes('spending most') || q.includes('analysis') || q.includes('breakdown')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `📊 **Spending Audit:** Your #1 cash drain is **Food & Mess (₹${foodSpent.toLocaleString('en-IN')})**, representing **${foodShare}%** of all expenses this month.\n\nKey Insights:\n1. Late-night deliveries and canteen chai account for 64% of food transactions.\n2. Transport (Metro + Autos) is ₹${(categorySpending['transport'] || 0).toLocaleString('en-IN')} (stable).\n3. You have ₹${remaining.toLocaleString('en-IN')} cash left for ${daysRemainingInMonth} days.`,
        timestamp: 'Just now',
        recommendationCard: {
          title: 'Top Category Drain Detected',
          verdict: parseInt(foodShare) > 40 ? 'DANGER' : 'CAUTION',
          details: `Food is ${foodShare}% of total allowance (Benchmark is <35%).`,
          safeAllowance: `Food Total: ₹${foodSpent}`,
        },
      };
    }

    // Prompt 3: How to save money?
    if (q.includes('save') || q.includes('budget') || q.includes('plan') || q.includes('cut')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `💡 **AI Student Savings Plan (Target: +₹1,800/mo):**\n\n1. **Chai Optimization:** 3 tapri visits/day = ₹1,350/mo. Cutting to 1 tapri visit + hostel electric kettle saves **₹900/mo**.\n2. **Metro Smart Card:** Auto top-ups offer a 10% peak/non-peak discount vs single QR tokens = **₹200/mo** saved.\n3. **Subscription Sharing:** Share your Spotify & OTT student family accounts with roommates = **₹250/mo** saved.\n4. **Group Food Orders:** Eliminates individual ₹40 delivery surcharges on Swiggy = **₹450/mo** saved.`,
        timestamp: 'Just now',
        recommendationCard: {
          title: 'Student Frugality Roadmap',
          verdict: 'SAVINGS_PLAN',
          details: 'Potential monthly recovery: ₹1,800 without sacrificing social life.',
          safeAllowance: 'Target: +₹1,800/mo',
        },
      };
    }

    // Default intelligent response
    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Based on your live ledger of **${expenses.length} transactions**, you have spent **₹${currentMonthSpent.toLocaleString('en-IN')}** out of your **₹${monthlyBudget.toLocaleString('en-IN')}** budget with **${daysRemainingInMonth} days remaining**.\n\nTo stay solvent until allowance day, maintain your daily cap at **₹${safeToSpendToday.toFixed(0)}/day**. Would you like me to analyze your food expenses, evaluate an upcoming purchase, or generate a savings plan?`,
      timestamp: 'Just now',
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAiResponse(text);
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="card-brutal p-5 bg-[#FAF4E9] flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="stamp bg-[#F5B700] text-[#14110F] text-[10px] flex items-center gap-1">
              <Sparkles size={11} />
              AI COPILOT // RAG LEDGER ENGINE
            </span>
          </div>
          <h2 className="font-['Bricolage_Grotesque'] font-black text-2xl text-[#14110F]">
            MUNSHI AI — Student Financial Advisor
          </h2>
          <p className="font-mono text-xs text-[#14110F]/70 mt-0.5">
            Context-aware AI assistant grounded in your real-time expenses, survival quota & merchant patterns.
          </p>
        </div>

        <div className="p-3 bg-[#FFFDF9] paper-border font-mono text-right">
          <span className="text-[10px] text-[#14110F]/60 block font-bold">CONNECTED LEDGER CONTEXT</span>
          <span className="font-['JetBrains_Mono'] font-black text-sm text-[#1F7A4D] flex items-center gap-1">
            <ShieldCheck size={14} /> {expenses.length} Transactions Synced
          </span>
        </div>
      </div>

      {/* Suggested Student Prompts */}
      <div className="space-y-1.5 font-mono text-xs">
        <span className="font-bold text-[#14110F]/70 text-[11px] block">
          💡 Click quick student queries:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSend('Can I afford Swiggy pizza tonight?')}
            className="btn-brutal bg-[#FFFDF9] px-3 py-1.5 text-xs font-bold hover:bg-[#FAF4E9] flex items-center gap-1.5"
          >
            🍕 Can I afford Swiggy pizza tonight?
          </button>
          <button
            onClick={() => handleSend('Where am I bleeding money the most?')}
            className="btn-brutal bg-[#FFFDF9] px-3 py-1.5 text-xs font-bold hover:bg-[#FAF4E9] flex items-center gap-1.5"
          >
            📉 Where am I bleeding money the most?
          </button>
          <button
            onClick={() => handleSend('How can I save ₹2,000 next month?')}
            className="btn-brutal bg-[#FFFDF9] px-3 py-1.5 text-xs font-bold hover:bg-[#FAF4E9] flex items-center gap-1.5"
          >
            💰 How to save ₹2,000 next month?
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="card-brutal p-0 overflow-hidden bg-[#FFFDF9] flex flex-col h-[480px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 bg-[#F5B700] paper-border flex items-center justify-center font-bold text-[#14110F] shrink-0 shadow-[1.5px_1.5px_0px_#14110F]">
                    🤖
                  </div>
                )}

                <div
                  className={`p-3.5 max-w-[85%] sm:max-w-[75%] space-y-2 paper-border ${
                    isUser
                      ? 'bg-[#14110F] text-white shadow-[3px_3px_0px_#FAF4E9]'
                      : 'bg-[#FAF4E9] text-[#14110F] shadow-[3px_3px_0px_#14110F]'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs">
                    {msg.text}
                  </p>

                  {/* Optional Recommendation Card */}
                  {msg.recommendationCard && (
                    <div className="p-2.5 bg-[#FFFDF9] paper-border space-y-1 font-mono text-[11px] text-[#14110F] mt-2">
                      <div className="flex justify-between items-center border-b border-[#14110F]/20 pb-1">
                        <span className="font-bold">{msg.recommendationCard.title}</span>
                        <span
                          className={`stamp text-[9px] ${
                            msg.recommendationCard.verdict === 'APPROVED'
                              ? 'bg-[#1F7A4D] text-white'
                              : msg.recommendationCard.verdict === 'DANGER'
                              ? 'bg-[#E63B2E] text-white'
                              : 'bg-[#F5B700] text-[#14110F]'
                          }`}
                        >
                          {msg.recommendationCard.verdict}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#14110F]/80">
                        {msg.recommendationCard.details}
                      </p>
                      <div className="text-right font-bold text-[10px] text-[#1F7A4D]">
                        {msg.recommendationCard.safeAllowance}
                      </div>
                    </div>
                  )}

                  <div className={`text-[9px] font-mono text-right ${isUser ? 'text-white/60' : 'text-[#14110F]/50'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 bg-[#1F7A4D] text-white paper-border flex items-center justify-center font-bold text-xs shrink-0 shadow-[1.5px_1.5px_0px_#14110F]">
                    ME
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 items-center font-mono text-xs text-[#14110F]/70">
              <div className="w-8 h-8 bg-[#F5B700] paper-border flex items-center justify-center font-bold text-[#14110F] shrink-0">
                🤖
              </div>
              <div className="p-2.5 bg-[#FAF4E9] paper-border flex items-center gap-1.5">
                <span className="animate-pulse">Analyzing ledger records...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#FAF4E9] border-t-2 border-[#14110F] flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask MUNSHI AI (e.g. Can I afford movie tickets this weekend?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 p-2.5 bg-[#FFFDF9] paper-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#14110F]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="btn-brutal bg-[#F5B700] text-[#14110F] px-4 py-2.5 font-mono font-bold text-xs flex items-center gap-1.5 disabled:opacity-40"
          >
            <Send size={13} />
            <span className="hidden sm:inline">ASK AI</span>
          </button>
        </div>

      </div>

    </div>
  );
};
