"use client";

import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, DollarSign, Package, Wrench, Users, ShoppingCart, Filter, Check, Trash2 } from "lucide-react";

const allNotifications = [
  { id: 1, title: "GRN-2023-001 Confirmed", body: "118 units added to Main Workshop Bay. Stock levels updated.", time: "10 minutes ago", module: "Stock", read: false, icon: Package, color: "text-purple-600 bg-purple-50" },
  { id: 2, title: "Leave Request — Kamal Wickramasinghe", body: "Submitted Casual Leave from 28 Jul – 30 Jul 2026. Pending your approval.", time: "1 hour ago", module: "HR", read: false, icon: Users, color: "text-rose-600 bg-rose-50" },
  { id: 3, title: "Low Stock Alert: Bosch DOT4 Brake Fluid", body: "Current stock: 0 units. This item is below its minimum stock level.", time: "2 hours ago", module: "Stock", read: false, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
  { id: 4, title: "Payment Received — INV-0033", body: "Rs. 45,000 recorded from Lanka Motors (Pvt) Ltd via bank transfer.", time: "3 hours ago", module: "Invoicing", read: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
  { id: 5, title: "Job Card JC-0041 Updated", body: "Status changed to 'In Progress' by Kamal Wickramasinghe.", time: "4 hours ago", module: "Jobs", read: true, icon: Wrench, color: "text-blue-600 bg-blue-50" },
  { id: 6, title: "PO-2025-008 — Expected Delivery Today", body: "Purchase Order for Suresh Traders is scheduled for delivery today. Create a GRN to receive.", time: "5 hours ago", module: "PO", read: true, icon: ShoppingCart, color: "text-indigo-600 bg-indigo-50" },
  { id: 7, title: "Invoice INV-0049 Overdue", body: "INV-0049 (Rs. 22,000) for Harsha Kumara is 3 days past due. Follow up required.", time: "Yesterday", module: "Invoicing", read: true, icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
  { id: 8, title: "Payroll Processed — July 2026", body: "Monthly payroll for 18 employees processed. Total payout: Rs. 1,284,000.", time: "2 days ago", module: "HR", read: true, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
];

const moduleFilters = ["All", "Stock", "Invoicing", "Jobs", "HR", "PO"] as const;
type ModuleFilter = typeof moduleFilters[number];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<ModuleFilter>("All");
  const [readFilter, setReadFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(allNotifications);

  const displayed = notifications.filter((n) => {
    const modMatch = filter === "All" || n.module === filter;
    const readMatch = readFilter === "all" || !n.read;
    return modMatch && readMatch;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">All system notifications across every module.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00184d] bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Check size={14} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Module Filter */}
        <div className="flex flex-wrap gap-1.5">
          {moduleFilters.map((m) => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === m ? "bg-[#00184d] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {/* Read Filter */}
        <div className="flex gap-1.5 sm:ml-auto">
          {(["all", "unread"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setReadFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                readFilter === r ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {r === "all" ? "All" : "Unread only"}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        {displayed.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <Bell size={40} className="opacity-30" />
            <p className="text-sm font-medium">No notifications found</p>
          </div>
        )}
        {displayed.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer ${!n.read ? "bg-blue-50/20" : ""}`}
            >
              {/* Icon */}
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${n.color}`}>
                <Icon size={16} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${n.read ? "text-slate-700" : "text-slate-900"}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{n.module}</span>
                  </div>
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                className="p-1 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-400 transition-colors shrink-0 mt-0.5"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
