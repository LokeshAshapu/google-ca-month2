# FinFlow – Finance Dashboard

A modern, interactive personal finance dashboard built with React + Vite.

![Finance Dashboard](./public/vite.svg)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧩 Features

### 1. Dashboard Overview
- **Summary Cards** – Total Balance, Monthly Income, Monthly Expenses, Savings
- **Area Chart** – Income vs Expenses trend (6 months)
- **Donut Chart** – Spending breakdown by category for the current month
- **Recent Transactions** – Quick glance at latest 5 activity items

### 2. Transactions Page
- Full transaction list with **Date, Description, Category, Type, Amount**
- **Search** by description or category
- **Filter** by type (income/expense) and category
- **Sort** by date or amount (asc/desc)
- **Pagination** (12 per page)
- **Export to CSV**

### 3. Role-Based UI
- Switch between **Admin** and **Viewer** roles via the topbar dropdown
- **Admin**: Full CRUD – Add, Edit, Delete transactions
- **Viewer**: Read-only – All action buttons hidden
- No backend required; role is managed in frontend state

### 4. Insights Page
- Highest spending category
- Savings rate with qualitative feedback
- Month-over-month expense comparison
- 6-month bar chart (Income vs Expense)
- Net savings progress bars per month
- All-time category breakdown with progress bars
- Dynamic key observations based on real data

### 5. State Management
- **Zustand** with `localStorage` persistence
- Global state: transactions, filters, role, dark mode
- All filter/sort state survives page navigation

### 6. UI / UX
- **Dark mode** (default) with light mode toggle
- Fully responsive (desktop, tablet, mobile)
- Smooth animations and hover micro-interactions
- Empty state handling throughout
- Custom tooltip on all charts

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand (with persist middleware) |
| Charts | Recharts |
| Icons | Lucide React |
| Date Handling | date-fns |
| Styling | Vanilla CSS (custom design system) |
| Persistence | localStorage via Zustand middleware |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Root layout (sidebar + topbar + outlet)
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── Topbar.jsx          # Top bar with role switcher & dark mode
│   └── TransactionModal.jsx # Add/edit transaction modal
├── data/
│   └── mockData.js         # 6 months of mock transaction data
├── pages/
│   ├── Dashboard.jsx       # Overview page
│   ├── Transactions.jsx    # Transactions list page
│   └── Insights.jsx        # Financial insights page
├── store/
│   └── useStore.js         # Zustand global store
├── App.jsx                 # Router definition
├── main.jsx                # React entry point
└── index.css               # Design system + all styles
```

---

## 🎨 Design Decisions

- **Dark mode first**: Better readability for finance dashboards with high data density
- **Indigo accent color**: Professional but distinctive, avoids generic blue/green
- **Glassmorphism subtle touches**: On cards and sidebar for depth without visual noise
- **Consistent badge system**: Color-coded categories and transaction types for scanability
- **Mobile sidebar**: Slides in from left as an overlay on small screens

---

## 📝 Assumptions

- All monetary values are in USD
- "Total Balance" is the all-time cumulative net (income minus expenses)
- "Monthly Income/Expenses" refers to the current calendar month
- Savings rate is calculated on all-time data
- Mock data spans 6 months for realistic chart visualization

---

## ✅ Evaluation Criteria Coverage

| Criterion | Implementation |
|---|---|
| Design & Creativity | Custom dark/light theme, gradient accents, micro-animations |
| Responsiveness | Mobile-first CSS, responsive grid, slide-in mobile sidebar |
| Functionality | Dashboard, Transactions, RBAC, Insights all implemented |
| User Experience | Search/filter/sort, pagination, empty states, tooltips |
| Technical Quality | Component modularity, Zustand store, computed selectors |
| State Management | Zustand with persist, centralized filters and role |
| Documentation | This README |
| Attention to Detail | CSV export, dynamic observations, % changes, savings rate |
