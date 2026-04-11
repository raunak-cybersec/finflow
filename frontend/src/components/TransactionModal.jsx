import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORY_NAMES } from '../utils/helpers';
import api from '../api/axios';
import toast from 'react-hot-toast';

const DEFAULT_FORM = {
  description: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
};

const TransactionModal = ({ isOpen, onClose, transaction, onSaved }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/transactions/${transaction._id}`, form);
        toast.success('Transaction updated!');
      } else {
        await api.post('/transactions', form);
        toast.success('Transaction added!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Type toggle */}
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 8, display: 'block', fontWeight: 500 }}>Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  style={{
                    padding: '10px',
                    borderRadius: 10,
                    border: `1px solid ${form.type === t ? (t === 'expense' ? 'rgba(248,113,113,0.4)' : 'rgba(52,211,153,0.4)') : 'rgba(255,255,255,0.08)'}`,
                    background: form.type === t ? (t === 'expense' ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)') : 'rgba(255,255,255,0.04)',
                    color: form.type === t ? (t === 'expense' ? '#f87171' : '#34d399') : '#64748b',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {t === 'expense' ? '↓ Expense' : '↑ Income'}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Amount (₹)</label>
            <input
              className="input font-mono"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Description</label>
            <input
              className="input"
              type="text"
              placeholder="What was this for?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Date</label>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'inline-block' }} className="spin">⟳</span>
              ) : isEdit ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
