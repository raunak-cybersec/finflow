import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CATEGORIES } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseDonutChart = ({ data }) => {
  const labels = data.map((d) => d.category);
  const amounts = data.map((d) => d.amount);
  const colors = data.map((d) => CATEGORIES[d.category]?.color || '#94a3b8');
  const bgColors = data.map((d) => CATEGORIES[d.category]?.bg || 'rgba(148,163,184,0.15)');

  const chartData = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: bgColors,
        borderColor: colors,
        borderWidth: 2,
        hoverBackgroundColor: colors.map((c) => c + '44'),
        hoverBorderColor: colors,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { size: 12, family: 'Inter' },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${CATEGORIES[label]?.icon || ''} ${label}`,
              fillStyle: ds.borderColor[i],
              strokeStyle: ds.borderColor[i],
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(13,13,26,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#e2e8f0',
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return `  ₹${ctx.raw.toLocaleString('en-IN')}  (${pct}%)`;
          },
        },
      },
    },
  };

  if (!data.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: 14 }}>
        No expense data yet
      </div>
    );
  }

  return <Doughnut data={chartData} options={options} />;
};

export default ExpenseDonutChart;
