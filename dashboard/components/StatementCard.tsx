import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/types/categories";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
  status: string;
  category?: string;
}

interface Statement {
  id: number;
  cardId: number;
  statementDate: string;
  totalOutstanding: number;
  fileUrl: string;
  uploadDate: string;
  card: {
    lastFour: string;
    bank: {
      name: string;
      logoUrl?: string;
    };
  };
  transactions: Transaction[];
}

interface StatementCardProps {
  statement: Statement;
}

export default function StatementCard({ statement }: StatementCardProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCategoryModal(true);
  };

  const handleCategorySelect = async (categoryId: string) => {
    if (!selectedTransaction) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${selectedTransaction.id}/category`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: categoryId }),
          credentials: "include",
        }
      );

      if (response.ok) {
        // Update the transaction in the statement
        const updatedTransactions = statement.transactions.map((t) =>
          t.id === selectedTransaction.id ? { ...t, category: categoryId } : t
        );
        statement.transactions = updatedTransactions;
      }
    } catch (error) {
      console.error("Failed to update transaction category:", error);
    }

    setShowCategoryModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <Link
              href={`/cards/${statement.cardId}`}
              className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
            >
              {statement.card.bank.name} - ****{statement.card.lastFour}
            </Link>
            <p className="text-gray-500">
              Statement Date: {formatDate(statement.statementDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">
              {formatCurrency(statement.totalOutstanding)}
            </p>
            <p className="text-sm text-gray-500">
              Uploaded: {formatDate(statement.uploadDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Transactions</h3>
          <Link
            href={`/statements/${statement.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View Full Statement
          </Link>
        </div>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statement.transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.transactionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.category ? (
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          CATEGORIES.find((c) => c.id === transaction.category)
                            ?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {CATEGORIES.find((c) => c.id === transaction.category)
                          ?.name || "Other"}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Click to categorize
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCategoryModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Category for Transaction
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full px-4 py-2 rounded-md text-left hover:bg-gray-100 ${category.color}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowCategoryModal(false);
                setSelectedTransaction(null);
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
