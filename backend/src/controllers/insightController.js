const Transaction = require('../models/Transaction');

// GET /api/insights
exports.getInsights = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const prevSevenStart = new Date(now);
    prevSevenStart.setDate(now.getDate() - 14);

    // All transactions last 30 days
    const recentTxns = await Transaction.find({
      userId: req.userId,
      date: { $gte: thirtyDaysAgo },
    });

    // This month totals
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTxns = await Transaction.find({
      userId: req.userId,
      date: { $gte: startOfMonth },
    });

    const monthIncome = monthTxns
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const monthExpenses = monthTxns
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    // Category spend last 7 days vs prev 7 days
    const thisWeekExpenses = recentTxns.filter(
      (t) => t.type === 'expense' && new Date(t.date) >= sevenDaysAgo
    );
    const prevWeekExpenses = recentTxns.filter(
      (t) =>
        t.type === 'expense' &&
        new Date(t.date) >= prevSevenStart &&
        new Date(t.date) < sevenDaysAgo
    );

    // Category totals this week
    const catThisWeek = {};
    thisWeekExpenses.forEach((t) => {
      catThisWeek[t.category] = (catThisWeek[t.category] || 0) + t.amount;
    });

    // Category totals prev week
    const catPrevWeek = {};
    prevWeekExpenses.forEach((t) => {
      catPrevWeek[t.category] = (catPrevWeek[t.category] || 0) + t.amount;
    });

    const insights = [];

    // Insight 1: Savings goal
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const projectedExpenses = (monthExpenses / daysPassed) * daysInMonth;
    const projectedSavings = monthIncome - projectedExpenses;

    if (monthIncome > 0) {
      if (projectedSavings > 0) {
        insights.push({
          type: 'positive',
          icon: '🎯',
          title: 'Savings on Track',
          message: `You're on track to save ₹${Math.round(projectedSavings).toLocaleString('en-IN')} this month based on your current spending pace.`,
        });
      } else {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          title: 'Overspending Alert',
          message: `At your current pace, you may overspend by ₹${Math.abs(Math.round(projectedSavings)).toLocaleString('en-IN')} this month. Consider cutting discretionary expenses.`,
        });
      }
    }

    // Insight 2: Biggest category spike this week
    let biggestSpike = null;
    let biggestSpikePercent = 0;
    for (const cat of Object.keys(catThisWeek)) {
      const prev = catPrevWeek[cat] || 0;
      if (prev > 0) {
        const pct = ((catThisWeek[cat] - prev) / prev) * 100;
        if (pct > 20 && pct > biggestSpikePercent) {
          biggestSpikePercent = pct;
          biggestSpike = { category: cat, pct: Math.round(pct) };
        }
      }
    }

    if (biggestSpike) {
      insights.push({
        type: 'warning',
        icon: '📈',
        title: `${biggestSpike.category} Spending Up`,
        message: `You spent ${biggestSpike.pct}% more on ${biggestSpike.category} this week compared to last week. Keep an eye on this category.`,
      });
    }

    // Insight 3: Top spending category this month
    const catMonth = {};
    monthTxns
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catMonth[t.category] = (catMonth[t.category] || 0) + t.amount;
      });

    const topCat = Object.entries(catMonth).sort((a, b) => b[1] - a[1])[0];
    if (topCat && monthExpenses > 0) {
      const topPct = Math.round((topCat[1] / monthExpenses) * 100);
      insights.push({
        type: 'info',
        icon: '💡',
        title: 'Top Spending Category',
        message: `${topCat[0]} is your biggest expense this month at ₹${Math.round(topCat[1]).toLocaleString('en-IN')} (${topPct}% of total spending).`,
      });
    }

    // Insight 4: Savings rate
    if (monthIncome > 0) {
      const savingsRate = Math.round(((monthIncome - monthExpenses) / monthIncome) * 100);
      if (savingsRate >= 20) {
        insights.push({
          type: 'positive',
          icon: '🌟',
          title: 'Excellent Savings Rate',
          message: `Your savings rate this month is ${savingsRate}% — that's above the recommended 20% threshold. Great financial discipline!`,
        });
      } else if (savingsRate > 0) {
        insights.push({
          type: 'info',
          icon: '💰',
          title: 'Savings Rate',
          message: `Your savings rate this month is ${savingsRate}%. Financial experts recommend saving at least 20% of your income.`,
        });
      }
    }

    // Insight 5: Daily average spending
    const totalExpensesLast30 = recentTxns
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const dailyAvg = Math.round(totalExpensesLast30 / 30);

    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Daily Spending Average',
      message: `Your average daily spending over the last 30 days is ₹${dailyAvg.toLocaleString('en-IN')}.`,
    });

    res.json({ insights });
  } catch (error) {
    next(error);
  }
};
