"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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
  creditLimit?: number;
  availableCredit?: number;
  dueDate?: string;
  minimumPayment?: number;
  currentBalance?: number;
}

const CardLogo = ({ issuer }: { issuer: string }) => {
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

export default function CardDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [duplicateStatement, setDuplicateStatement] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        if (!params.id) {
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cards/${params.id}`,
          {
            credentials: "include", // Important for sending cookies with the request
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch card details");
        }

        const data = await response.json();
        setCard(data);
      } catch (error) {
        console.error("Error fetching card details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [params.id]);

  const handleGoBack = () => {
    router.back();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !card) return;

    const file = files[0];

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setDuplicateStatement(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cardId", String(card.id));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/statements/${card.id}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "DUPLICATE_STATEMENT") {
          setDuplicateStatement(true);
          setUploadError(data.message);
        } else {
          throw new Error(data.message || "Failed to upload file");
        }
        return;
      }

      setUploadSuccess(true);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

  if (!card) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Card Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The card you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Cards
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {card.bank?.name || card.cardIssuer}
              </h1>
              <p className="text-gray-500">**** **** **** {card.lastFour}</p>
              {card.variant && (
                <p className="text-indigo-600 font-medium mt-1">
                  {card.variant}
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <CardLogo issuer={card.cardIssuer} />
            </div>
          </div>
        </div>

        <div className="p-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Card Information
            </h2>

            <div>
              <p className="text-sm text-gray-600">Card Issuer</p>
              <p className="font-medium">{card.cardIssuer}</p>
            </div>

            {card.bank && (
              <div>
                <p className="text-sm text-gray-600">Bank</p>
                <p className="font-medium">{card.bank.name}</p>
              </div>
            )}

            {card.variant && (
              <div>
                <p className="text-sm text-gray-600">Card Type</p>
                <p className="font-medium">{card.variant}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Payment Information
            </h2>

            {card.statementDay && (
              <div>
                <p className="text-sm text-gray-600">Statement Day</p>
                <p className="font-medium">{card.statementDay}</p>
              </div>
            )}

            {card.notificationDate && (
              <div>
                <p className="text-sm text-gray-600">Notification Date</p>
                <p className="font-medium">
                  {new Date(card.notificationDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {card.dueDate && (
              <div>
                <p className="text-sm text-gray-600">Payment Due Date</p>
                <p className="font-medium">
                  {new Date(card.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional card details that might be useful */}
        {(card.creditLimit || card.availableCredit || card.currentBalance) && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Financial Information
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {card.creditLimit !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Credit Limit</p>
                  <p className="text-xl font-semibold">
                    ${card.creditLimit.toLocaleString()}
                  </p>
                </div>
              )}

              {card.availableCredit !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Available Credit</p>
                  <p className="text-xl font-semibold">
                    ${card.availableCredit.toLocaleString()}
                  </p>
                </div>
              )}

              {card.currentBalance !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-xl font-semibold">
                    ${card.currentBalance.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Card Documents
          </h2>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Upload statements, receipts or other documents related to this
              card
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={triggerFileDialog}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 mr-2"
            >
              {uploading ? "Uploading..." : "Upload PDF Document"}
            </button>

            {uploadError && (
              <p className="mt-2 text-red-500 text-sm">{uploadError}</p>
            )}

            {uploadSuccess && (
              <p className="mt-2 text-green-500 text-sm">
                File uploaded successfully!
              </p>
            )}

            {duplicateStatement && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700 text-sm">
                  This statement has already been uploaded. Please check your
                  statements list.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Edit Card
            </button>
            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors">
              Delete Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
