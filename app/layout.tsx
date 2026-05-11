import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";
import { ToastProvider } from "@/components/toast";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tutor - Find Local Tutors in Dhaka",
  description: "Hyper-local tutoring marketplace for Dhaka and Narayanganj",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={syne.variable}>
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
