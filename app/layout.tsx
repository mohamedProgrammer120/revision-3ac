import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: {
    default: "Hub 3AC — Révisions",
    template: "%s | Hub 3AC",
  },
  description: "Ton tableau de bord personnel de révisions pour la 3ème année collège (Maroc). Quiz IA, flashcards SRS, stats.",
  applicationName: "Hub 3AC",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hub 3AC",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Hub 3AC",
    title: "Hub 3AC — Révisions",
    description: "Révisions intelligentes pour la 3AC",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
