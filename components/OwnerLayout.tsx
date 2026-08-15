"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User, Settings, Bell, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine initial state based on window size
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }

    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const [ownerProfile, setOwnerProfile] = useState<any>({
    firstName: "Roshan",
    lastName: "Perera",
    email: "owner@pereragroup.lk",
    initials: "RP",
    avatarUrl: null
  });

  useEffect(() => {
    const loadHeaderProfile = () => {
      const cached = localStorage.getItem("ownerProfile");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const fName = parsed.firstName || "Roshan";
          const lName = parsed.lastName || "Perera";
          const firstInit = fName[0] || "";
          const lastInit = lName[0] || "";
          setOwnerProfile({
            firstName: fName,
            lastName: lName,
            email: parsed.email || "owner@pereragroup.lk",
            initials: (firstInit + lastInit).toUpperCase() || "RP",
            avatarUrl: parsed.avatarUrl || null
          });
        } catch (_) {}
      }
    };

    loadHeaderProfile();
    window.addEventListener("storage", loadHeaderProfile);
    return () => window.removeEventListener("storage", loadHeaderProfile);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar Component */}
      <OwnerSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-10">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-700 transition-colors hidden lg:block"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <span className="text-slate-400 text-sm hidden md:inline">Welcome back, {ownerProfile.firstName}</span>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                  <div className="px-4 pb-2.5 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { msg: "Perera Auto Service — 3 invoices overdue", time: "1h ago" },
                      { msg: "Perera Retail Mart — Low stock: 5 items", time: "3h ago" },
                    ].map((n, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-blue-50/40 hover:bg-blue-50 transition-colors text-left">
                        <p className="text-xs font-medium text-slate-800">{n.msg}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#00184d] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden border border-slate-200">
                  {ownerProfile.avatarUrl ? (
                    <img src={ownerProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    ownerProfile.initials
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{ownerProfile.firstName} {ownerProfile.lastName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Business Owner</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 text-left flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00184d] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden border border-slate-200 shrink-0">
                      {ownerProfile.avatarUrl ? (
                        <img src={ownerProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        ownerProfile.initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{ownerProfile.firstName} {ownerProfile.lastName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{ownerProfile.email}</p>
                    </div>
                  </div>
                  <Link href="/owner/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-colors text-left">
                    <User size={15} /> Account Settings
                  </Link>
                  <Link href="/login" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100">
                    <LogOut size={15} /> Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
