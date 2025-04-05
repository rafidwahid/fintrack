"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardsList from "./components/CardsList";

// Define user interface based on backend model
interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
}

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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(true); // Control whether to redirect

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/status`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            fetchUserCards();
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    }

    checkAuthStatus();
  }, []);

  // Fetch user's cards
  async function fetchUserCards() {
    if (!user) return;

    try {
      setIsLoadingCards(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const cardsData = await response.json();
        setCards(cardsData);

        // Set a short timeout before redirecting to allow the user to see the cards
        if (shouldRedirect) {
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000); // 2 seconds delay
        }
      }
    } catch (error) {
      console.error("Error fetching user cards:", error);
    } finally {
      setIsLoadingCards(false);
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Redirect to your backend auth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {user ? (
          // Show user information and cards if logged in
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 className="text-2xl font-bold">
                  Welcome, {user.firstName || user.email.split("@")[0]}
                </h1>
                <p className="text-base-content/70">
                  {isLoadingCards
                    ? "Loading your cards..."
                    : "Here are your credit cards. Redirecting to dashboard..."}
                </p>
              </div>
            </div>

            {/* Display cards */}
            <CardsList cards={cards} loading={isLoadingCards} />
          </div>
        ) : (
          // Show login form if not logged in
          <div className="hero-content flex-col">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
              <div className="card-body">
                <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                <p className="text-center text-base-content/70 pb-4">
                  Sign in to continue to your account
                </p>

                <div className="form-control mt-2">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="btn btn-outline gap-2"
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          />
                          <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="divider mt-6">OR</div>

                <div className="text-center text-sm">
                  <p>Don't have an account?</p>
                  <a href="#" className="link link-primary">
                    Create an account
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
