export type Category = {
  id: string;
  name: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", color: "bg-red-100 text-red-800" },
  { id: "grocery", name: "Grocery", color: "bg-orange-100 text-orange-800" },
  { id: "shopping", name: "Shopping", color: "bg-blue-100 text-blue-800" },
  {
    id: "transportation",
    name: "Transportation",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "health",
    name: "Health & Medical",
    color: "bg-pink-100 text-pink-800",
  },
  { id: "travel", name: "Travel", color: "bg-indigo-100 text-indigo-800" },
  { id: "other", name: "Other", color: "bg-gray-100 text-gray-800" },
];
