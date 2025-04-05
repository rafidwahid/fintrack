"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatementCard from "@/components/StatementCard";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
  status: string;
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

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/statements`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch statements");
        }

        const data = await response.json();
        setStatements(data);
      } catch (error) {
        console.error("Error fetching statements:", error);
        setError("Failed to load statements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Statements</h1>
      </div>

      {statements.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center">
            No statements found. Upload a statement to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {statements.map((statement) => (
            <StatementCard key={statement.id} statement={statement} />
          ))}
        </div>
      )}
    </div>
  );
}
