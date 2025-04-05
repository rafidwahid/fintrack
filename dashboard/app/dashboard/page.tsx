"use client";

import { useEffect, useState } from "react";
import AddCardModal, { CardFormData } from "../components/AddCardModal";
import CardsList from "../components/CardsList";
import { toast } from "react-hot-toast";

// Define Card interface (matching the one in CardsList.tsx)
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

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend
    async function fetchUserData() {
      try {
        // Make a request to your backend endpoint that has access to the httpOnly cookie
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/status`,
          {
            credentials: "include", // Important for sending cookies with the request
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // If you're returning the whole user object from the status endpoint
          if (data.user) {
            setUserName(
              data.user.firstName || data.user.email.split("@")[0] || "User"
            );

            // Once we have user data, fetch their cards
            await fetchUserCards();
          } else {
            setUserName("User");
            setIsLoading(false);
          }
        } else {
          // If not authenticated, you might want to redirect to login

          setUserName("Guest");
          // window.location.href = '/login';
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Function to fetch user's cards
  async function fetchUserCards() {
    try {
      setIsLoadingCards(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        credentials: "include", // Important for including cookies in the request
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const cardsData = await response.json();
        setCards(cardsData);
      } else {
        toast.error("Failed to load cards");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Error loading cards. Please try again.");
    } finally {
      setIsLoadingCards(false);
      setIsLoading(false);
    }
  }

  const handleAddCard = async (cardData: CardFormData) => {
    try {
      setIsLoading(true);

      // Call the API endpoint to add the card
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for including cookies in the request
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add card");
      }

      // Instead of manually adding the card to state, refresh all cards
      // to ensure consistency with backend
      await fetchUserCards();

      // Show success toast/notification
      toast.success("Card added successfully");

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding card:", error);
      // Show error toast/notification
      toast.error(
        error instanceof Error ? error.message : "Failed to add card"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserCards();
    toast.success("Cards refreshed");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold ">
            Welcome back, <span className="text-indigo-600">{userName}</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Here&apos;s an overview of your account and recent activity
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            disabled={isLoadingCards}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            {isLoadingCards ? "Refreshing..." : "Refresh Cards"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add New Card
          </button>
        </div>
      </div>

      {/* Cards grid - Using CardsList component */}
      <CardsList cards={cards} loading={isLoadingCards} />

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCard}
      />
    </div>
  );
}
