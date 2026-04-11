import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { formatCurrency, formatShortDate, CATEGORIES } from '../utils/helpers';
import SpendingLineChart from '../components/charts/SpendingLineChart';
import ExpenseDonutChart from '../components/charts/ExpenseDonutChart';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, RefreshCw } from 'lucide-react';
import { format, subDays } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <div className="glass glass-hover" style={{ padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</p>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${color}22`,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <p className="stat-card-value" style={{ color }}>{value}</p>
    {subtitle && (
      <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{subtitle}</p>
    )}
  </div>
);

const InsightCard = ({ insight }) => {
  const typeClass = `insight-${insight.type}`;
  const bgMap = { positive: 'rgba(52,211,153,0.05)', warning: 'rgba(251,191,36,0.05)', info: 'rgba(129,140,248,0.05)' };
  const colorMap = { positive: '#34d399', warning: '#fbbf24', info: '#818cf8' };

  return (
    <div
      className={`glass ${typeClass}`}
      style={{ padding: '14px 16px', background: bgMap[insight.type] }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20 }}>{insight.icon}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: colorMap[insight.type], marginBottom: 3 }}>
            {insight.title}
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{insight.message}</p>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [txRes, insRes] = await Promise.all([
        api.get('/transactions?limit=200'),
        api.get('/insights'),
      ]);
      setTransactions(txRes.data.transactions);
      setInsights(insRes.data.insights);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Compute stats
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Last 30 days daily spending for line chart
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTotal = transactions
      .filter((t) => t.type === 'expense' && t.date.split('T')[0] === dateStr)
      .reduce((s, t) => s + t.amount, 0);
    return { label: format(date, 'MMM d'), amount: dayTotal };
  });

  // Expense by category for donut chart
  const catMap = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const categoryBreakdown = Object.entries(catMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Recent transactions
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(129,140,248,0.2)',
            borderTopColor: '#818cf8',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#64748b' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: '#475569', fontSize: 14 }}>
            Here's your financial overview for {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={handleRefresh} disabled={refreshing} style={{ gap: 8 }}>
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard title="Net Balance" value={formatCurrency(netBalance)} icon={Wallet} color={netBalance >= 0 ? '#34d399' : '#f87171'} subtitle="Total income minus expenses" />
        <StatCard title="Total Income" value={formatCurrency(totalIncome)} icon={TrendingUp} color="#34d399" subtitle={`${transactions.filter((t) => t.type === 'income').length} transactions`} />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={TrendingDown} color="#f87171" subtitle={`${transactions.filter((t) => t.type === 'expense').length} transactions`} />
        <StatCard title="Savings Rate" value={`${savingsRate}%`} icon={PiggyBank} color="#818cf8" subtitle={savingsRate >= 20 ? '🎯 Above target!' : 'Target: 20%+'} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 24 }}>
        {/* Line Chart */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>
                Daily Spending
              </h3>
              <p style={{ fontSize: 12, color: '#475569' }}>Last 30 days</p>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <SpendingLineChart data={last30Days} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass" style={{ padding: 24 }}>
          <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            By Category
          </h3>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>Expense breakdown</p>
          <div style={{ height: 200 }}>
            <ExpenseDonutChart data={categoryBreakdown} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent + Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Recent Transactions */}
        <div className="glass" style={{ padding: 24 }}>
          <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 20 }}>
            Recent Transactions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recent.length === 0 ? (
              <p style={{ color: '#475569', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>No transactions yet</p>
            ) : recent.map((t) => {
              const cat = CATEGORIES[t.category] || CATEGORIES['Other'];
              return (
                <div key={t._id} className="table-row" style={{ gridTemplateColumns: '36px 1fr auto', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: cat.bg, border: `1px solid ${cat.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{t.description}</p>
                    <p style={{ fontSize: 11, color: '#475569' }}>{formatShortDate(t.date)} · {t.category}</p>
                  </div>
                  <p className="font-mono" style={{
                    fontSize: 14, fontWeight: 600,
                    color: t.type === 'income' ? '#34d399' : '#f87171',
                  }}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>✨</div>
            <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>
              AI Insights
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.length === 0 ? (
              <p style={{ color: '#475569', fontSize: 14 }}>Add transactions to get personalized insights</p>
            ) : insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
