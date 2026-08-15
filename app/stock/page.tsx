"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRightLeft,
  Layers,
  FileCheck,
  Warehouse,
  Truck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";

const kpiCards = [
  {
    label: "Total Inventory Value",
    value: "Rs. 4,850,000",
    sub: "+Rs. 320,000 this month",
    trend: "up",
    icon: Layers,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Total SKUs Tracked",
    value: "142 Items",
    sub: "Across 3 warehouses",
    trend: "up",
    icon: Package,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    label: "Low Stock Alerts",
    value: "4 Items",
    sub: "Needs immediate reorder",
    trend: "down",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    label: "GRNs Confirmed",
    value: "18 GRNs",
    sub: "This month",
    trend: "up",
    icon: FileCheck,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    label: "Pending Transfers",
    value: "2 Transfers",
    sub: "Awaiting confirmation",
    trend: "neutral",
    icon: ArrowRightLeft,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
];

const lowStockItems = [
  { sku: "BRK-PAD-TOY", name: "Toyota Prius Front Brake Pad Set", stock: 8, min: 10, shortfall: 2, severity: "Low", supplier: "Toyota Lanka" },
  { sku: "TYR-BCH-205", name: "Bridgestone Ecopia 205/55R16 Tyre", stock: 2, min: 6, shortfall: 4, severity: "Low", supplier: "Bridgestone Lanka" },
  { sku: "FLD-DOT4-500", name: "Bosch DOT4 Brake Fluid 500ml", stock: 0, min: 12, shortfall: 12, severity: "Critical", supplier: "Bosch Lanka" },
  { sku: "FLT-OIL-SUZ", name: "Suzuki Swift Oil Filter Element", stock: 3, min: 8, shortfall: 5, severity: "Low", supplier: "Suzuki Parts Lanka" },
];

const recentMovements = [
  { type: "IN", desc: "GRN-2023-001 Confirmed", item: "Mobil 1 Engine Oil 5W-30", qty: "+98 Units", date: "Today, 2:15 PM", icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
  { type: "OUT", desc: "Job JOB-0041 — Parts Used", item: "Toyota Brake Pad Set", qty: "-2 Units", date: "Today, 11:30 AM", icon: ArrowDownRight, color: "text-red-500", bg: "bg-red-50" },
  { type: "IN", desc: "GRN-2023-003 Direct Entry", item: "NGK Iridium Spark Plugs (×4)", qty: "+35 Units", date: "Yesterday", icon: ArrowUpRight, color: "text-green-600", bg: "bg-green-50" },
  { type: "TRANSFER", desc: "Transfer TRF-006 Completed", item: "Engine Air Filters", qty: "8 Units → Tyre Bay", date: "Oct 26, 2023", icon: ArrowRightLeft, color: "text-blue-600", bg: "bg-blue-50" },
  { type: "OUT", desc: "Invoice INV-0033 — Parts Used", item: "Bosch DOT4 Brake Fluid", qty: "-4 Units", date: "Oct 25, 2023", icon: ArrowDownRight, color: "text-red-500", bg: "bg-red-50" },
];

const weeklyBars = [62, 88, 45, 120, 75, 95, 110];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxBar = Math.max(...weeklyBars);

const warehouses = [
  { name: "Main Workshop Bay", items: 58, value: "Rs. 2,100,000", fill: 72, color: "bg-blue-500" },
  { name: "Parts Storeroom A", items: 65, value: "Rs. 2,400,000", fill: 85, color: "bg-violet-500" },
  { name: "Tyre Bay", items: 19, value: "Rs. 350,000", fill: 35, color: "bg-amber-500" },
];

export default function StockDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Management Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time inventory levels, incoming goods, warehouse status, and low-stock alerts.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/stock/grn/create" className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Truck size={16} />
            Create GRN
          </Link>
          <Link href="/stock/items/create" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Plus size={16} />
            Add Item
          </Link>
          <Link href="/stock/transfers" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
            <ArrowRightLeft size={16} />
            Transfer Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border ${card.border} flex flex-col gap-3`}>
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
                {card.trend === "up" && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑</span>}
                {card.trend === "down" && <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">↓</span>}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Low Stock Alert Panel */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-amber-50 bg-amber-50/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Low Stock Alerts</h2>
                <p className="text-xs text-slate-500">{lowStockItems.length} items below reorder threshold</p>
              </div>
            </div>
            <Link href="/stock/low-stock" className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {lowStockItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.severity === "Critical" ? "bg-red-500 animate-pulse" : "bg-amber-400"}`} />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{item.sku} • {item.supplier}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`font-bold text-sm ${item.severity === "Critical" ? "text-red-600" : "text-amber-600"}`}>
                    {item.stock} / {item.min} units
                  </p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.severity === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.severity} • Need {item.shortfall} more
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/40">
            <Link href="/stock/grn/create" className="w-full text-center text-xs font-semibold text-[#00184d] hover:underline flex items-center justify-center gap-1">
              <Plus size={13} /> Create GRN to restock these items
            </Link>
          </div>
        </div>

        {/* Weekly Stock Movement Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Weekly Stock Movement</h2>
              <p className="text-xs text-slate-500">Items received this week</p>
            </div>
            <BarChart3 size={18} className="text-slate-400" />
          </div>
          <div className="flex items-end gap-2 h-32 pt-2">
            {weeklyBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#00184d]/10 hover:bg-[#00184d]/25 rounded-t-md transition-colors relative group cursor-pointer"
                  style={{ height: `${(h / maxBar) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#00184d] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 rounded shadow">
                    {h} items
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{weekDays[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Total this week: <strong className="text-slate-800">595 units</strong></span>
            <Link href="/stock/reports" className="font-semibold text-[#00184d] hover:underline">Full Report →</Link>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Warehouse Breakdown */}
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Warehouse size={18} className="text-[#00184d]" />
              Warehouse Status
            </h2>
            <Link href="/stock/warehouses" className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1">
              Manage <ChevronRight size={14} />
            </Link>
          </div>
          {warehouses.map((wh, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{wh.name}</p>
                <span className="text-xs font-bold text-slate-500">{wh.items} SKUs</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${wh.color} transition-all duration-700`} style={{ width: `${wh.fill}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{wh.fill}% capacity used</span>
                <span className="text-[11px] font-bold text-slate-600">{wh.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Stock Movements */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Stock Movements</h2>
            <Link href="/stock/reports" className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1">
              Full Log <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMovements.map((move, i) => {
              const Icon = move.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className={`p-2 rounded-lg ${move.bg} shrink-0`}>
                    <Icon size={16} className={move.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{move.item}</p>
                    <p className="text-xs text-slate-400">{move.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${move.color}`}>{move.qty}</p>
                    <p className="text-[11px] text-slate-400">{move.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Nav Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Item Catalog", href: "/stock/items", icon: Package, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Goods Received", href: "/stock/grn", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Warehouses", href: "/stock/warehouses", icon: Warehouse, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Transfers", href: "/stock/transfers", icon: ArrowRightLeft, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Stock Reports", href: "/stock/reports", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Suppliers", href: "/stock/suppliers", icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((link, i) => {
          const Icon = link.icon;
          return (
            <Link key={i} href={link.href}
              className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className={`p-2.5 rounded-xl ${link.bg} group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={link.color} />
              </div>
              <span className="text-xs font-semibold text-slate-700">{link.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
