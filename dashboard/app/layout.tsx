import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fintrack - Credit & Debit Card Statement Analyzer",
  description:
    "Track and analyze your credit and debit card statements to better understand your spending patterns and manage your finances effectively.",
  keywords: [
    "credit card",
    "debit card",
    "statement analyzer",
    "finance tracker",
    "spending analysis",
    "budget management",
  ],
  authors: [{ name: "Fintrack Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100`}
      >
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <div className="w-full navbar bg-base-300">
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-5 h-5 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <div className="flex-1 px-2 mx-2">
                <span className="text-lg font-bold">Fintrack</span>
              </div>
              <div className="flex-none hidden lg:block">
                <ul className="menu menu-horizontal">
                  <li>
                    <a>Dashboard</a>
                  </li>
                  <li>
                    <a>Statements</a>
                  </li>
                  <li>
                    <a>Analytics</a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
          </div>

          {/* Sidebar */}
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              <li className="menu-title">
                <span>Menu</span>
              </li>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Statements</a>
              </li>
              <li>
                <a>Analytics</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
            </ul>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
