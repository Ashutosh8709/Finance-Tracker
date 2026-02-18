import React from "react";
import SummaryCards from "../components/SummaryCards";
import Charts from "../components/Charts";
import TransactionList from "../components/TransactionList";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ data, onEdit, onDelete }) {
  const { user } = useAuth();
  const { transactions, totalIncome, totalExpense, balance, loading } = data;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.displayName?.split(" ")[0] || "there";

  if (loading)
    return (
      <div className="loading-center" style={{ minHeight: 300 }}>
        <div className="spinner" />
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="page-subtitle">Here's your financial overview</p>
        </div>
      </div>

      <SummaryCards
        balance={balance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        transactionCount={
          transactions.filter((t) => t.type === "expense").length
        }
      />

      <Charts transactions={transactions} />

      <TransactionList
        transactions={transactions.slice(0, 5)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
