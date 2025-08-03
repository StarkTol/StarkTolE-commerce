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

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#ea580c',
          colorText: '#1f2937',
        },
        elements: {
          formButtonPrimary: 'bg-orange-600 hover:bg-orange-700',
          card: 'shadow-lg',
        },
      }}
    >
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
