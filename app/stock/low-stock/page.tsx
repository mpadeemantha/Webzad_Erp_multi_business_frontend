"use client";

import Link from "next/link";
import { AlertTriangle, Plus, Truck, Package, ShieldAlert, ChevronRight } from "lucide-react";

const lowStockItems = [
  {
    sku: "FLD-DOT4-500", name: "Bosch DOT4 Brake Fluid 500ml",            category: "Oils & Lubricants", warehouse: "Parts Storeroom A",
    supplier: "Bosch Lanka",       stock: 0,  min: 12, shortfall: 12, lastGRN: "Sep 10, 2023", severity: "Critical",
  },
  {
    sku: "BRK-PAD-TOY",  name: "Toyota Prius Front Brake Pad Set",         category: "Brake Parts",       warehouse: "Parts Storeroom A",
    supplier: "Toyota Lanka",      stock: 8,  min: 10, shortfall: 2,  lastGRN: "Oct 15, 2023", severity: "Low",
  },
  {
    sku: "TYR-BCH-205",  name: "Bridgestone Ecopia 205/55R16 Tyre",        category: "Tyres",             warehouse: "Tyre Bay",
    supplier: "Bridgestone Lanka", stock: 2,  min: 6,  shortfall: 4,  lastGRN: "Oct 05, 2023", severity: "Low",
  },
  {
    sku: "FLT-OIL-SUZ",  name: "Suzuki Swift Oil Filter Element",           category: "Filters",           warehouse: "Parts Storeroom A",
    supplier: "Honda Lanka",       stock: 3,  min: 8,  shortfall: 5,  lastGRN: "Oct 02, 2023", severity: "Low",
  },
];

const criticalCount = lowStockItems.filter(i => i.severity === "Critical").length;
const lowCount      = lowStockItems.filter(i => i.severity === "Low").length;

export default function LowStockAlertsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Low Stock Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Items that have dropped below their minimum reorder point and require restocking.</p>
        </div>
        <Link href="/stock/grn/create"
          className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
          <Truck size={16} /> Create GRN to Restock
        </Link>
      </div>

      {/* Summary Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <ShieldAlert size={22} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-red-700 font-medium">Critical (Out of Stock)</p>
            <p className="text-3xl font-bold text-red-700">{criticalCount}</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-amber-700 font-medium">Low Stock Warning</p>
            <p className="text-3xl font-bold text-amber-700">{lowCount}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-xl">
            <Package size={22} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Alerts</p>
            <p className="text-3xl font-bold text-slate-800">{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      {/* Alert Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            Items Requiring Reorder
          </h2>
          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            {lowStockItems.length} Items
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Item</th>
                <th className="px-5 py-3.5 font-semibold">Warehouse</th>
                <th className="px-5 py-3.5 font-semibold">Supplier</th>
                <th className="px-5 py-3.5 font-semibold text-center">Stock / Minimum</th>
                <th className="px-5 py-3.5 font-semibold text-center">Shortfall</th>
                <th className="px-5 py-3.5 font-semibold">Last Received</th>
                <th className="px-5 py-3.5 font-semibold">Alert Level</th>
                <th className="px-5 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lowStockItems.map((item) => (
                <tr key={item.sku} className={`transition-colors hover:bg-slate-50/60 ${item.severity === "Critical" ? "bg-red-50/30" : ""}`}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{item.sku} • {item.category}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 font-mono">{item.warehouse}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{item.supplier}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-bold text-sm ${item.stock === 0 ? "text-red-600" : "text-amber-600"}`}>{item.stock}</span>
                    <span className="text-slate-400"> / {item.min}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-bold text-sm ${item.severity === "Critical" ? "text-red-600" : "text-amber-600"}`}>
                      -{item.shortfall} units
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{item.lastGRN}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      item.severity === "Critical"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>
                      {item.severity === "Critical" ? <ShieldAlert size={11} /> : <AlertTriangle size={11} />}
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link href="/stock/grn/create"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#00184d] hover:underline">
                      <Plus size={13} /> Restock
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidance Card */}
      <div className="bg-[#00184d] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base">Ready to reorder these items?</h3>
          <p className="text-blue-200 text-sm mt-1">Create a GRN against an existing supplier Purchase Order and stock levels will update automatically once confirmed.</p>
        </div>
        <Link href="/stock/grn/create"
          className="inline-flex items-center gap-2 bg-white text-[#00184d] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shrink-0">
          Create GRN <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
