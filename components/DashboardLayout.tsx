"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Do not render the dashboard chrome on print views, auth pages, or owner portal pages
  const isPrintView = pathname?.endsWith("/print");
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password";
  const isOwnerPage = pathname === "/owner" || (pathname?.startsWith("/owner/") ?? false);

  useEffect(() => {
    // Check authentication on route change
    const token = localStorage.getItem("accessToken");
    if (!token && !isAuthPage) {
      router.push("/login");
    } else {
      setIsAuthChecking(false);
    }
  }, [pathname, isAuthPage, router]);

  if (isAuthChecking) {
    // Don't show anything until we verify auth status to prevent flashing
    return null;
  }

  if (isPrintView || isAuthPage || isOwnerPage) {
    return <div className="bg-white min-h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <Header setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
