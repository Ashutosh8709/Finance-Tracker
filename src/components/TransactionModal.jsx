import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/helpers";

const XIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const defaultForm = {
  type: "expense",
  title: "",
  amount: "",
  category: "",
  date: "",
  note: "",
};

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
}) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      const date =
        editData.date ||
        (editData.createdAt?.toDate
          ? editData.createdAt.toDate().toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10));
      setForm({
        type: editData.type || "expense",
        title: editData.title || "",
        amount: editData.amount || "",
        category: editData.category || "",
        date,
        note: editData.note || "",
      });
    } else {
      setForm({ ...defaultForm, date: new Date().toISOString().slice(0, 10) });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ ...form, amount: parseFloat(form.amount) });
    setLoading(false);
    onClose();
  };

  const categories = CATEGORIES[form.type] || [];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {editData ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            className="btn-action"
            onClick={onClose}
            style={{ padding: 8 }}
          >
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${form.type === "income" ? "active income" : ""}`}
                onClick={() =>
                  setForm((f) => ({ ...f, type: "income", category: "" }))
                }
              >
                📈 Income
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === "expense" ? "active expense" : ""}`}
                onClick={() =>
                  setForm((f) => ({ ...f, type: "expense", category: "" }))
                }
              >
                📉 Expense
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Monthly Salary"
                value={form.title}
                onChange={set("title")}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount (&#8377;)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={set("amount")}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input filter-select"
                value={form.category}
                onChange={set("category")}
                required
                style={{ width: "100%" }}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Note (optional)</label>
              <input
                className="form-input"
                type="text"
                placeholder="Any notes?"
                value={form.note}
                onChange={set("note")}
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className={`btn-submit ${form.type}`}
                disabled={loading}
              >
                {loading
                  ? "..."
                  : editData
                    ? "Update"
                    : `Add ${form.type === "income" ? "Income" : "Expense"}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
