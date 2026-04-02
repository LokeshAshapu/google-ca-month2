import { useState } from 'react';
import { CATEGORIES, INCOME_CATEGORIES } from '../data/mockData';

function money(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PAGE_SIZE = 10;

export default function Transactions({ transactions, role, darkMode, onAdd, onEdit, onDelete }) {
  // ---- Filter/Search State ----
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // ---- Modal State ----
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ---- Filter the transactions ----
  let filtered = [...transactions];

  if (search) {
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filterType !== 'all') {
    filtered = filtered.filter(t => t.type === filterType);
  }

  if (filterCategory !== 'all') {
    filtered = filtered.filter(t => t.category === filterCategory);
  }

  // ---- Sort ----
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'amount') { valA = Number(valA); valB = Number(valB); }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // ---- Pagination ----
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ---- Toggle sort ----
  function handleSort(col) {
    if (sortBy === col) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortOrder('desc'); }
    setPage(1);
  }

  // ---- Export CSV ----
  function exportCSV() {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount']];
    filtered.forEach(t => rows.push([t.date, t.description, t.category, t.type, t.amount]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'transactions.csv';
    a.click();
  }

  const cardStyle = darkMode ? { background: '#22263a', borderColor: '#333' } : {};
  const inputStyle = darkMode ? { background: '#2a2f45', borderColor: '#444', color: '#e0e4f0' } : {};

  // Summary of filtered results
  const totalIn = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      {/* Filters row */}
      <div className="filters" style={cardStyle}>
        <input
          className="search-input"
          placeholder="Search by name or category..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={inputStyle}
        />

        <select className="filter-select" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} style={inputStyle}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="filter-select" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} style={inputStyle}>
          <option value="all">All Categories</option>
          {[...CATEGORIES, ...INCOME_CATEGORIES].map(c => <option key={c}>{c}</option>)}
        </select>

        <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setFilterType('all'); setFilterCategory('all'); setSortBy('date'); setSortOrder('desc'); setPage(1); }}>
          Reset
        </button>

        <button className="btn btn-outline btn-sm" onClick={exportCSV}>⬇ Export CSV</button>

        {role === 'admin' && (
          <button className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowModal(true); }}>
            + Add
          </button>
        )}
      </div>

      {/* Summary line */}
      <div style={{ marginBottom: 12, fontSize: 13, color: darkMode ? '#aaa' : '#777' }}>
        Showing <strong style={{ color: darkMode ? '#fff' : '#333' }}>{filtered.length}</strong> transactions &nbsp;|&nbsp;
        <span className="text-green">In: {money(totalIn)}</span> &nbsp;
        <span className="text-red">Out: {money(totalOut)}</span>
      </div>

      {/* Table */}
      <div className="table-wrap" style={cardStyle}>
        {paginated.length === 0 ? (
          <div className="empty">No transactions found. Try changing your filters.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')}>Date {sortBy === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => handleSort('amount')}>Amount {sortBy === 'amount' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map(t => (
                <tr key={t.id}>
                  <td style={{ color: darkMode ? '#aaa' : '#999' }}>{t.date}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className="badge" style={{ background: '#f0f2ff', color: '#4f6ef7' }}>{t.category}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${t.type}`}>{t.type}</span>
                  </td>
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

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <span>Page {page} of {totalPages} · {filtered.length} results</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
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

// ---- Modal for Add/Edit ----
function Modal({ existing, onClose, onSave, darkMode }) {
  const [form, setForm] = useState({
    description: existing?.description || '',
    amount: existing?.amount || '',
    category: existing?.category || CATEGORIES[0],
    type: existing?.type || 'expense',
    date: existing?.date || new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!form.description) { setError('Please enter a description'); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('Please enter a valid amount'); return; }
    onSave({ ...form, amount: Number(form.amount) });
  }

  const cats = form.type === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  const boxStyle = darkMode ? { background: '#22263a', color: '#e0e4f0' } : {};

  return (
    <div className="modal-bg">
      <div className="modal-box" style={boxStyle}>
        <div className="modal-header">
          <h2>{existing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            {error && <p className="error" style={{ marginBottom: 10 }}>{error}</p>}

            <div className="form-group">
              <label>Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className={`btn ${form.type === 'income' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setForm({ ...form, type: 'income', category: INCOME_CATEGORIES[0] })}>Income</button>
                <button type="button" className={`btn ${form.type === 'expense' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setForm({ ...form, type: 'expense', category: CATEGORIES[0] })}>Expense</button>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Grocery Shopping" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Amount ($)</label>
                <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{existing ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
