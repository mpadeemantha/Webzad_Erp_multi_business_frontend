"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wrench, FileText, Package, Users, ShoppingCart, AlertTriangle,
  TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, DollarSign,
  BarChart2, Activity, Bell, Truck, Building2, Loader2
} from "lucide-react";
import { getBusiness, Business } from "@/utils/api/business";

const kpis = [
  {
    label: "Today's Revenue",
    value: "Rs. 128,450",
    sub: "4 invoices paid",
    change: "+12%",
    up: true,
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    label: "Open Job Cards",
    value: "23",
    sub: "7 in progress",
    change: "+3 today",
    up: true,
    icon: Wrench,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    label: "Overdue Invoices",
    value: "Rs. 67,800",
    sub: "5 invoices",
    change: "Action needed",
    up: false,
    icon: FileText,
    color: "from-rose-500 to-red-600",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    label: "Low Stock Items",
    value: "8 Items",
    sub: "3 critical",
    change: "Restock needed",
    up: false,
    icon: AlertTriangle,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    label: "Pending POs",
    value: "4",
    sub: "Rs. 312,000 total",
    change: "Awaiting delivery",
    up: true,
    icon: ShoppingCart,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    label: "Staff Present Today",
    value: "18 / 24",
    sub: "3 on leave",
    change: "75% attendance",
    up: true,
    icon: Users,
    color: "from-sky-500 to-cyan-600",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
];

const recentJobs = [
  { id: "JC-0041", vehicle: "CAB-1234", customer: "Nimal Perera", service: "Engine Service + Oil Change", worker: "Kamal W.", status: "In Progress", time: "9:14 AM" },
  { id: "JC-0040", vehicle: "WP-GA-3391", customer: "Sunil Fernando", service: "Tyre Replacement (x4)", worker: "Pradeep S.", status: "Completed", time: "8:30 AM" },
  { id: "JC-0039", vehicle: "NB-2210", customer: "Ranjani Silva", service: "Brake Pad Replacement", worker: "Kamal W.", status: "Pending", time: "7:55 AM" },
  { id: "JC-0038", vehicle: "SGK-4401", customer: "Asanka Bandara", service: "Full Vehicle Wash", worker: "Ruwan P.", status: "Delivered", time: "Yesterday" },
];

const recentInvoices = [
  { id: "INV-0052", customer: "Nimal Perera", amount: "Rs. 18,500", status: "Unpaid", date: "Today" },
  { id: "INV-0051", customer: "Lanka Motors", amount: "Rs. 45,000", status: "Paid", date: "Today" },
  { id: "INV-0050", customer: "Sunil Fernando", amount: "Rs. 8,200", status: "Paid", date: "Yesterday" },
  { id: "INV-0049", customer: "Harsha Kumara", amount: "Rs. 22,000", status: "Overdue", date: "3 days ago" },
];

const alerts = [
  { icon: AlertTriangle, color: "text-rose-500 bg-rose-50", msg: "Bosch DOT4 Brake Fluid — 0 units left (Critical)", link: "/stock/low-stock" },
  { icon: AlertTriangle, color: "text-amber-500 bg-amber-50", msg: "Engine Oil 10W-40 — 4 units (Below reorder point)", link: "/stock/low-stock" },
  { icon: Bell, color: "text-blue-500 bg-blue-50", msg: "Kamal Wickramasinghe — Leave request awaiting approval", link: "/hr/leave" },
  { icon: Truck, color: "text-purple-500 bg-purple-50", msg: "PO-2025-008 expected delivery today", link: "/stock/po" },
];

const statusColors: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-emerald-100 text-emerald-700",
  "Delivered": "bg-slate-100 text-slate-600",
  "Paid": "bg-emerald-100 text-emerald-700",
  "Unpaid": "bg-amber-100 text-amber-700",
  "Overdue": "bg-rose-100 text-rose-700",
};

const monthlyRevenue = [42, 58, 47, 80, 63, 91, 74, 102, 87, 115, 98, 128];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#00184d]" size={36} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const maxBar = Math.max(...monthlyRevenue);

  const [business, setBusiness] = useState<Business | null>(null);

  // On mount: pick up businessId from URL param (if coming from owner portal)
  // then persist it in localStorage so navigation within the dashboard keeps context
  useEffect(() => {
    const paramId = searchParams.get("businessId");
    const storedId = typeof window !== "undefined" ? localStorage.getItem("activeBizId") : null;
    const bizId = paramId ?? storedId;
    if (!bizId) return;
    if (paramId) localStorage.setItem("activeBizId", paramId);
    getBusiness(bizId)
      .then(setBusiness)
      .catch(() => {/* silently ignore if token unavailable on this context */});
  }, [searchParams]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Business Context Banner */}
      {business && (
        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl shadow-sm px-5 py-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00184d] to-[#0059b3] flex items-center justify-center text-white font-black text-sm shrink-0 overflow-hidden">
            {business.logoUrl
              ? <img src={business.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              : business.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium">Viewing dashboard for</p>
            <p className="text-sm font-bold text-slate-800 truncate">{business.name}</p>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
            business.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : business.status === "SUSPENDED"
              ? "bg-rose-100 text-rose-700 border-rose-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}>
            {business.status ?? "ACTIVE"}
          </span>
          <Link
            href="/owner"
            className="shrink-0 text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1 ml-2"
          >
            ← Switch Business
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Command Centre</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-LK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} — Good morning{business ? `, ${business.name}` : ", Admin"}!
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity size={13} className="text-emerald-500" />
          <span>Live data · Updated just now</span>
        </div>
      </div>


      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{k.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1.5 leading-none">{k.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
                </div>
                <div className={`p-3 rounded-xl ${k.bg}`}>
                  <Icon size={22} className={k.text} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5">
                {k.up
                  ? <TrendingUp size={13} className="text-emerald-500" />
                  : <XCircle size={13} className="text-rose-400" />
                }
                <span className={`text-xs font-semibold ${k.up ? "text-emerald-600" : "text-rose-500"}`}>{k.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Revenue Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly revenue (Rs. thousands)</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">+18.4% YoY</span>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {monthlyRevenue.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-md hover:from-blue-700 hover:to-indigo-500 transition-all cursor-pointer relative"
                  style={{ height: `${(v / maxBar) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Rs. {v}k
                  </div>
                </div>
                <span className="text-[9px] text-slate-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">System Alerts</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => {
              const Icon = a.icon;
              return (
                <Link key={i} href={a.link} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className={`p-1.5 rounded-lg shrink-0 ${a.color}`}>
                    <Icon size={14} />
                  </div>
                  <p className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">{a.msg}</p>
                </Link>
              );
            })}
          </div>
          <Link href="/notifications" className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#00184d] hover:underline border-t border-slate-100 pt-3">
            View all alerts <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Bottom Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Job Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Recent Job Cards</h2>
            <Link href="/jobs" className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00184d]">{job.id}</span>
                    <span className="text-xs text-slate-400 font-mono">{job.vehicle}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{job.service}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{job.worker} · {job.time}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${statusColors[job.status]}`}>{job.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Recent Invoices</h2>
            <Link href="/invoicing" className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.map((inv) => (
              <Link key={inv.id} href={`/invoicing/${inv.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00184d]">{inv.id}</span>
                    <span className="text-xs text-slate-500">{inv.customer}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{inv.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-sm font-bold text-slate-800">{inv.amount}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>{inv.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Module Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "New Job", href: "/jobs/create", icon: Wrench, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
            { label: "New Invoice", href: "/invoicing/create", icon: FileText, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
            { label: "Stock Report", href: "/stock/reports", icon: BarChart2, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
            { label: "Create GRN", href: "/stock/grn/create", icon: Truck, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
            { label: "Run Payroll", href: "/hr/payroll", icon: DollarSign, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
            { label: "Add Employee", href: "/hr/employees/create", icon: Users, color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
          ].map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.label} href={q.href} className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${q.color}`}>
                <Icon size={22} />
                <span className="text-xs font-semibold text-center">{q.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
