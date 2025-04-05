"use client";

import { useState, useEffect } from "react";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardData: CardFormData) => void;
}

export interface CardFormData {
  cardIssuer: string;
  lastFour: string;
  statementDay?: number;
  notificationDate?: string;
  bankId: number;
  variant: string;
  cardDesignId?: number;
}

interface Bank {
  id: number;
  name: string;
  logoUrl: string;
}

interface CardDesign {
  id: number;
  bankId: number;
  variant: string;
  designUrl: string;
}

const CARD_ISSUERS = [
  { id: "visa", name: "Visa", icon: "💳" },
  { id: "mastercard", name: "Mastercard", icon: "💳" },
  { id: "amex", name: "American Express", icon: "💳" },
  { id: "diners", name: "Diners Club", icon: "💳" },
  { id: "discover", name: "Discover", icon: "💳" },
  { id: "unionpay", name: "UnionPay", icon: "💳" },
  { id: "jcb", name: "JCB", icon: "💳" },
  { id: "other", name: "Other", icon: "💳" },
];

export default function AddCardModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCardModalProps) {
  const [formData, setFormData] = useState<CardFormData>({
    cardIssuer: "",
    lastFour: "",
    statementDay: undefined,
    // notificationDate: "",
    bankId: 0,
    variant: "",
  });

  const [banks, setBanks] = useState<Bank[]>([]);
  const [designs, setDesigns] = useState<CardDesign[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/banks`
        );
        if (response.ok) {
          const data = await response.json();
          setBanks(data);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (formData.bankId) {
      const fetchDesigns = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/banks/${formData.bankId}/designs`
          );
          if (response.ok) {
            const data = await response.json();
            setDesigns(data);
          }
        } catch (error) {
          console.error("Failed to fetch card designs:", error);
        }
      };

      fetchDesigns();
    } else {
      setDesigns([]);
    }
  }, [formData.bankId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric fields - convert to appropriate type
    if (name === "statementDay") {
      // Convert to number or undefined if empty
      const numValue = value ? parseInt(value, 10) : undefined;
      setFormData({ ...formData, [name]: numValue });
    } else if (name === "bankId" || name === "cardDesignId") {
      // Convert string IDs to numbers
      const numValue = value ? parseInt(value, 10) : 0;
      setFormData({ ...formData, [name]: numValue });
    } else {
      // Handle other fields normally
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(formData);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 m-4 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Add New Card</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="bankId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank
            </label>
            <select
              id="bankId"
              name="bankId"
              value={formData.bankId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 select"
              required
            >
              <option value="">Select a bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="cardIssuer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Network
            </label>
            <select
              id="cardIssuer"
              name="cardIssuer"
              value={formData.cardIssuer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 select"
              required
            >
              <option value="">Select card network</option>
              {CARD_ISSUERS.map((issuer) => (
                <option key={issuer.id} value={issuer.id}>
                  {issuer.icon} {issuer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastFour"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last 3-4 digits
            </label>
            <input
              type="number"
              id="lastFour"
              name="lastFour"
              value={formData.lastFour}
              onChange={(e) => {
                // Only allow up to 4 digits
                const value = e.target.value;
                if (value.length <= 4) {
                  handleChange(e);
                }
              }}
              onKeyPress={(e) => {
                // Allow only numbers
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              max="9999"
              placeholder="Last 4 digits"
              required
            />
          </div>

          {/* {formData.bankId > 0 && (
            <div className="mb-4">
              <label
                htmlFor="cardDesignId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Card Variant
              </label>
              <select
                id="cardDesignId"
                name="cardDesignId"
                value={formData.cardDesignId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 input"
              >
                <option value="">Select a variant</option>
                {designs.map((design) => (
                  <option key={design.id} value={design.id}>
                    {design.variant}
                  </option>
                ))}
              </select>
            </div>
          )} */}

          <div className="mb-4">
            <label
              htmlFor="statementDay"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Statement Day (1-31, optional)
            </label>
            <input
              type="number"
              id="statementDay"
              name="statementDay"
              value={formData.statementDay || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                // Only allow numbers between 1 and 31
                if (!value || (value >= 1 && value <= 31)) {
                  handleChange(e);
                }
              }}
              onKeyPress={(e) => {
                // Prevent typing non-numeric characters
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              min="1"
              max="31"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter day (1-31)"
            />
          </div>

          {/* <div className="mb-6">
            <label
              htmlFor="notificationDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notification Date (optional)
            </label>
            <input
              type="date"
              id="notificationDate"
              name="notificationDate"
              value={formData.notificationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div> */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData({
                  cardIssuer: "",
                  lastFour: "",
                  statementDay: undefined,
                  // notificationDate: "",
                  bankId: 0,
                  variant: "",
                });
              }}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Add Card"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
