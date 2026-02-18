import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
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
import { formatCurrency, CATEGORY_COLORS } from "../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip-label">{label}</div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="custom-tooltip-value"
          style={{ color: p.color }}
        >
          {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Charts({ transactions }) {
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
    return Object.values(map).slice(-6);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!map[t.category]) map[t.category] = { name: t.category, value: 0 };
        map[t.category].value += Number(t.amount);
      });
    return Object.values(map)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  return (
    <div className="charts-grid">
      <div className="chart-card" style={{ animationDelay: "200ms" }}>
        <div className="chart-card-header">
          <div className="chart-card-title">Income vs Expenses</div>
          <div className="chart-card-subtitle">Monthly overview</div>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E5A0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4757" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF4757" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#00E5A0"
                strokeWidth={2}
                fill="url(#gradIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#FF4757"
                strokeWidth={2}
                fill="url(#gradExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Add transactions to see your chart
          </div>
        )}
      </div>

      <div className="chart-card" style={{ animationDelay: "280ms" }}>
        <div className="chart-card-header">
          <div className="chart-card-title">Spending Breakdown</div>
          <div className="chart-card-subtitle">By category</div>
        </div>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {categoryData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={CATEGORY_COLORS[entry.name] || "#4F8EF7"}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  background: "var(--bg-card-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            No expense data yet
          </div>
        )}
      </div>
    </div>
  );
}
