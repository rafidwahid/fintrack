"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Card logo component for better organization
const CardLogo = ({ issuer }: { issuer: string }) => {
  // Map issuers to their respective logo paths and sizes
  const logos: Record<string, { path: string; width: number; height: number }> =
    {
      VISA: {
        path: "/images/card-logos/visa.svg",
        width: 40,
        height: 20,
      },
      Mastercard: {
        path: "/images/card-logos/mastercard.svg",
        width: 30,
        height: 24,
      },
      "American Express": {
        path: "/images/card-logos/amex.svg",
        width: 30,
        height: 30,
      },
      Discover: {
        path: "/images/card-logos/discover.svg",
        width: 40,
        height: 24,
      },
    };

  // Get logo info or use a default
  const logoInfo = logos[issuer] || {
    path: "/images/card-logos/generic-card.svg",
    width: 30,
    height: 30,
  };

  return (
    <div className="flex items-center justify-center">
      {logos[issuer] ? (
        <Image
          src={logoInfo.path}
          alt={`${issuer} logo`}
          width={logoInfo.width}
          height={logoInfo.height}
          className="object-contain"
        />
      ) : (
        <span className="text-gray-700 font-bold text-sm">CARD</span>
      )}
    </div>
  );
};

// Define the card interface based on the backend model
interface Card {
  id: number;
  lastFour: string;
  cardIssuer: string;
  bankId: number;
  bank?: {
    name: string;
    logoUrl?: string;
  };
  cardDesignId?: number;
  cardDesign?: {
    variant: string;
    designUrl: string;
  };
  variant?: string;
  statementDay?: number;
  notificationDate?: string;
}

interface CardsListProps {
  cards: Card[];
  loading: boolean;
}

export default function CardsList({ cards, loading }: CardsListProps) {
  const router = useRouter();

  const handleViewDetails = (cardId: number) => {
    router.push(`/cards/${cardId}`);
  };

  if (loading) {
    return (
      <div className="col-span-full flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="col-span-full bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-600">
          No cards added yet. Click &quot;Add New Card&quot; to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {card.bank?.name || card.cardIssuer}
              </h2>
              <p className="text-gray-500">**** **** **** {card.lastFour}</p>
              {card.variant && (
                <p className="text-sm text-indigo-600 font-medium mt-1">
                  {card.variant}
                </p>
              )}
            </div>
            <div className="p-2 bg-gray-100 rounded-full">
              {/* Card logo based on issuer */}
              <CardLogo issuer={card.cardIssuer} />
            </div>
          </div>

          {card.statementDay && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">Statement Day:</span>
              <span className="ml-2 text-sm font-medium">
                {card.statementDay}
              </span>
            </div>
          )}

          {card.notificationDate && (
            <div>
              <span className="text-sm text-gray-600">Notification Date:</span>
              <span className="ml-2 text-sm font-medium">
                {new Date(card.notificationDate).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleViewDetails(card.id)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 flex items-center"
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
