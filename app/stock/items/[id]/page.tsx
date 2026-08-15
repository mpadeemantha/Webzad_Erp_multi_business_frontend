"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Edit3, Package, ArrowUpRight, ArrowDownRight, ArrowRightLeft,
  Building2, Layers, Tag, Barcode, Warehouse, AlertTriangle, TrendingUp
} from "lucide-react";

const itemData: Record<string, any> = {
  "oil-mob-5w30": {
    sku: "OIL-MOB-5W30",
    barcode: "4902867001153",
    name: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)",
    category: "Oils & Lubricants",
    unit: "Can (4 Litre)",
    supplier: "Caltex Lubricants Lanka",
    warehouse: "Parts Storeroom A — Rack A-04",
    stock: 48,
    min: 15,
    costPrice: 6500,
    sellPrice: 8500,
    status: "In Stock",
    movements: [
      { date: "Oct 27, 2023", type: "IN",  source: "GRN-2023-001",  ref: "/stock/grn/grn-2023-001",  qty: +98, balance: 48, note: "PO-2023-088 confirmed receipt (2 damaged)" },
      { date: "Oct 20, 2023", type: "OUT", source: "JOB-0041",      ref: "/jobs/job-0041",            qty: -3,  balance: 28, note: "Oil change service — Toyota Prius CAB-4921" },
      { date: "Oct 18, 2023", type: "OUT", source: "INV-0031",      ref: "/invoicing/inv-0031",       qty: -4,  balance: 31, note: "Invoice line item — customer purchase" },
      { date: "Oct 10, 2023", type: "IN",  source: "GRN-2023-008",  ref: "/stock/grn/grn-2023-008",  qty: +50, balance: 35, note: "Direct stock entry" },
      { date: "Oct 04, 2023", type: "ADJ", source: "ADJ-001",       ref: "#",                         qty: -2,  balance: 29, note: "Manual adjustment — damaged during storage" },
      { date: "Sep 28, 2023", type: "OUT", source: "JOB-0035",      ref: "/jobs/job-0035",            qty: -5,  balance: 31, note: "Engine service — Honda Civic WP-1234" },
    ],
  },
};

const fallbackItem = {
  sku: "BRK-PAD-TOY",
  barcode: "4905524171051",
  name: "Genuine Toyota Prius Front Brake Pad Set",
  category: "Brake Parts",
  unit: "Set",
  supplier: "Toyota Lanka Spare Parts",
  warehouse: "Parts Storeroom A — Shelf B-12",
  stock: 8,
  min: 10,
  costPrice: 8500,
  sellPrice: 12000,
  status: "Low Stock",
  movements: [
    { date: "Oct 26, 2023", type: "OUT", source: "JOB-0040", ref: "/jobs/job-0040", qty: -2, balance: 8, note: "Brake replacement — Toyota Prius NAA-7812" },
    { date: "Oct 15, 2023", type: "IN",  source: "GRN-2023-002", ref: "/stock/grn/grn-2023-002", qty: +30, balance: 10, note: "PO-2023-084 full receipt" },
  ],
};

function typeStyle(type: string) {
  switch (type) {
    case "IN":  return { badge: "bg-green-100 text-green-700", icon: ArrowUpRight, color: "text-green-600" };
    case "OUT": return { badge: "bg-red-100 text-red-700", icon: ArrowDownRight, color: "text-red-500" };
    case "TRANSFER": return { badge: "bg-blue-100 text-blue-700", icon: ArrowRightLeft, color: "text-blue-600" };
    case "ADJ": return { badge: "bg-slate-100 text-slate-600", icon: ArrowRightLeft, color: "text-slate-500" };
    default: return { badge: "bg-slate-100 text-slate-600", icon: ArrowRightLeft, color: "text-slate-500" };
  }
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = itemData[id] ?? fallbackItem;

  const stockValue = item.stock * item.costPrice;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/stock/items" className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors mt-0.5">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{item.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                item.status === "In Stock"     ? "bg-green-100 text-green-700 border-green-200" :
                item.status === "Low Stock"    ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                 "bg-red-100 text-red-700 border-red-200"
              }`}>{item.status}</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">
              <span className="font-mono font-bold text-[#00184d]">{item.sku}</span> • {item.category}
            </p>
          </div>
        </div>
        <Link href={`/stock/items/${id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors shrink-0">
          <Edit3 size={16} /> Edit Item
        </Link>
      </div>

      {/* Low stock warning */}
      {item.status === "Low Stock" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Low Stock Warning</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Current stock ({item.stock} units) is below the minimum reorder point ({item.min} units). 
              <Link href="/stock/grn/create" className="ml-1 font-bold underline">Create a GRN to restock →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Item Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Package size={14} className="text-[#00184d]" /> Item Details
          </h3>
          <Row label="SKU Code"    value={<span className="font-mono text-[#00184d] font-bold">{item.sku}</span>} />
          <Row label="Barcode"     value={<span className="font-mono text-sm">{item.barcode}</span>} />
          <Row label="Category"    value={item.category} />
          <Row label="Unit"        value={item.unit} />
          <Row label="Supplier"    value={item.supplier} />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Layers size={14} className="text-[#00184d]" /> Stock Levels
          </h3>
          <Row label="Current Stock" value={<span className={`font-bold ${item.stock < item.min ? "text-amber-600" : "text-slate-900"}`}>{item.stock} {item.unit}</span>} />
          <Row label="Reorder Point" value={`${item.min} ${item.unit}`} />
          <Row label="Warehouse"     value={item.warehouse} />
          <Row label="Stock Value"   value={<span className="font-bold text-[#00184d]">Rs. {stockValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>} />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Tag size={14} className="text-[#00184d]" /> Pricing
          </h3>
          <Row label="Cost Price"   value={<span className="font-semibold text-slate-700">Rs. {item.costPrice.toLocaleString()}</span>} />
          <Row label="Selling Price" value={<span className="font-bold text-slate-900">Rs. {item.sellPrice.toLocaleString()}</span>} />
          <Row label="Gross Margin"  value={
            <span className="font-bold text-green-600">
              Rs. {(item.sellPrice - item.costPrice).toLocaleString()} ({Math.round(((item.sellPrice - item.costPrice) / item.sellPrice) * 100)}%)
            </span>
          } />
        </div>
      </div>

      {/* Stock Movement History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#00184d]" /> Stock Movement History
          </h2>
          <span className="text-xs text-slate-400">{item.movements.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Reference</th>
                <th className="px-5 py-3.5 font-semibold text-center">Qty Change</th>
                <th className="px-5 py-3.5 font-semibold text-center">Balance After</th>
                <th className="px-5 py-3.5 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {item.movements.map((m: any, i: number) => {
                const style = typeStyle(m.type);
                const Icon  = style.icon;
                return (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-slate-500 text-xs">{m.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${style.badge}`}>
                        <Icon size={11} />
                        {m.type === "IN" ? "Stock In" : m.type === "OUT" ? "Stock Out" : m.type === "ADJ" ? "Adjustment" : "Transfer"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={m.ref} className="font-mono font-bold text-[#00184d] hover:underline text-xs">{m.source}</Link>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`font-bold ${m.qty > 0 ? "text-green-600" : "text-red-500"}`}>
                        {m.qty > 0 ? "+" : ""}{m.qty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{m.balance}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 max-w-xs truncate">{m.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-xs font-semibold text-slate-800 text-right">{value}</span>
    </div>
  );
}
