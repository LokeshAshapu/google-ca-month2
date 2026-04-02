import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { CATEGORIES, INCOME_CATEGORIES } from '../data/mockData';

// Helper: format number as currency
function money(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper: get month name from date string
function getMonth(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short' });
}

// Colors for pie chart
const COLORS = ['#4f6ef7','#27ae60','#e74c3c','#f0b429','#9b59b6','#1abc9c','#e67e22'];

export default function Dashboard({ transactions, role, darkMode, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ---- Calculate summary numbers ----
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-04"

  const totalBalance = transactions.reduce((sum, t) =>
    t.type === 'income' ? sum + t.amount : sum - t.amount, 0
  );

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  // ---- Build chart data: last 6 months ----
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleString('en-US', { month: 'short' });

    const income = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);

    months.push({ label, income, expense });
  }

  // ---- Build pie chart data: expense by category ----
  const expenseByCategory = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const pieData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // ---- Recent 5 transactions ----
  const recent = transactions.slice(0, 5);

  const cardStyle = darkMode ? { background: '#22263a', borderColor: '#333' } : {};
  const textMuted = { color: darkMode ? '#aaa' : '#999' };

  return (
    <div>
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={cardStyle}>
          <div className="stat-label" style={textMuted}>Total Balance</div>
          <div className="stat-value" style={{ color: totalBalance >= 0 ? '#27ae60' : '#e74c3c' }}>
            {money(totalBalance)}
          </div>
          <div className="stat-sub" style={textMuted}>All time</div>
        </div>

        <div className="stat-card" style={cardStyle}>
          <div className="stat-label" style={textMuted}>Monthly Income</div>
          <div className="stat-value text-green">{money(monthlyIncome)}</div>
          <div className="stat-sub" style={textMuted}>This month</div>
        </div>

        <div className="stat-card" style={cardStyle}>
          <div className="stat-label" style={textMuted}>Monthly Expenses</div>
          <div className="stat-value text-red">{money(monthlyExpense)}</div>
          <div className="stat-sub" style={textMuted}>This month</div>
        </div>

        <div className="stat-card" style={cardStyle}>
          <div className="stat-label" style={textMuted}>Monthly Savings</div>
          <div className="stat-value" style={{ color: (monthlyIncome - monthlyExpense) >= 0 ? '#27ae60' : '#e74c3c' }}>
            {money(monthlyIncome - monthlyExpense)}
          </div>
          <div className="stat-sub" style={textMuted}>
            {(monthlyIncome - monthlyExpense) >= 0 ? '✓ Positive' : '✗ Deficit'}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="two-col">
        {/* Area Chart - Balance Trend */}
        <div className="card" style={cardStyle}>
          <div className="card-title">Income vs Expenses — Last 6 Months</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#f0f2f5'} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: darkMode ? '#aaa' : '#999' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#aaa' : '#999' }} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={v => money(v)} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#27ae60" fill="#e6f7f0" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#e74c3c" fill="#fdecea" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Spending by Category */}
        <div className="card" style={cardStyle}>
          <div className="card-title">Spending by Category</div>
          {pieData.length === 0 ? (
            <div className="empty">No expense data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => money(v)} />
                </PieChart>
              </ResponsiveContainer>
              {/* Category legend */}
              {pieData.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'inline-block' }} />
                  <span style={{ flex: 1, fontSize: 12, color: darkMode ? '#ccc' : '#555' }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{money(item.value)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card" style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>Recent Transactions</div>
          {role === 'admin' && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowModal(true); }}>
              + Add Transaction
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="empty">No transactions yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id}>
                  <td style={textMuted}>{t.date}</td>
                  <td>{t.description}</td>
                  <td><span className="badge" style={{ background: '#f0f2ff', color: '#4f6ef7' }}>{t.category}</span></td>
                  <td className={t.type === 'income' ? 'text-green' : 'text-red'} style={{ fontWeight: 600 }}>
                    {t.type === 'income' ? '+' : '-'}{money(t.amount)}
                  </td>
                  {role === 'admin' && (
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditItem(t); setShowModal(true); }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <TransactionModal
          existing={editItem}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editItem) onEdit(editItem.id, data);
            else onAdd(data);
            setShowModal(false);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// ---- Simple Add/Edit Modal Component ----
function TransactionModal({ existing, onClose, onSave, darkMode }) {
  const [form, setForm] = useState({
    description: existing?.description || '',
    amount: existing?.amount || '',
    category: existing?.category || CATEGORIES[0],
    type: existing?.type || 'expense',
    date: existing?.date || new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.description) { setError('Description is required'); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('Enter a valid amount'); return; }
    onSave({ ...form, amount: Number(form.amount) });
  }

  const allCategories = form.type === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  const boxStyle = darkMode ? { background: '#22263a', color: '#e0e4f0' } : {};

  return (
    <div className="modal-bg">
      <div className="modal-box" style={boxStyle}>
        <div className="modal-header">
          <h2>{existing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}

            {/* Type toggle */}
            <div className="form-group">
              <label>Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button"
                  className={`btn ${form.type === 'income' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setForm({ ...form, type: 'income', category: INCOME_CATEGORIES[0] })}
                >Income</button>
                <button type="button"
                  className={`btn ${form.type === 'expense' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setForm({ ...form, type: 'expense', category: CATEGORIES[0] })}
                >Expense</button>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Grocery Shopping" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Amount ($)</label>
                <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {allCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{existing ? 'Save Changes' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
