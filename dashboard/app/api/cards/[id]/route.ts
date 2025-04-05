import { NextRequest, NextResponse } from "next/server";

// This is a mock database for demonstration
// In a real app, this would be replaced with actual database queries
const mockCards = [
  {
    id: 1,
    lastFour: "1234",
    cardIssuer: "VISA",
    bankId: 1,
    bank: {
      name: "Chase Bank",
      logoUrl: "/images/bank-logos/chase.svg",
    },
    variant: "Sapphire Preferred",
    statementDay: 15,
    notificationDate: "2023-04-10",
    creditLimit: 10000,
    availableCredit: 7500,
    currentBalance: 2500,
    dueDate: "2023-04-25",
    minimumPayment: 35,
  },
  {
    id: 2,
    lastFour: "5678",
    cardIssuer: "Mastercard",
    bankId: 2,
    bank: {
      name: "Bank of America",
      logoUrl: "/images/bank-logos/bofa.svg",
    },
    variant: "Cash Rewards",
    statementDay: 23,
    notificationDate: "2023-04-18",
    creditLimit: 8000,
    availableCredit: 6000,
    currentBalance: 2000,
    dueDate: "2023-05-03",
    minimumPayment: 25,
  },
  {
    id: 3,
    lastFour: "9012",
    cardIssuer: "American Express",
    bankId: 3,
    bank: {
      name: "American Express",
      logoUrl: "/images/bank-logos/amex.svg",
    },
    variant: "Gold Card",
    statementDay: 5,
    notificationDate: "2023-03-31",
    creditLimit: 15000,
    availableCredit: 10000,
    currentBalance: 5000,
    dueDate: "2023-04-15",
    minimumPayment: 100,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cardId = parseInt(params.id);

    // Simulate delay to show loading state (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const card = mockCards.find((card) => card.id === cardId);

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    );
  }
}
