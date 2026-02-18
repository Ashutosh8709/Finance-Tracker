import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format } from "date-fns";
import {
  formatCurrency,
  CATEGORY_COLORS,
  getCategoryEmoji,
} from "../utils/helpers";

export default function AnalyticsPage({ data }) {
  const { transactions, totalIncome, totalExpense, balance, loading } = data;

  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const date = t.createdAt?.toDate
        ? t.createdAt.toDate()
        : new Date(t.createdAt || Date.now());
      const key = format(date, "MMM yy");
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
      if (t.type === "income") map[key].income += Number(t.amount);
      else map[key].expense += Number(t.amount);
    });
    return Object.values(map).slice(-8);
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const income = {};
    const expense = {};
    transactions.forEach((t) => {
      const target = t.type === "income" ? income : expense;
      if (!target[t.category]) target[t.category] = 0;
      target[t.category] += Number(t.amount);
    });
    return {
      income: Object.entries(income)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      expense: Object.entries(expense)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    };
  }, [transactions]);

  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
  const expenseRate =
    totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0;

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <div className="spinner" />
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your financial data</p>
        </div>
      </div>

      {/* Stat pills */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
      >
        {[
          {
            label: "Savings Rate",
            value: `${savingsRate}%`,
            color: "var(--accent-green)",
            bg: "var(--accent-green-dim)",
          },
          {
            label: "Expense Rate",
            value: `${expenseRate}%`,
            color: "var(--accent-red)",
            bg: "var(--accent-red-dim)",
          },
          {
            label: "Total Transactions",
            value: transactions.length,
            color: "var(--accent-blue)",
            bg: "var(--accent-blue-dim)",
          },
          {
            label: "Avg Transaction",
            value: formatCurrency(
              transactions.length > 0
                ? (totalIncome + totalExpense) / transactions.length
                : 0,
            ),
            color: "var(--accent-gold)",
            bg: "rgba(255,209,102,0.1)",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              border: `1px solid ${s.color}22`,
              borderRadius: 12,
              padding: "12px 20px",
              flex: 1,
              minWidth: 140,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 800,
                color: s.color,
                letterSpacing: "-0.5px",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-card-header">
          <div className="chart-card-title">Monthly Income vs Expenses</div>
          <div className="chart-card-subtitle">Last 8 months comparison</div>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={monthlyData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(240,244,255,0.4)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(240,244,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `$${v >= 1000 ? Math.round(v / 1000) + "k" : v}`
                }
              />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  background: "var(--bg-card-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
              <Bar
                dataKey="income"
                fill="#00E5A0"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="expense"
                fill="#FF4757"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
          >
            Add transactions to see analytics
          </div>
        )}
      </div>

      {/* Category tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {["income", "expense"].map((type) => (
          <div className="chart-card" key={type}>
            <div className="chart-card-header">
              <div className="chart-card-title">
                {type === "income" ? "📈 Income" : "📉 Expense"} by Category
              </div>
            </div>
            {categoryBreakdown[type].length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {categoryBreakdown[type].map((item, i) => {
                  const total = categoryBreakdown[type].reduce(
                    (s, x) => s + x.value,
                    0,
                  );
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                          fontSize: 13,
                        }}
                      >
                        <span>
                          {getCategoryEmoji(item.name)} {item.name}
                        </span>
                        <span
                          style={{
                            color:
                              type === "income"
                                ? "var(--accent-green)"
                                : "var(--accent-red)",
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "var(--bg-base)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background:
                              type === "income"
                                ? "var(--accent-green)"
                                : "var(--accent-red)",
                            borderRadius: 2,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: 14,
                  padding: "20px 0",
                }}
              >
                No {type} data yet
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
