"use client";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Lato } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-Roboto",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-Lato",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div>{children}</div>
            </ThemeProvider>
       </body>
    </html>
  );
}
