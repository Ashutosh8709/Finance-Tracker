import React from "react";
import { formatCurrency } from "../utils/helpers";

export default function SummaryCards({
  balance,
  totalIncome,
  totalExpense,
  transactionCount,
}) {
  const savingsRate =
    totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return (
    <div className="summary-grid">
      <div className="summary-card balance" style={{ animationDelay: "0ms" }}>
        <div className="summary-card-top">
          <div className="summary-icon balance">💰</div>
          <span className={`summary-badge ${balance >= 0 ? "up" : "down"}`}>
            {savingsRate >= 0 ? "+" : ""}
            {savingsRate}% saved
          </span>
        </div>
        <div className={`summary-amount balance`}>
          {formatCurrency(balance)}
        </div>
        <div className="summary-label">Net Balance</div>
      </div>

      <div className="summary-card income" style={{ animationDelay: "80ms" }}>
        <div className="summary-card-top">
          <div className="summary-icon income">📈</div>
          <span className="summary-badge up">Income</span>
        </div>
        <div className="summary-amount income">
          {formatCurrency(totalIncome)}
        </div>
        <div className="summary-label">Total Earned</div>
      </div>

      <div className="summary-card expense" style={{ animationDelay: "160ms" }}>
        <div className="summary-card-top">
          <div className="summary-icon expense">📉</div>
          <span className="summary-badge down">Expenses</span>
        </div>
        <div className="summary-amount expense">
          {formatCurrency(totalExpense)}
        </div>
        <div className="summary-label">{transactionCount} transactions</div>
      </div>
    </div>
  );
}
