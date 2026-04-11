import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { formatCurrency, formatDate, exportToCSV, CATEGORY_NAMES } from '../utils/helpers';
import CategoryBadge from '../components/CategoryBadge';
import TransactionModal from '../components/TransactionModal';
import { Plus, Search, Download, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '', search: '' });
  const [page, setPage] = useState(1);
  const [allTxns, setAllTxns] = useState([]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const { data } = await api.get(`/transactions?${params}`);
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Fetch all for CSV export
  const handleExportCSV = async () => {
    try {
      const { data } = await api.get('/transactions?limit=1000');
      exportToCSV(data.transactions);
      toast.success('CSV downloaded!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      setDeleteConfirm(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFilterChange = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
            Transactions
          </h1>
          <p style={{ color: '#475569', fontSize: 14 }}>
            {pagination.total} transaction{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={handleExportCSV} id="export-csv">
            <Download size={15} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setEditTxn(null); setModalOpen(true); }} id="add-transaction">
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            id="search-input"
          />
        </div>

        {/* Type filter */}
        <select className="input" style={{ width: 140 }} value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} id="filter-type">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select className="input" style={{ width: 160 }} value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} id="filter-category">
          <option value="">All Categories</option>
          {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {(filters.type || filters.category || filters.search) && (
          <button className="btn btn-ghost" style={{ flexShrink: 0 }} onClick={() => { setFilters({ type: '', category: '', search: '' }); setPage(1); }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 130px 120px 90px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11,
          color: '#334155',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span style={{ textAlign: 'right' }}>Amount</span>
          <span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '2px solid rgba(129,140,248,0.2)', borderTopColor: '#818cf8',
              margin: '0 auto 12px', animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#475569', fontSize: 13 }}>Loading...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>📭</p>
            <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 6 }}>No transactions found</p>
            <p style={{ color: '#475569', fontSize: 13 }}>Try adjusting your filters or add a new transaction</p>
          </div>
        ) : transactions.map((t) => (
          <div key={t._id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 130px 120px 90px',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            alignItems: 'center',
            transition: 'background 0.15s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', marginBottom: 2 }}>{t.description}</p>
              <span
                className="badge"
                style={{
                  fontSize: 11,
                  background: t.type === 'income' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                  color: t.type === 'income' ? '#34d399' : '#f87171',
                  border: `1px solid ${t.type === 'income' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                }}
              >
                {t.type === 'income' ? '↑' : '↓'} {t.type}
              </span>
            </div>
            <CategoryBadge category={t.category} />
            <p style={{ fontSize: 12, color: '#475569' }}>{formatDate(t.date)}</p>
            <p className="font-mono" style={{
              fontSize: 14, fontWeight: 700, textAlign: 'right',
              color: t.type === 'income' ? '#34d399' : '#f87171',
            }}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button
                className="btn-icon"
                title="Edit"
                onClick={() => { setEditTxn(t); setModalOpen(true); }}
              >
                <Pencil size={14} />
              </button>
              <button
                className="btn-icon"
                title="Delete"
                onClick={() => setDeleteConfirm(t)}
                style={{ color: '#f87171' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ fontSize: 13, color: '#475569' }}>
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ padding: '8px 12px' }} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn btn-ghost" style={{ padding: '8px 12px' }} disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTxn(null); }}
        transaction={editTxn}
        onSaved={fetchTransactions}
      />

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>🗑️</p>
            <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', textAlign: 'center', marginBottom: 8 }}>
              Delete Transaction?
            </h3>
            <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
              "{deleteConfirm.description}" will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(deleteConfirm._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
