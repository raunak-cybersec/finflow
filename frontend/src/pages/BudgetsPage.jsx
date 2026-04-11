import { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatCurrency, CATEGORIES, CATEGORY_NAMES } from '../utils/helpers';
import { Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Other'];

const BudgetCard = ({ category, budget, spent }) => {
  const cat = CATEGORIES[category] || CATEGORIES['Other'];
  const limit = budget?.monthlyLimit || 0;
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver = spent > limit && limit > 0;
  const remaining = limit - spent;
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(limit);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!inputVal || parseFloat(inputVal) < 0) {
      toast.error('Enter a valid budget amount');
      return;
    }
    setSaving(true);
    try {
      await api.put('/budgets', { category, monthlyLimit: parseFloat(inputVal) });
      toast.success(`${category} budget updated!`);
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass glass-hover" style={{ padding: 20 }}>
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: cat.bg, border: `1px solid ${cat.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            {cat.icon}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{category}</p>
            <p style={{ fontSize: 11, color: '#475569' }}>
              Spent: <span className="font-mono" style={{ color: isOver ? '#f87171' : '#94a3b8' }}>{formatCurrency(spent)}</span>
            </p>
          </div>
        </div>

        {/* Budget limit edit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {editing ? (
            <>
              <span style={{ fontSize: 13, color: '#64748b' }}>₹</span>
              <input
                className="input font-mono"
                type="number"
                min="0"
                step="100"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{ width: 90, padding: '5px 8px', fontSize: 13 }}
                autoFocus
              />
              <button className="btn-icon" style={{ color: '#34d399' }} onClick={handleSave} disabled={saving}>
                <Check size={14} />
              </button>
              <button className="btn-icon" onClick={() => { setEditing(false); setInputVal(limit); }}>
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <p className="font-mono" style={{ fontSize: 14, color: '#94a3b8' }}>
                {limit > 0 ? formatCurrency(limit) : 'No limit set'}
              </p>
              <button className="btn-icon" onClick={() => setEditing(true)} title="Edit budget">
                <Pencil size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track" style={{ marginBottom: 10 }}>
        <div
          className={`progress-bar-fill${isOver ? ' danger' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: '#475569' }}>
          {Math.round(pct)}% used
        </p>
        {limit > 0 ? (
          <p style={{ fontSize: 12, fontWeight: 600, color: isOver ? '#f87171' : '#34d399' }}>
            {isOver
              ? `₹${Math.abs(remaining).toLocaleString('en-IN')} over budget`
              : `₹${remaining.toLocaleString('en-IN')} remaining`}
          </p>
        ) : (
          <p style={{ fontSize: 12, color: '#334155' }}>Click ✏️ to set a limit</p>
        )}
      </div>

      {/* Overspend alert */}
      {isOver && (
        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.2)',
          fontSize: 12, color: '#f87171',
        }}>
          ⚠️ You've exceeded your {category} budget by {formatCurrency(Math.abs(remaining))}
        </div>
      )}
    </div>
  );
};

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [budgetRes, txRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/transactions?limit=500'),
      ]);
      setBudgets(budgetRes.data.budgets);
      setTransactions(txRes.data.transactions);
    } catch (err) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Current month spent by category
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const spentByCategory = {};
  transactions
    .filter((t) => t.type === 'expense' && new Date(t.date) >= startOfMonth)
    .forEach((t) => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
    });

  const getBudgetFor = (cat) => budgets.find((b) => b.category === cat);

  const totalBudget = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalSpent = Object.values(spentByCategory).reduce((s, v) => s + v, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(129,140,248,0.2)', borderTopColor: '#818cf8',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="page-enter" style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
          Budget Tracker
        </h1>
        <p style={{ color: '#475569', fontSize: 14 }}>{monthName} — Set limits and track your spending</p>
      </div>

      {/* Summary card */}
      {totalBudget > 0 && (
        <div className="glass" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Overall budget usage this month</p>
              <p className="font-mono" style={{ fontSize: 22, fontWeight: 700, color: totalSpent > totalBudget ? '#f87171' : '#e2e8f0' }}>
                {formatCurrency(totalSpent)} <span style={{ fontSize: 14, color: '#475569' }}>/ {formatCurrency(totalBudget)}</span>
              </p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: totalSpent > totalBudget ? '#f87171' : '#34d399' }} className="font-mono">
              {Math.round((totalSpent / totalBudget) * 100)}%
            </p>
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill${totalSpent > totalBudget ? ' danger' : ''}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Budget cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {EXPENSE_CATEGORIES.map((cat) => (
          <BudgetCard
            key={cat}
            category={cat}
            budget={getBudgetFor(cat)}
            spent={spentByCategory[cat] || 0}
          />
        ))}
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: '#334155', textAlign: 'center' }}>
        💡 Click the pencil icon on any card to set or update your monthly budget limit
      </p>
    </div>
  );
};

export default BudgetsPage;
