"use client";

import Link from "next/link";
import { Warehouse, Package, TrendingUp, ArrowRightLeft, ChevronRight, AlertTriangle } from "lucide-react";

const warehouses = [
  {
    id: "main-workshop-bay",
    name: "Main Workshop Bay",
    code: "WH-001",
    location: "Ground Floor, East Wing",
    manager: "Saman Perera",
    totalSKUs: 58,
    totalValue: 2100000,
    capacity: 72,
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-700",
    border: "border-blue-100",
    items: [
      { sku: "SPK-NGK-IRID", name: "NGK Iridium Spark Plug Set",    stock: 35, min: 10, status: "In Stock" },
      { sku: "FLT-AIR-HND",  name: "Honda Civic Air Filter Element", stock: 24, min: 8,  status: "In Stock" },
      { sku: "ELE-BAT-65AH", name: "Amaron Pro 65Ah Car Battery",   stock: 6,  min: 4,  status: "In Stock" },
      { sku: "OIL-GTX-10W40", name: "Castrol GTX 10W-40 (4L)",     stock: 30, min: 12, status: "In Stock" },
    ],
  },
  {
    id: "parts-storeroom-a",
    name: "Parts Storeroom A",
    code: "WH-002",
    location: "Rear Building, Level 1",
    manager: "Nimal Fernando",
    totalSKUs: 65,
    totalValue: 2400000,
    capacity: 85,
    color: "bg-violet-500",
    lightBg: "bg-violet-50",
    textColor: "text-violet-700",
    border: "border-violet-100",
    items: [
      { sku: "OIL-MOB-5W30",  name: "Mobil 1 Engine Oil 5W-30",      stock: 48, min: 15, status: "In Stock" },
      { sku: "BRK-PAD-TOY",   name: "Toyota Prius Brake Pad Set",     stock: 8,  min: 10, status: "Low Stock" },
      { sku: "FLD-DOT4-500",  name: "Bosch DOT4 Brake Fluid 500ml",   stock: 0,  min: 12, status: "Out of Stock" },
      { sku: "BRK-DSC-HND",   name: "Honda Civic Brake Disc Rotor",   stock: 14, min: 5,  status: "In Stock" },
      { sku: "FLT-OIL-SUZ",   name: "Suzuki Swift Oil Filter",        stock: 3,  min: 8,  status: "Low Stock" },
    ],
  },
  {
    id: "tyre-bay",
    name: "Tyre Bay",
    code: "WH-003",
    location: "Forecourt — Left Side",
    manager: "Ashan Wijesuriya",
    totalSKUs: 19,
    totalValue: 350000,
    capacity: 35,
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    textColor: "text-amber-700",
    border: "border-amber-100",
    items: [
      { sku: "TYR-BCH-205", name: "Bridgestone Ecopia 205/55R16", stock: 2,  min: 6, status: "Low Stock" },
      { sku: "TYR-APL-185", name: "Apollo Amazer 185/65R15",      stock: 12, min: 4, status: "In Stock" },
      { sku: "TYR-MRF-195", name: "MRF ZVTV 195/65R15",          stock: 8,  min: 4, status: "In Stock" },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Stock":    "bg-green-100 text-green-700 border-green-200",
    "Low Stock":   "bg-amber-100 text-amber-700 border-amber-200",
    "Out of Stock":"bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[status] ?? ""}`}>{status}</span>
  );
}

export default function WarehousesPage() {
  const totalValue  = warehouses.reduce((s, w) => s + w.totalValue, 0);
  const totalSKUs   = warehouses.reduce((s, w) => s + w.totalSKUs, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Management</h1>
          <p className="text-slate-500 text-sm mt-1">View stock per location, track capacity, and manage inter-warehouse transfers.</p>
        </div>
        <Link href="/stock/transfers"
          className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
          <ArrowRightLeft size={16} /> Transfer Stock
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-xl"><Warehouse size={22} className="text-[#00184d]" /></div>
          <div>
            <p className="text-sm text-slate-500">Total Warehouses</p>
            <p className="text-2xl font-bold text-slate-900">{warehouses.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-violet-50 rounded-xl"><Package size={22} className="text-violet-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Total SKUs Stored</p>
            <p className="text-2xl font-bold text-slate-900">{totalSKUs}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl"><TrendingUp size={22} className="text-green-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Combined Stock Value</p>
            <p className="text-2xl font-bold text-slate-900">Rs. {(totalValue / 1000000).toFixed(2)}M</p>
          </div>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => (
          <div key={wh.id} className={`bg-white rounded-2xl shadow-sm border ${wh.border} overflow-hidden flex flex-col`}>
            {/* Card Header */}
            <div className={`${wh.lightBg} px-5 py-4 border-b ${wh.border}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[11px] font-bold ${wh.textColor} bg-white/70 px-2 py-0.5 rounded font-mono`}>{wh.code}</span>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{wh.name}</h2>
                  <p className="text-xs text-slate-500">{wh.location}</p>
                </div>
                <div className={`p-2.5 ${wh.lightBg} rounded-xl border ${wh.border}`}>
                  <Warehouse size={20} className={wh.textColor} />
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Capacity Used</span>
                  <span className="font-bold text-slate-700">{wh.capacity}%</span>
                </div>
                <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${wh.color} transition-all`} style={{ width: `${wh.capacity}%` }} />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
              <div className="px-5 py-3 text-center">
                <p className="text-xl font-bold text-slate-900">{wh.totalSKUs}</p>
                <p className="text-xs text-slate-500">SKUs</p>
              </div>
              <div className="px-5 py-3 text-center">
                <p className="text-base font-bold text-slate-900">Rs. {(wh.totalValue / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-slate-500">Stock Value</p>
              </div>
            </div>

            {/* Item list */}
            <div className="flex-1 divide-y divide-slate-50">
              {wh.items.map((item) => (
                <div key={item.sku} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{item.sku}</p>
                  </div>
                  <div className="shrink-0 ml-3 text-right">
                    <span className={`font-bold text-sm ${item.stock < item.min ? "text-amber-600" : "text-slate-700"}`}>{item.stock}</span>
                    <div className="mt-0.5"><StatusBadge status={item.status} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
              <p className="text-xs text-slate-500">Manager: <strong className="text-slate-700">{wh.manager}</strong></p>
              <Link href="/stock/transfers"
                className={`text-xs font-semibold ${wh.textColor} hover:underline flex items-center gap-1`}>
                Transfer <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
