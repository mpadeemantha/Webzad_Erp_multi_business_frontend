"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Filter, Package, AlertTriangle, Eye, Edit3, SlidersHorizontal
} from "lucide-react";

const CATEGORIES = ["All", "Oils & Lubricants", "Brake Parts", "Filters", "Tyres", "Engine Parts", "Electrical", "Body Parts"];
const SUPPLIERS  = ["All", "Caltex Lanka", "Toyota Lanka", "Bosch Lanka", "Bridgestone Lanka", "NGK Lanka", "Honda Lanka"];
const STATUSES   = ["All", "In Stock", "Low Stock", "Out of Stock"];

const allItems = [
  { sku: "OIL-MOB-5W30", name: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)", category: "Oils & Lubricants", supplier: "Caltex Lanka", unit: "Can", warehouse: "Parts Storeroom A", stock: 48, min: 15, costPrice: 6500, sellPrice: 8500, status: "In Stock" },
  { sku: "BRK-PAD-TOY",  name: "Genuine Toyota Prius Front Brake Pad Set",     category: "Brake Parts",       supplier: "Toyota Lanka",      unit: "Set", warehouse: "Parts Storeroom A", stock: 8,  min: 10, costPrice: 8500, sellPrice: 12000, status: "Low Stock" },
  { sku: "FLT-AIR-HND",  name: "Honda Civic Engine Air Filter Element",          category: "Filters",           supplier: "Honda Lanka",       unit: "Pcs", warehouse: "Main Workshop Bay", stock: 24, min: 8,  costPrice: 2500, sellPrice: 3800, status: "In Stock" },
  { sku: "TYR-BCH-205",  name: "Bridgestone Ecopia 205/55R16 Tyre",              category: "Tyres",             supplier: "Bridgestone Lanka", unit: "Pcs", warehouse: "Tyre Bay",          stock: 2,  min: 6,  costPrice: 28000, sellPrice: 38000, status: "Low Stock" },
  { sku: "FLD-DOT4-500", name: "Bosch DOT4 Brake Fluid 500ml",                   category: "Oils & Lubricants", supplier: "Bosch Lanka",       unit: "Btl", warehouse: "Parts Storeroom A", stock: 0,  min: 12, costPrice: 1800, sellPrice: 2800, status: "Out of Stock" },
  { sku: "SPK-NGK-IRID", name: "NGK Iridium Spark Plug Set (4 Pcs)",             category: "Engine Parts",      supplier: "NGK Lanka",         unit: "Set", warehouse: "Main Workshop Bay", stock: 35, min: 10, costPrice: 12500, sellPrice: 17500, status: "In Stock" },
  { sku: "FLT-OIL-SUZ",  name: "Suzuki Swift Oil Filter Element",                category: "Filters",           supplier: "Honda Lanka",       unit: "Pcs", warehouse: "Parts Storeroom A", stock: 3,  min: 8,  costPrice: 1200, sellPrice: 1800, status: "Low Stock" },
  { sku: "BRK-DSC-HND",  name: "Honda Civic Front Brake Disc Rotor",             category: "Brake Parts",       supplier: "Honda Lanka",       unit: "Pcs", warehouse: "Parts Storeroom A", stock: 14, min: 5,  costPrice: 18000, sellPrice: 26000, status: "In Stock" },
  { sku: "ELE-BAT-65AH", name: "Amaron Pro 65Ah Car Battery",                    category: "Electrical",        supplier: "Bosch Lanka",       unit: "Pcs", warehouse: "Main Workshop Bay", stock: 6,  min: 4,  costPrice: 22000, sellPrice: 32000, status: "In Stock" },
  { sku: "OIL-GTX-10W40", name: "Castrol GTX Mineral Engine Oil 10W-40 (4L)",   category: "Oils & Lubricants", supplier: "Caltex Lanka",      unit: "Can", warehouse: "Parts Storeroom A", stock: 30, min: 12, costPrice: 4200, sellPrice: 5800, status: "In Stock" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "In Stock":    return "bg-green-100 text-green-700 border-green-200";
    case "Low Stock":   return "bg-amber-100 text-amber-700 border-amber-200";
    case "Out of Stock": return "bg-red-100 text-red-700 border-red-200";
    default:            return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function ItemCatalogPage() {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [supplier, setSupplier]     = useState("All");
  const [statusFilter, setStatus]   = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      (category === "All" || item.category === category) &&
      (supplier  === "All" || item.supplier  === supplier)  &&
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
    );
  });

  const totalValue = filtered.reduce((s, i) => s + i.stock * i.costPrice, 0);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Item Catalog</h1>
          <p className="text-slate-500 text-sm mt-1">All stock items with pricing, quantities, and warehouse locations.</p>
        </div>
        <Link href="/stock/items/create"
          className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
          <Plus size={16} /> Add New Item
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, category..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] bg-slate-50"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${showFilters ? "bg-[#00184d] text-white border-[#00184d]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Supplier</label>
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20">
                {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Stock Status</label>
              <select value={statusFilter} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between text-sm text-slate-500 px-1">
        <span><strong className="text-slate-800">{filtered.length}</strong> items found</span>
        <span>Showing stock value: <strong className="text-[#00184d]">Rs. {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-semibold">SKU</th>
                <th className="px-5 py-3.5 font-semibold">Item Name</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Warehouse</th>
                <th className="px-5 py-3.5 font-semibold text-center">Stock</th>
                <th className="px-5 py-3.5 font-semibold text-right">Cost Price</th>
                <th className="px-5 py-3.5 font-semibold text-right">Sell Price</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-[#00184d] text-xs bg-blue-50 px-2 py-0.5 rounded">{item.sku}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 max-w-xs truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.supplier} • {item.unit}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md">{item.category}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs font-mono">{item.warehouse}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-bold text-sm ${item.stock <= item.min ? (item.stock === 0 ? "text-red-600" : "text-amber-600") : "text-slate-900"}`}>
                      {item.stock}
                    </span>
                    <span className="text-slate-400 text-xs block">min {item.min}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-700">
                    Rs. {item.costPrice.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">
                    Rs. {item.sellPrice.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                      {item.status === "Low Stock" && <AlertTriangle size={10} className="inline mr-1" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/stock/items/${item.sku.toLowerCase()}`}
                        className="p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-100 rounded-lg transition-colors" title="View Detail">
                        <Eye size={16} />
                      </Link>
                      <Link href={`/stock/items/${item.sku.toLowerCase()}/edit`}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Item">
                        <Edit3 size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                    <Package size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No items found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
