import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

function money(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Insights({ transactions, darkMode }) {
  const cardStyle = darkMode ? { background: '#22263a', borderColor: '#333' } : {};
  const textMuted = { color: darkMode ? '#aaa' : '#999' };

  // ---- Monthly data for bar chart (last 6 months) ----
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });

    const income = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);

    months.push({ label, income, expense, net: income - expense });
  }

  // ---- Category totals ----
  const categoryTotals = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const totalExpenses = sortedCategories.reduce((s, [, v]) => s + v, 0);
  const highestCategory = sortedCategories[0];

  // ---- Overall savings rate ----
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;

  // ---- Month-over-month expense change ----
  const currentMonthExpense = months[months.length - 1]?.expense || 0;
  const prevMonthExpense = months[months.length - 2]?.expense || 0;
  const expenseChange = prevMonthExpense > 0
    ? ((currentMonthExpense - prevMonthExpense) / prevMonthExpense * 100)
    : 0;

  // ---- Build simple observations ----
  const observations = [];

  if (highestCategory) {
    const pct = ((highestCategory[1] / totalExpense) * 100).toFixed(0);
    observations.push({
      type: pct > 40 ? 'yellow' : 'green',
      text: `Your biggest spending category is "${highestCategory[0]}" at ${pct}% of total expenses (${money(highestCategory[1])}).`
    });
  }

  if (savingsRate > 20) {
    observations.push({ type: 'green', text: `Great job! You are saving ${savingsRate.toFixed(1)}% of your income — above the recommended 20%.` });
  } else if (savingsRate > 0) {
    observations.push({ type: 'yellow', text: `Your savings rate is ${savingsRate.toFixed(1)}%. Try to reach 20% by cutting unnecessary expenses.` });
  } else {
    observations.push({ type: 'red', text: `Your expenses exceed your income. You need to reduce spending.` });
  }

  if (expenseChange > 15) {
    observations.push({ type: 'yellow', text: `Expenses went up by ${expenseChange.toFixed(1)}% compared to last month. Review recent transactions.` });
  } else if (expenseChange < -10) {
    observations.push({ type: 'green', text: `Expenses dropped by ${Math.abs(expenseChange).toFixed(1)}% vs last month. Keep it up!` });
  }

  return (
    <div>
      {/* Insight Summary Cards */}
      <div className="insight-grid">
        <div className="insight-card" style={cardStyle}>
          <div className="insight-label" style={textMuted}>Highest Spending Category</div>
          <div className="insight-value">{highestCategory ? highestCategory[0] : '—'}</div>
          <div className="insight-sub" style={textMuted}>
            {highestCategory ? money(highestCategory[1]) : 'No data'}
          </div>
        </div>

        <div className="insight-card" style={cardStyle}>
          <div className="insight-label" style={textMuted}>Savings Rate</div>
          <div className="insight-value" style={{ color: savingsRate > 20 ? '#27ae60' : savingsRate > 0 ? '#f0b429' : '#e74c3c' }}>
            {savingsRate.toFixed(1)}%
          </div>
          <div className="insight-sub" style={textMuted}>
            {savingsRate > 20 ? '✓ Excellent!' : savingsRate > 0 ? 'Could be better' : 'Deficit'}
          </div>
        </div>

        <div className="insight-card" style={cardStyle}>
          <div className="insight-label" style={textMuted}>Expenses vs Last Month</div>
          <div className="insight-value" style={{ color: expenseChange > 0 ? '#e74c3c' : '#27ae60' }}>
            {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}%
          </div>
          <div className="insight-sub" style={textMuted}>
            {money(currentMonthExpense)} this month
          </div>
        </div>
      </div>

      {/* Bar Chart - Monthly Comparison */}
      <div className="card" style={cardStyle}>
        <div className="card-title">Monthly Income vs Expenses</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={months} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#f0f2f5'} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: darkMode ? '#aaa' : '#999' }} />
            <YAxis tick={{ fontSize: 12, fill: darkMode ? '#aaa' : '#999' }} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip formatter={v => money(v)} />
            <Bar dataKey="income" name="Income" fill="#27ae60" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#e74c3c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Net Savings per month */}
      <div className="card" style={cardStyle}>
        <div className="card-title">Net Savings Per Month</div>
        {months.map(m => {
          const maxNet = Math.max(...months.map(x => Math.abs(x.net)), 1);
          const pct = (Math.abs(m.net) / maxNet) * 100;
          const positive = m.net >= 0;
          return (
            <div key={m.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span style={textMuted}>{m.label}</span>
                <span style={{ fontWeight: 600, color: positive ? '#27ae60' : '#e74c3c' }}>
                  {positive ? '+' : '-'}{money(m.net)}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: positive ? '#27ae60' : '#e74c3c' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="card" style={cardStyle}>
        <div className="card-title">Spending by Category</div>
        {sortedCategories.length === 0 ? (
          <div className="empty">No expense data</div>
        ) : (
          sortedCategories.map(([name, amount]) => {
            const pct = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
            return (
              <div key={name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span>{name}</span>
                  <span style={{ fontWeight: 600 }}>{money(amount)} <span style={{ color: '#999', fontWeight: 400 }}>({pct.toFixed(1)}%)</span></span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: '#4f6ef7' }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Key Observations */}
      <div className="card" style={cardStyle}>
        <div className="card-title">💡 Key Observations</div>
        {observations.map((obs, i) => (
          <div key={i} className={`obs-box obs-${obs.type}`}>
            {obs.text}
          </div>
        ))}
      </div>
    </div>
  );
}
