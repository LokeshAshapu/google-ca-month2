import { useState } from 'react';
import { TRANSACTIONS } from './data/mockData';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

// Simple nav icons as text/emoji so no extra imports needed
const PAGES = ['Dashboard', 'Transactions', 'Insights'];

export default function App() {
  // ---- App-wide state ----
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [role, setRole] = useState('admin');        // 'admin' or 'viewer'
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState(TRANSACTIONS);

  // ---- Transaction actions (only admin can use these) ----
  function addTransaction(txn) {
    const newTxn = { ...txn, id: Date.now() };
    setTransactions([newTxn, ...transactions]);
  }

  function editTransaction(id, updated) {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
  }

  function deleteTransaction(id) {
    setTransactions(transactions.filter(t => t.id !== id));
  }

  // ---- Render ----
  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`} style={darkMode ? { background: '#1a1d2e', color: '#e0e4f0', minHeight: '100vh' } : {}}>

      {/* Sidebar Navigation */}
      <aside className="sidebar" style={darkMode ? { background: '#22263a', borderColor: '#333' } : {}}>
        <div className="sidebar-logo">💰 FinFlow</div>

        {PAGES.map(page => (
          <button
            key={page}
            className={`nav-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
            style={darkMode ? { color: currentPage === page ? '#4f6ef7' : '#ccc' } : {}}
          >
            {page === 'Dashboard'    && '📊'}
            {page === 'Transactions' && '💳'}
            {page === 'Insights'     && '💡'}
            {' '}{page}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <div className="main">

        {/* Top Bar */}
        <div
          className="topbar"
          style={darkMode ? { background: '#22263a', borderColor: '#333', color: '#e0e4f0' } : {}}
        >
          <div>
            <h1>{currentPage}</h1>
            <p>
              {currentPage === 'Dashboard'    && "Overview of your finances"}
              {currentPage === 'Transactions' && "View and manage all transactions"}
              {currentPage === 'Insights'     && "Spending patterns and observations"}
            </p>
          </div>

          <div className="topbar-controls">
            {/* Role Switcher */}
            <select
              className="role-select"
              value={role}
              onChange={e => setRole(e.target.value)}
              style={darkMode ? { background: '#2a2f45', color: '#e0e4f0', borderColor: '#444' } : {}}
            >
              <option value="admin">👤 Admin</option>
              <option value="viewer">👁 Viewer</option>
            </select>

            {/* Dark Mode Toggle */}
            <button
              className="theme-btn"
              onClick={() => setDarkMode(!darkMode)}
              style={darkMode ? { background: '#2a2f45', color: '#e0e4f0', borderColor: '#444' } : {}}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="page">
          {currentPage === 'Dashboard' && (
            <Dashboard
              transactions={transactions}
              role={role}
              darkMode={darkMode}
              onAdd={addTransaction}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {currentPage === 'Transactions' && (
            <Transactions
              transactions={transactions}
              role={role}
              darkMode={darkMode}
              onAdd={addTransaction}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {currentPage === 'Insights' && (
            <Insights
              transactions={transactions}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
