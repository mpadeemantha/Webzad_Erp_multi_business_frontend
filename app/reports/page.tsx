"use client";

import Link from "next/link";
import {
  BarChart2, Clock, FileText, DollarSign, Package, Users,
  TrendingUp, ArrowRight, Calendar, Activity, ChevronRight
} from "lucide-react";

const reportCategories = [
  {
    title: "Attendance Reports",
    description: "Daily, weekly and monthly attendance summaries, absent trends, and punctuality analysis.",
    href: "/reports/attendance",
    icon: Clock,
    color: "from-sky-500 to-cyan-600",
    bg: "bg-sky-50",
    text: "text-sky-600",
    badge: "HR",
    badgeColor: "bg-sky-100 text-sky-700",
    stats: ["Present/Absent trends", "Late arrivals", "Leave summaries"],
  },
  {
    title: "Revenue Reports",
    description: "Track daily, weekly and monthly revenue with invoice and payment breakdowns.",
    href: "/reports/revenue",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "Finance",
    badgeColor: "bg-emerald-100 text-emerald-700",
    stats: ["Revenue trends", "Invoice summaries", "Overdue amounts"],
  },
  {
    title: "Stock Reports",
    description: "Inventory valuation, low stock alerts, movement history and supplier performance.",
    href: "/stock/reports",
    icon: Package,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    badge: "Inventory",
    badgeColor: "bg-violet-100 text-violet-700",
    stats: ["Stock valuation", "Low stock alerts", "Movement history"],
  },
  {
    title: "Payroll Reports",
    description: "Monthly payroll summaries, salary disbursements, and deductions breakdown.",
    href: "/hr/payroll",
    icon: DollarSign,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    badge: "HR",
    badgeColor: "bg-amber-100 text-amber-700",
    stats: ["Salary runs", "Deductions", "Net payouts"],
  },
  {
    title: "Job Card Reports",
    description: "Service completion rates, technician performance, and job turnaround times.",
    href: "/reports/jobs",
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "Operations",
    badgeColor: "bg-blue-100 text-blue-700",
    stats: ["Completion rates", "Technician KPIs", "Turnaround times"],
  },
  {
    title: "Customer Reports",
    description: "Customer activity, top clients by revenue, and repeat visit analysis.",
    href: "/reports/customers",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    text: "text-rose-600",
    badge: "CRM",
    badgeColor: "bg-rose-100 text-rose-700",
    stats: ["Top customers", "Repeat visits", "Revenue by customer"],
  },
];

const quickStats = [
  { label: "Monthly Revenue", value: "Rs. 1.28M", change: "+18.4%", up: true, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Attendance Rate", value: "82.3%", change: "+3.1%", up: true, icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
  { label: "Open Job Cards", value: "23", change: "+3 today", up: true, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Overdue Invoices", value: "Rs. 67.8K", change: "5 invoices", up: false, icon: BarChart2, color: "text-rose-600", bg: "bg-rose-50" },
];

export default function ReportsHubPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analytics</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-xs font-semibold text-[#00184d] uppercase tracking-wider">Reports Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports &amp; Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Business intelligence — all your reports in one place.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity size={13} className="text-emerald-500" />
          <span>Live data · Updated just now</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900 mt-1 leading-none">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <Icon size={18} className={s.color} />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center gap-1.5">
                <TrendingUp size={12} className={s.up ? "text-emerald-500" : "text-rose-400"} />
                <span className={`text-xs font-semibold ${s.up ? "text-emerald-600" : "text-rose-500"}`}>{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Categories Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4">All Report Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {reportCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-[#00184d] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                  {cat.description}
                </p>

                <ul className="space-y-1.5 mb-4">
                  {cat.stats.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.bg}`} />
                      {s}
                    </li>
                  ))}
                </ul>

                <div className={`flex items-center gap-1.5 text-xs font-semibold ${cat.text} group-hover:gap-2.5 transition-all`}>
                  View Report <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links Row */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 mb-4">Quick Report Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today's Attendance", href: "/reports/attendance", icon: Clock, color: "bg-sky-50 text-sky-600 hover:bg-sky-100" },
            { label: "Monthly Revenue", href: "/reports/revenue", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
            { label: "Stock Levels", href: "/stock/reports", icon: Package, color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
            { label: "Payroll Summary", href: "/hr/payroll", icon: DollarSign, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
          ].map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.label} href={q.href} className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center ${q.color}`}>
                <Icon size={22} />
                <span className="text-xs font-semibold">{q.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
