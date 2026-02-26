import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn Swedish — Your Daily Practice",
  description:
    "Learn Swedish with scientifically-backed study methods: spaced repetition flashcards and an AI conversational tutor.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if user is logged in — conditionally show sidebar
  let userEmail: string | undefined;
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isLoggedIn = true;
      userEmail = user.email ?? undefined;
    }
  } catch {
    // Not logged in or error
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {isLoggedIn ? (
          <div className="flex min-h-screen">
            <Sidebar userEmail={userEmail} />
            <main className="flex-1 md:ml-0">
              {children}
            </main>
          </div>
        ) : (
          // Login page — no sidebar, full width
          <>{children}</>
        )}
      </body>
    </html>
  );
}
