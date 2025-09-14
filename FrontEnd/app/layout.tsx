'use client'
import { Toaster } from "react-hot-toast";
// app/layout.tsx
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import IONavBar from "@/components/IONavBar";
import { TokenMonitor } from "@/components/TokenMonitor";
import {useAuthStore} from "@/lib/auth-guards";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <html lang="en">
      <body>
        <HeroUIProvider>
          <main className="flex flex-col items-stretch text-foreground mx-auto bg-background min-h-screen">
            <title>竞赛论坛</title>
            <IONavBar />
            <div className={`${isLoggedIn ? "h-[114px]" : "h-[60px]"}`}></div>
            {children}
            <TokenMonitor />
            <Toaster position="bottom-center"/>
          </main>
        </HeroUIProvider>
      </body>
    </html>
  );
}