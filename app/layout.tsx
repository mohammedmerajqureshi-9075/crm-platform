
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "DistribuFlow | Distribution CRM",
  description: "Distribution management CRM by GenAlliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <Sidebar />

        <div className="min-h-screen lg:pl-64">
          {children}
        </div>
      </body>
    </html>
  );
}
