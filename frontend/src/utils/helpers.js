// Category definitions with icons (emoji) and Tailwind colors
export const CATEGORIES = {
  Food: { icon: '🍔', color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)' },
  Transport: { icon: '🚗', color: '#22d3ee', bg: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.3)' },
  Housing: { icon: '🏠', color: '#818cf8', bg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.3)' },
  Health: { icon: '💊', color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
  Entertainment: { icon: '🎬', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)' },
  Shopping: { icon: '🛍️', color: '#fb7185', bg: 'rgba(251,113,133,0.15)', border: 'rgba(251,113,133,0.3)' },
  Salary: { icon: '💼', color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
  Freelance: { icon: '💻', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)' },
  Other: { icon: '📦', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)' },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES);

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)'];
  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount,
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `finflow-transactions-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
