# 💸 EXPENSO — Student Expense Ledger

> A zero-friction, neo-brutalist student expense tracker and daily financial survival ledger built for Indian college students.

![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-teal?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ⚡ Core Features

1. **Daily Survival Quota Hero Card:**
   - Auto-calculates `Safe to Spend Today = (Monthly Budget - Spent) ÷ Days Remaining in Month`.
2. **Instant UPI / Bank SMS Paste-Parser:**
   - Client-side regex engine extracting amounts, timestamps, and merchants from HDFC, SBI, Paytm, GPay SMS in <2ms with zero AI latency and 100% privacy.
3. **Category Limits & Danger Gauges:**
   - Visual progress bars automatically turning **Chili Red (`#E63B2E`)** when spending passes `>80%`.
4. **Visual Merchant Brand Anchors:**
   - High-contrast visual badges for Swiggy, Zomato, Uber, Ola, Delhi Metro (DMRC), Spotify, YouTube, Netflix, Campus Xerox, and Chai Tapri.
5. **Interactive Recharts Analytics:**
   - Category share Donut chart, 14-day spend velocity bar chart, and 30-day activity calendar heatmap.
6. **Recurring Subscriptions Tracker:**
   - Days-remaining renewal countdown badges (`IN 4 DAYS`, `IN 2 DAYS ⚠️`) and monthly commitment sum.
7. **Rule-Based Smart Insights:**
   - Real-time heuristics analyzing food spend dominance, week-over-week surges, and projected cash run-out dates.
8. **Security & Data Sovereignty:**
   - Optional 4-Digit PIN lock screen, 1-click CSV audit trail export, and 90-day Indian student demo data reseeder.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd expenso
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🎨 Design Tokens (Neo-Brutalist Paper Ledger)
- **Paper Background:** `#F3EAD7`
- **Ink Text & Borders:** `#14110F` (2px borders, 3.5px hard drop shadows)
- **Chili Red (Danger >80%):** `#E63B2E`
- **Marigold (Primary Attention):** `#F5B700`
- **Leaf Green (Safe Pace):** `#1F7A4D`
- **Typography:** *Bricolage Grotesque* (Headings) & *JetBrains Mono* (Amounts & Metrics)

---

## 📄 License
MIT License. Built with ❤️ for college students.
