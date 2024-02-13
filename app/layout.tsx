import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Infease - Event Ticket Booking",
  description:
    "Book tickets for exciting events on Evently. Your go-to platform for seamless event management.",
  icons: {
    icon: "/assets/images/infease_logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/assets/images/minilogo.svg" sizes="any" />
        </head>
        <body className={poppins.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
