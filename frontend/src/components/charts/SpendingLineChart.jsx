import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SpendingLineChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Daily Spending',
        data: data.map((d) => d.amount),
        borderColor: '#818cf8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(129,140,248,0.3)');
          gradient.addColorStop(1, 'rgba(129,140,248,0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#080810',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,13,26,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#818cf8',
        padding: 12,
        callbacks: {
          label: (ctx) => `  ₹${ctx.raw.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: '#475569', font: { size: 11 }, maxTicksLimit: 7 },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#475569',
          font: { size: 11 },
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SpendingLineChart;
