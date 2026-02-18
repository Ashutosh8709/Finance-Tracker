import React from "react";
import TransactionList from "../components/TransactionList";

export default function TransactionsPage({ data, onEdit, onDelete }) {
  const { transactions, loading } = data;

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
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Manage all your income and expenses</p>
        </div>
      </div>
      <TransactionList
        transactions={transactions}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
