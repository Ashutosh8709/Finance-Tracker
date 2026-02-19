import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useTransactions } from "./hooks/useTransactions";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Sidebar from "./components/Sidebar";
import TransactionModal from "./components/TransactionModal";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const PlusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function AppInner() {
  const { user, loading } = useAuth();
  const txData = useTransactions();
  const { addTransaction, updateTransaction, deleteTransaction } = txData;

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  if (loading)
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );

  if (!user) return <AuthPage />;

  const handleEdit = (t) => {
    setEditData(t);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await updateTransaction(editData.id, { ...data, updatedAt: new Date() });
    } else {
      await addTransaction(data);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                data={txData}
                onEdit={handleEdit}
                onDelete={deleteTransaction}
              />
            }
          />

          <Route
            path="/transactions"
            element={
              <TransactionsPage
                data={txData}
                onEdit={handleEdit}
                onDelete={deleteTransaction}
              />
            }
          />

          <Route path="/analytics" element={<AnalyticsPage data={txData} />} />
        </Routes>
      </main>

      <button className="fab" onClick={handleAdd} title="Add Transaction">
        <PlusIcon />
      </button>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}
