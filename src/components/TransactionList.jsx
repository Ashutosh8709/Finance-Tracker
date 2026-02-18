import React, { useState } from "react";
import { formatCurrency, formatDate, getCategoryEmoji } from "../utils/helpers";

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="search-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const categories = [...new Set(transactions.map((t) => t.category))].filter(
    Boolean,
  );

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    const matchCat = filterCategory === "all" || t.category === filterCategory;
    return matchSearch && matchType && matchCat;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div>
      <div className="filters-row">
        <div className="search-input-wrap">
          <SearchIcon />
          <input
            className="search-input"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="transactions-card">
        <div className="transactions-header">
          <div>
            <div className="transactions-title">Transactions</div>
            <div className="transactions-count">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-text">
              Try adjusting your filters or add a new transaction
            </div>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              className="transaction-item"
              key={t.id}
              style={{ opacity: deletingId === t.id ? 0.5 : 1 }}
            >
              <div className="transaction-emoji">
                {getCategoryEmoji(t.category)}
              </div>
              <div className="transaction-info">
                <div className="transaction-title">{t.title}</div>
                <div className="transaction-meta">
                  {formatDate(t.createdAt)} {t.note && `· ${t.note}`}
                </div>
              </div>
              <span className="transaction-category-badge">{t.category}</span>
              <div className={`transaction-amount ${t.type}`}>
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </div>
              <div className="transaction-actions">
                <button
                  className="btn-action edit"
                  onClick={() => onEdit(t)}
                  title="Edit"
                >
                  <EditIcon />
                </button>
                <button
                  className="btn-action delete"
                  onClick={() => handleDelete(t.id)}
                  title="Delete"
                  disabled={deletingId === t.id}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
