export const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    amount,
  );

export const formatDate = (ts) => {
  if (!ts) return "";
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const CATEGORIES = {
  income: [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Bonus",
    "Other Income",
  ],
  expense: [
    "Food",
    "Transport",
    "Shopping",
    "Health",
    "Entertainment",
    "Rent",
    "Utilities",
    "Education",
    "Other",
  ],
};

export const CATEGORY_COLORS = {
  Salary: "#6EE7B7",
  Freelance: "#34D399",
  Investment: "#10B981",
  Gift: "#A7F3D0",
  Bonus: "#059669",
  "Other Income": "#047857",
  Food: "#FCA5A5",
  Transport: "#F87171",
  Shopping: "#EF4444",
  Health: "#FDA4AF",
  Entertainment: "#FB7185",
  Rent: "#F43F5E",
  Utilities: "#E11D48",
  Education: "#BE185D",
  Other: "#9D174D",
};

export const getCategoryEmoji = (cat) => {
  const map = {
    Salary: "💼",
    Freelance: "💻",
    Investment: "📈",
    Gift: "🎁",
    Bonus: "🎯",
    "Other Income": "💰",
    Food: "🍕",
    Transport: "🚗",
    Shopping: "🛍️",
    Health: "🏥",
    Entertainment: "🎮",
    Rent: "🏠",
    Utilities: "⚡",
    Education: "📚",
    Other: "📦",
  };
  return map[cat] || "💳";
};
