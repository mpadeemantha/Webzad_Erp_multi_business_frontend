"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutGrid, PlusCircle, Settings, } from "lucide-react";

interface OwnerSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function OwnerSidebar({ isSidebarOpen, setIsSidebarOpen }: OwnerSidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { label: "My Businesses", href: "/owner", icon: LayoutGrid },
    { label: "Create Business", href: "/owner/create", icon: PlusCircle },
    { label: "Account Settings", href: "/owner/account", icon: Settings },
  ];

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col bg-[#00184d] text-white shadow-xl
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 shrink-0">
        <Link href="/owner" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-white" />
          </div>
          <div className={`font-bold text-base tracking-tight truncate transition-opacity duration-300 ${!isSidebarOpen && "lg:opacity-0 lg:w-0"}`}>
            Owner Portal
          </div>
        </Link>

      </div>

      {/* Sidebar Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/owner" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={22} className="flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? "opacity-0 translate-x-4 w-0 hidden lg:block" : "opacity-100 translate-x-0"}`}>
                {link.label}
              </span>

              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-xs text-white rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 text-white/40 text-xs font-semibold">
          {isSidebarOpen ? <span className="truncate">Owner Control Center</span> : <span className="text-center w-full">OCC</span>}
        </div>
      </div>
    </aside>
  );
}
