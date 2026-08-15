"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Package,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  CreditCard,
  PlusCircle,
  List,
  Wrench,
  Warehouse,
  ArrowRightLeft,
  AlertTriangle,
  TrendingUp,
  Building2,
  Truck,
  LayoutGrid,
  UserCheck,
  Clock,
  Calendar,
  DollarSign,
  User,
  Settings,
  Bell,
  ShieldCheck,
  FileBarChart,
  PieChart
} from "lucide-react";
import { hasAnyPermission, hasPermission, isOwner } from "@/utils/permissions";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface SubMenuItem {
  name: string;
  href: string;
  icon?: any;
  /** Permission codes needed (any one is sufficient). Omit = always visible. */
  permissions?: string[];
}

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  /** Permission codes needed (any one is sufficient). Omit = always visible. */
  permissions?: string[];
  children?: SubMenuItem[];
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Job Cards",
    icon: Wrench,
    permissions: ["jobs.view", "jobs.create", "jobs.edit"],
    children: [
      { name: "All Jobs", href: "/jobs", icon: List, permissions: ["jobs.view"] },
      { name: "New Job Card", href: "/jobs/create", icon: PlusCircle, permissions: ["jobs.create"] },
    ]
  },
  {
    name: "Invoicing",
    icon: FileText,
    permissions: ["invoices.view", "invoices.create", "invoices.edit", "invoices.payment", "invoices.customer"],
    children: [
      { name: "All Invoices", href: "/invoicing", icon: List, permissions: ["invoices.view"] },
      { name: "Create Invoice", href: "/invoicing/create", icon: PlusCircle, permissions: ["invoices.create"] },
      { name: "Customers", href: "/customers", icon: Users, permissions: ["invoices.customer"] },
      { name: "Payments", href: "/invoicing/payments", icon: CreditCard, permissions: ["invoices.payment"] },
    ]
  },
  {
    name: "Stock Management",
    icon: Package,
    permissions: ["stock.view", "stock.create", "stock.edit", "stock.grn", "stock.transfer", "stock.supplier"],
    children: [
      { name: "Stock Dashboard", href: "/stock", icon: LayoutGrid, permissions: ["stock.view"] },
      { name: "Item Catalog", href: "/stock/items", icon: List, permissions: ["stock.view"] },
      { name: "Purchase Orders (PO)", href: "/stock/po", icon: FileText, permissions: ["stock.view"] },
      { name: "Create PO", href: "/stock/po/create", icon: PlusCircle, permissions: ["stock.create"] },
      { name: "Goods Received (GRN)", href: "/stock/grn", icon: Truck, permissions: ["stock.grn"] },
      { name: "Create GRN", href: "/stock/grn/create", icon: PlusCircle, permissions: ["stock.grn"] },
      { name: "Warehouses", href: "/stock/warehouses", icon: Warehouse, permissions: ["stock.view"] },
      { name: "Stock Transfers", href: "/stock/transfers", icon: ArrowRightLeft, permissions: ["stock.transfer"] },
      { name: "Low Stock Alerts", href: "/stock/low-stock", icon: AlertTriangle, permissions: ["stock.view"] },
      { name: "Stock Reports", href: "/stock/reports", icon: TrendingUp, permissions: ["stock.reports"] },
      { name: "Suppliers", href: "/stock/suppliers", icon: Building2, permissions: ["stock.supplier"] },
    ]
  },
  {
    name: "HR & Payroll",
    icon: Users,
    permissions: ["hr.view", "hr.add", "hr.edit", "hr.attendance", "hr.leave", "hr.payroll", "hr.payslip",
                  "employees.view", "attendance.view", "leave.view", "payroll.view"],
    children: [
      { name: "HR Dashboard", href: "/hr", icon: LayoutGrid, permissions: ["hr.view", "employees.view"] },
      { name: "Employee Directory", href: "/hr/employees", icon: Users, permissions: ["hr.view", "employees.view"] },
      { name: "Attendance Tracking", href: "/hr/attendance", icon: Clock, permissions: ["hr.attendance", "attendance.view"] },
      { name: "Leave Management", href: "/hr/leave", icon: Calendar, permissions: ["hr.leave", "leave.view"] },
      { name: "Payroll & Payslips", href: "/hr/payroll", icon: DollarSign, permissions: ["hr.payroll", "hr.payslip", "payroll.view"] },
      // Self-portal: always visible to any logged-in user
      { name: "My Self-Portal", href: "/hr/portal", icon: User },
    ]
  },
  {
    name: "Reports",
    icon: BarChart2,
    permissions: ["reports.view", "reports.export", "reports.finance", "reports.hr",
                  "rep.view", "rep.export", "rep.finance", "rep.hr"],
    children: [
      { name: "Reports Hub", href: "/reports", icon: FileBarChart, permissions: ["reports.view", "rep.view"] },
      { name: "Attendance Report", href: "/reports/attendance", icon: Clock, permissions: ["reports.hr", "rep.hr", "hr.attendance", "attendance.view"] },
      { name: "Stock Reports", href: "/stock/reports", icon: PieChart, permissions: ["stock.reports", "reports.view", "rep.view"] },
    ]
  },
  {
    name: "System Settings",
    icon: Settings,
    permissions: ["roles.view", "roles.create", "users.view", "users.create", "settings.modules",
                  "set.roles", "set.users", "set.modules", "set.company"],
    children: [
      { name: "Module Management", href: "/settings/modules", icon: LayoutGrid, permissions: ["settings.modules", "set.modules"] },
      { name: "Roles & Permissions", href: "/settings/roles", icon: ShieldCheck, permissions: ["roles.view", "roles.create", "set.roles"] },
      { name: "User Accounts", href: "/settings/users", icon: UserCheck, permissions: ["users.view", "users.create", "set.users"] },
      { name: "Company Profile", href: "/settings/company", icon: Building2, permissions: ["settings.company", "set.company"] },
      { name: "HR Settings", href: "/settings/hr", icon: Settings, permissions: ["hr.edit", "hr.view"] },
      { name: "Notifications", href: "/settings/notifications", icon: Bell },
      { name: "My Account", href: "/settings/account", icon: User },
    ]
  },
];

/** Check if a nav item (or its children) should be visible to the current user. */
function canSeeItem(item: NavItem | SubMenuItem, owner: boolean): boolean {
  if (owner) return true;
  if (!item.permissions || item.permissions.length === 0) return true;
  return hasAnyPermission(item.permissions);
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [owner, setOwner] = useState(false);
  const [permReady, setPermReady] = useState(false);

  // Read permissions client-side after mount (localStorage is not available during SSR)
  useEffect(() => {
    setOwner(isOwner());
    setPermReady(true);
  }, []);

  // Auto expand submenu if current page is within that submenu
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => pathname === child.href || (child.href !== "/" && pathname.startsWith(child.href))
        );
        if (isChildActive) {
          setOpenSubmenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Filter nav items by permission
  const visibleNav = navItems
    .map((item) => {
      if (!permReady) return item; // Show all until permissions loaded to avoid flicker
      if (!canSeeItem(item, owner)) return null;
      if (item.children) {
        const visibleChildren = item.children.filter(c => canSeeItem(c, owner));
        if (visibleChildren.length === 0) return null;
        return { ...item, children: visibleChildren };
      }
      return item;
    })
    .filter(Boolean) as NavItem[];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col bg-[#00184d] text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Area */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div className={`font-bold text-xl tracking-wider truncate transition-opacity duration-300 ${!isOpen && "lg:opacity-0 lg:w-0"}`}>
            ERP System
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors hidden lg:block"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {visibleNav.map((item) => {
            const Icon = item.icon;

            // Item has children submenus
            if (item.children) {
              const isSubmenuOpen = !!openSubmenus[item.name];
              const isAnyChildActive = item.children.some(
                (child) => pathname === child.href || (child.href !== "/invoicing" && pathname.startsWith(child.href))
              );

              return (
                <div key={item.name} className="relative group">
                  {/* Parent Toggle Button */}
                  <button
                    onClick={() => {
                      if (!isOpen) {
                        setIsOpen(true);
                        setOpenSubmenus((prev) => ({ ...prev, [item.name]: true }));
                      } else {
                        toggleSubmenu(item.name);
                      }
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isAnyChildActive
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon size={22} className="flex-shrink-0" />
                      <span className={`whitespace-nowrap truncate transition-all duration-300 ${!isOpen ? "opacity-0 translate-x-4 w-0 hidden lg:block" : "opacity-100 translate-x-0"}`}>
                        {item.name}
                      </span>
                    </div>

                    {isOpen && (
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 flex-shrink-0 text-white/70 ${isSubmenuOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Submenu items - Expanded Sidebar */}
                  {isOpen && isSubmenuOpen && (
                    <div className="mt-1 ml-4 pl-3 border-l border-white/15 space-y-1 animate-in fade-in duration-200">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`
                              flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150
                              ${isChildActive
                                ? "bg-white/20 text-white font-semibold"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                              }
                            `}
                          >
                            {ChildIcon && <ChildIcon size={16} className="flex-shrink-0" />}
                            <span className="truncate">{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Flyout Submenu for Collapsed Sidebar */}
                  {!isOpen && (
                    <div className="absolute left-full top-0 ml-2 w-48 bg-[#00184d] border border-white/15 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-3 py-1.5 font-semibold text-xs text-white/50 border-b border-white/10 uppercase tracking-wider mb-1">
                        {item.name}
                      </div>
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`
                              flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                              ${isChildActive
                                ? "bg-white/20 text-white font-medium"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                              }
                            `}
                          >
                            {ChildIcon && <ChildIcon size={16} />}
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular Single Nav Item
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
                title={!isOpen ? item.name : undefined}
              >
                <Icon size={22} className="flex-shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen ? "opacity-0 translate-x-4 w-0 hidden lg:block" : "opacity-100 translate-x-0"}`}>
                  {item.name}
                </span>

                {/* Tooltip for minimized state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-xs text-white rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Area: Business Switcher */}
        <div className="p-4 border-t border-white/10 shrink-0 relative">
          <div className="relative">
            <button
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                }
                const btn = document.getElementById("biz-switcher-popover");
                if (btn) btn.classList.toggle("hidden");
              }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                  PA
                </div>
                {isOpen && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-none truncate text-slate-100">Perera Auto Service</p>
                    <p className="text-[10px] text-white/50 mt-0.5 leading-none font-medium truncate">Car Service Station</p>
                  </div>
                )}
              </div>
              {isOpen && <ChevronDown size={14} className="text-white/40 shrink-0" />}
            </button>

            {/* Popover container */}
            <div
              id="biz-switcher-popover"
              className="absolute bottom-full left-0 right-0 mb-2 bg-[#001440] border border-white/10 rounded-xl shadow-2xl p-2 hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="px-2 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/5 mb-1.5">
                Switch Business
              </div>

              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold"
                >
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">
                    PA
                  </div>
                  <span className="truncate">Perera Auto Service</span>
                </Link>

                <Link
                  href="/"
                  onClick={() => alert("Simulating switching to Perera Retail Mart workspace...")}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white text-xs"
                >
                  <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">
                    PR
                  </div>
                  <span className="truncate">Perera Retail Mart</span>
                </Link>
              </div>

              <div className="border-t border-white/5 mt-2 pt-1.5">
                <Link
                  href="/owner"
                  className="w-full flex items-center justify-center py-1.5 text-[10px] font-bold text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Manage All Businesses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
