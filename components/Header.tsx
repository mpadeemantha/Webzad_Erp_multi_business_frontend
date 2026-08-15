"use client";

import { Menu, Bell, Search, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getDecodedToken, isOwner } from "@/utils/permissions";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // User info from JWT
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [owner, setOwner] = useState(false);

  const loadHeaderProfile = () => {
    const decoded = getDecodedToken();
    if (decoded) {
      const isOwnerUser = decoded.type === "owner";
      setOwner(isOwnerUser);
      const roles = decoded.roles ?? [];
      setUserRole(isOwnerUser ? "Business Owner" : (roles[0] ?? "Staff"));

      const storageKey = isOwnerUser ? "ownerProfile" : "staffProfile";
      const profileStr = localStorage.getItem(storageKey);
      if (profileStr) {
        try {
          const profileData = JSON.parse(profileStr);
          const name: string = profileData?.name ?? "User";
          setUserName(name);
          setUserInitials(
            name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
          );
          setAvatarUrl(profileData?.avatarUrl || null);
        } catch { /* ignore */ }
      }
    }
  };

  useEffect(() => {
    loadHeaderProfile();
    window.addEventListener("storage", loadHeaderProfile);
    return () => window.removeEventListener("storage", loadHeaderProfile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("staffProfile");
    localStorage.removeItem("activeBizId");
    window.location.href = "/login";
  };

  const notifications = [
    { title: "GRN-2023-001 Confirmed", sub: "118 units added to Main Warehouse", time: "10m ago", read: false },
    { title: "Leave Request Submitted", sub: "Kamal Wickramasinghe requested Casual Leave", time: "1h ago", read: false },
    { title: "Low Stock Alert", sub: "Bosch DOT4 Brake Fluid (0 units remaining)", time: "2h ago", read: false },
    { title: "Payment Received", sub: "Rs. 45,000 recorded for INV-0033", time: "3h ago", read: true },
  ];

  return (
    <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-10 transition-all">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Owner Portal link — only show for owners */}
        {owner && (
          <Link
            href="/owner"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100/80 transition-colors"
          >
            ← Owner Portal
          </Link>
        )}

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search across all ERP modules..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 New</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className={`p-3.5 hover:bg-slate-50/70 transition-colors ${!n.read ? "bg-blue-50/20" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-xs text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{n.sub}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-semibold text-[#00184d] hover:underline"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#00184d] flex items-center justify-center text-white font-semibold text-xs shadow-sm overflow-hidden border border-slate-200/50">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-slate-700 leading-tight">{userName}</span>
              <span className="text-xs text-slate-500">{userRole}</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-sm font-medium text-slate-800">{userName}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>

              <Link
                href="/settings/account"
                onClick={() => setIsProfileOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
              >
                <User size={16} />
                My Account
              </Link>
              <Link
                href="/settings/company"
                onClick={() => setIsProfileOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
              >
                <Settings size={16} />
                System Settings
              </Link>

              {/* Owner Portal link — only shown to owners */}
              {owner && (
                <Link
                  href="/owner"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left border-t border-slate-100"
                >
                  <Settings size={16} className="text-blue-600" />
                  <span className="font-medium text-slate-700">Owner Portal</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
