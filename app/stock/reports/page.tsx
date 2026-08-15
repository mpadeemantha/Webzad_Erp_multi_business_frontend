"use client";

import { useState } from "react";
import { Download, FileText, TrendingUp, TrendingDown, AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

const TABS = ["Stock Valuation", "Stock Movement", "Fast / Slow Moving", "Damaged Stock"];

// --- Data ---
const valuationData = [
  { category: "Oils & Lubricants", skus: 24, totalQty: 126, costValue: 1100000, sellValue: 1560000 },
  { category: "Brake Parts",       skus: 18, totalQty: 30,  costValue: 670000,  sellValue: 950000  },
  { category: "Filters",           skus: 22, totalQty: 51,  costValue: 192000,  sellValue: 290000  },
  { category: "Tyres",             skus: 12, totalQty: 22,  costValue: 688000,  sellValue: 980000  },
  { category: "Engine Parts",      skus: 30, totalQty: 70,  costValue: 1200000, sellValue: 1750000 },
  { category: "Electrical",        skus: 14, totalQty: 20,  costValue: 580000,  sellPrice: 840000  },
  { category: "Body Parts",        skus: 22, totalQty: 35,  costValue: 420000,  sellValue: 610000  },
];

const movementData = [
  { date: "Oct 27", item: "Mobil 1 Engine Oil 5W-30", sku: "OIL-MOB-5W30", type: "IN",  qty: 98,  ref: "GRN-2023-001", note: "PO receipt (2 damaged)" },
  { date: "Oct 26", item: "Honda Civic Air Filter",   sku: "FLT-AIR-HND",  type: "OUT", qty: -3,  ref: "JOB-0042",     note: "Service job — CAB-1234" },
  { date: "Oct 25", item: "Bosch DOT4 Brake Fluid",   sku: "FLD-DOT4-500", type: "OUT", qty: -4,  ref: "INV-0033",     note: "Invoice line item" },
  { date: "Oct 24", item: "Honda Civic Air Filter",   sku: "FLT-AIR-HND",  type: "IN",  qty: 8,   ref: "TRF-2023-006", note: "Transfer from Storeroom A" },
  { date: "Oct 22", item: "NGK Iridium Spark Plugs",  sku: "SPK-NGK-IRID", type: "ADJ", qty: -2,  ref: "ADJ-003",      note: "Manual adj — shelf damage" },
  { date: "Oct 20", item: "Toyota Brake Pads",        sku: "BRK-PAD-TOY",  type: "OUT", qty: -2,  ref: "JOB-0041",     note: "Brake replacement" },
];

const fastMoving = [
  { sku: "OIL-MOB-5W30", name: "Mobil 1 Engine Oil 5W-30",       used: 148, trend: "up",   category: "Oils & Lubricants" },
  { sku: "FLT-AIR-HND",  name: "Honda Civic Air Filter Element",  used: 87,  trend: "up",   category: "Filters" },
  { sku: "BRK-PAD-TOY",  name: "Toyota Prius Front Brake Pad Set", used: 62, trend: "up",   category: "Brake Parts" },
  { sku: "SPK-NGK-IRID", name: "NGK Iridium Spark Plugs (×4)",   used: 54,  trend: "up",   category: "Engine Parts" },
  { sku: "FLD-DOT4-500", name: "Bosch DOT4 Brake Fluid 500ml",   used: 38,  trend: "down", category: "Oils & Lubricants" },
  { sku: "ELE-BAT-65AH", name: "Amaron Pro 65Ah Car Battery",    used: 14,  trend: "down", category: "Electrical" },
  { sku: "TYR-BCH-205",  name: "Bridgestone Ecopia 205/55R16",   used: 8,   trend: "down", category: "Tyres" },
];

const damagedData = [
  { grnRef: "GRN-2023-001", date: "Oct 27, 2023", supplier: "Caltex Lanka",      item: "Mobil 1 Engine Oil 5W-30", sku: "OIL-MOB-5W30", dmgQty: 2,  costValue: 13000, reason: "Leaking container cap" },
  { grnRef: "GRN-2023-004", date: "Oct 22, 2023", supplier: "Bridgestone Lanka", item: "Bridgestone Ecopia Tyre",   sku: "TYR-BCH-205",  dmgQty: 1,  costValue: 28000, reason: "Sidewall crack during transit" },
  { grnRef: "ADJ-003",      date: "Oct 22, 2023", supplier: "—",                 item: "NGK Iridium Spark Plugs",   sku: "SPK-NGK-IRID", dmgQty: 2,  costValue: 25000, reason: "Shelf damage — manual adjustment" },
];

export default function StockReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateFrom, setDateFrom] = useState("2023-10-01");
  const [dateTo,   setDateTo]   = useState("2023-10-31");

  const totalCostValue = valuationData.reduce((s, r) => s + r.costValue, 0);
  const totalSellValue = valuationData.reduce((s, r) => s + (r.sellValue || 0), 0);
  const totalDamagedCost = damagedData.reduce((s, r) => s + r.costValue, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Valuation, movement history, top-moving items, and damaged stock analysis.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 shadow-sm text-sm transition-colors">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-100">
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === i
                  ? "border-[#00184d] text-[#00184d] bg-blue-50/40"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ──────────────── TAB 0: Stock Valuation ──────────────── */}
        {activeTab === 0 && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Cost Value"    value={`Rs. ${totalCostValue.toLocaleString()}`}  sub="Current stock at cost" color="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Total Selling Value"  value={`Rs. ${totalSellValue.toLocaleString()}`}  sub="If all stock sold today" color="text-green-600" bg="bg-green-50" />
              <StatCard label="Gross Margin (If Sold)" value={`Rs. ${(totalSellValue - totalCostValue).toLocaleString()}`} sub="Potential gross profit" color="text-violet-600" bg="bg-violet-50" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5 text-center">SKUs</th>
                    <th className="px-5 py-3.5 text-center">Total Qty</th>
                    <th className="px-5 py-3.5 text-right">Cost Value</th>
                    <th className="px-5 py-3.5 text-right">Sell Value</th>
                    <th className="px-5 py-3.5 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {valuationData.map((r, i) => {
                    const sv = r.sellValue || 0;
                    const margin = sv - r.costValue;
                    return (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="px-5 py-4 font-semibold text-slate-800">{r.category}</td>
                        <td className="px-5 py-4 text-center text-slate-600">{r.skus}</td>
                        <td className="px-5 py-4 text-center text-slate-600">{r.totalQty}</td>
                        <td className="px-5 py-4 text-right text-slate-700">Rs. {r.costValue.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-bold text-slate-900">Rs. {sv.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-bold text-green-600">Rs. {margin.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                  <tr>
                    <td className="px-5 py-4 text-slate-900">Total</td>
                    <td className="px-5 py-4 text-center">{valuationData.reduce((s,r)=>s+r.skus,0)}</td>
                    <td className="px-5 py-4 text-center">{valuationData.reduce((s,r)=>s+r.totalQty,0)}</td>
                    <td className="px-5 py-4 text-right text-slate-900">Rs. {totalCostValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-slate-900">Rs. {totalSellValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-green-700">Rs. {(totalSellValue-totalCostValue).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ──────────────── TAB 1: Stock Movement ──────────────── */}
        {activeTab === 1 && (
          <div className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-sm">
                <label className="font-medium text-slate-600">From:</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label className="font-medium text-slate-600">To:</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20" />
              </div>
              <button className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-50">
                <Download size={15} /> Export Excel
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Item</th>
                    <th className="px-5 py-3.5">SKU</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5 text-center">Qty</th>
                    <th className="px-5 py-3.5">Reference</th>
                    <th className="px-5 py-3.5">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {movementData.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4 text-slate-500 text-xs">{m.date}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{m.item}</td>
                      <td className="px-5 py-4 font-mono text-[#00184d] text-xs font-bold">{m.sku}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          m.type === "IN"  ? "bg-green-100 text-green-700" :
                          m.type === "OUT" ? "bg-red-100 text-red-500" :
                                             "bg-slate-100 text-slate-600"
                        }`}>
                          {m.type === "IN" ? <ArrowUpRight size={10} /> : m.type === "OUT" ? <ArrowDownRight size={10} /> : null}
                          {m.type}
                        </span>
                      </td>
                      <td className={`px-5 py-4 text-center font-bold ${m.qty > 0 ? "text-green-600" : "text-red-500"}`}>
                        {m.qty > 0 ? "+" : ""}{m.qty}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-[#00184d]">{m.ref}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ──────────────── TAB 2: Fast / Slow Moving ──────────────── */}
        {activeTab === 2 && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-500">Ranked by total units consumed (Jobs + Invoices) — last 30 days.</p>
            <div className="space-y-3">
              {fastMoving.map((item, i) => {
                const maxUsed = fastMoving[0].used;
                const pct = Math.round((item.used / maxUsed) * 100);
                const isFast = i < 4;
                return (
                  <div key={item.sku} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <span className={`text-xs font-bold w-5 text-center ${isFast ? "text-green-600" : "text-slate-400"}`}>#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">{item.sku} • {item.category}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-bold text-slate-900 text-sm">{item.used} units</p>
                          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${isFast ? "text-green-600" : "text-slate-400"}`}>
                            {isFast ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {isFast ? "Fast Moving" : "Slow Moving"}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isFast ? "bg-green-500" : "bg-slate-300"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ──────────────── TAB 3: Damaged Stock ──────────────── */}
        {activeTab === 3 && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard label="Total Damaged Items" value={`${damagedData.reduce((s,r)=>s+r.dmgQty,0)} units`} sub="Across all GRNs & adjustments" color="text-red-600" bg="bg-red-50" />
              <StatCard label="Total Damaged Value"  value={`Rs. ${totalDamagedCost.toLocaleString()}`} sub="Cost price of rejected stock" color="text-amber-600" bg="bg-amber-50" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">GRN / Reference</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Supplier</th>
                    <th className="px-5 py-3.5">Item</th>
                    <th className="px-5 py-3.5 text-center">Damaged Qty</th>
                    <th className="px-5 py-3.5 text-right">Cost Loss</th>
                    <th className="px-5 py-3.5">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {damagedData.map((r, i) => (
                    <tr key={i} className="hover:bg-red-50/20 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-xs text-[#00184d]">{r.grnRef}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{r.date}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{r.supplier}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{r.item}</p>
                        <p className="text-[11px] font-mono text-slate-400">{r.sku}</p>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-red-600">{r.dmgQty} units</td>
                      <td className="px-5 py-4 text-right font-bold text-red-600">Rs. {r.costValue.toLocaleString()}</td>
                      <td className="px-5 py-4 text-xs text-slate-500 italic">{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-slate-100`}>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}
