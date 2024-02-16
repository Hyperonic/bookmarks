import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import { Container, Theme, } from "@radix-ui/themes";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Bookmarks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Theme>
            {children}
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
