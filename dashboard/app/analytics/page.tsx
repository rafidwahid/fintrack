"use client";

import React, { useEffect, useState } from "react";
import { CATEGORIES, Category } from "@/types/categories";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
  status: string;
  category?: string;
}

interface CategoryAnalytics {
  id: string;
  name: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryAnalytics, setCategoryAnalytics] = useState<
    CategoryAnalytics[]
  >([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
        calculateAnalytics(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const calculateAnalytics = (transactions: Transaction[]) => {
    // Calculate total spent
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    setTotalSpent(total);

    // Calculate category analytics
    const categoryData = CATEGORIES.map((category: Category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.category === category.id
      );
      const categoryTotal = categoryTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      return {
        id: category.id,
        name: category.name,
        total: categoryTotal,
        count: categoryTransactions.length,
        percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
        color: category.color,
      };
    });

    setCategoryAnalytics(categoryData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Spending Analytics
      </h1>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Total Spending
        </h2>
        <p className="text-3xl font-bold text-indigo-600">
          {formatCurrency(totalSpent)}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Across {transactions.length} transactions
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Spending by Category
        </h2>
        <div className="space-y-4">
          {categoryAnalytics.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${category.color}`}
                  >
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({category.count} transactions)
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(category.total)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${category.color.split(" ")[0]}`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-500">
                {category.percentage.toFixed(1)}% of total spending
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.category ? (
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          CATEGORIES.find(
                            (c: Category) => c.id === transaction.category
                          )?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {CATEGORIES.find(
                          (c: Category) => c.id === transaction.category
                        )?.name || "Other"}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Uncategorized
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
