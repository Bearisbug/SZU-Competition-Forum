'use client'
import { Toaster } from "react-hot-toast";
// app/layout.tsx
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import IONavBar from "@/components/IONavBar";
import { TokenMonitor } from "@/components/TokenMonitor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>
          <main className="flex-1 min-h-[calc(110vh)] text-foreground mx-auto bg-background">
            <title>竞赛论坛</title>
            <IONavBar />
            {children}
            <TokenMonitor />
            <Toaster position="bottom-center"/>
          </main>
        </HeroUIProvider>
      </body>
    </html>
  );
}