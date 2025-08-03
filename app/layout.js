import { ClerkProvider } from '@clerk/nextjs';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "StarkTol E-commerce - Premium Shopping Experience",
  description: "StarkTol E-commerce - Your premier destination for premium electronics, gadgets, and accessories with Next.js",
};

// Check if Clerk is configured
const hasClerkConfig = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;

export default function RootLayout({ children }) {
  const content = (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster />
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );

  // If Clerk is configured, wrap with ClerkProvider
  if (hasClerkConfig) {
    return (
      <ClerkProvider>
        {content}
      </ClerkProvider>
    );
  }

  // Otherwise, return content without Clerk
  return content;
}
