"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRightLeft, Save, CheckCircle2, Clock, Plus, Trash2, Package } from "lucide-react";

const WAREHOUSES = ["Main Workshop Bay", "Parts Storeroom A", "Tyre Bay"];

const CATALOG_ITEMS = [
  { sku: "OIL-MOB-5W30", name: "Mobil 1 Engine Oil 5W-30 (4L Can)", maxQty: 48, warehouse: "Parts Storeroom A" },
  { sku: "FLT-AIR-HND",  name: "Honda Civic Engine Air Filter",    maxQty: 24, warehouse: "Parts Storeroom A" },
  { sku: "SPK-NGK-IRID", name: "NGK Iridium Spark Plug Set (4 Pcs)", maxQty: 35, warehouse: "Main Workshop Bay" },
  { sku: "TYR-BCH-205",  name: "Bridgestone Ecopia 205/55R16 Tyre", maxQty: 8,  warehouse: "Parts Storeroom A" },
  { sku: "ELE-BAT-65AH", name: "Amaron Pro 65Ah Car Battery",     maxQty: 6,  warehouse: "Main Workshop Bay" },
  { sku: "BRK-PAD-TOY",  name: "Toyota Prius Front Brake Pad Set",  maxQty: 10, warehouse: "Parts Storeroom A" },
];

const transferLog = [
  {
    ref: "TRF-2023-006",
    date: "Oct 24, 2023",
    items: [
      { sku: "FLT-AIR-HND", name: "Honda Civic Air Filter", qty: 8 },
      { sku: "OIL-MOB-5W30", name: "Mobil 1 Engine Oil 5W-30", qty: 5 },
    ],
    totalUnits: 13,
    from: "Parts Storeroom A",
    to: "Main Workshop Bay",
    status: "Completed",
    initiatedBy: "Nimal Fernando"
  },
  {
    ref: "TRF-2023-005",
    date: "Oct 18, 2023",
    items: [
      { sku: "TYR-BCH-205", name: "Bridgestone Ecopia Tyres", qty: 4 }
    ],
    totalUnits: 4,
    from: "Parts Storeroom A",
    to: "Tyre Bay",
    status: "Completed",
    initiatedBy: "Ashan Wijesuriya"
  },
  {
    ref: "TRF-2023-004",
    date: "Oct 12, 2023",
    items: [
      { sku: "SPK-NGK-IRID", name: "NGK Iridium Spark Plug Sets", qty: 10 },
      { sku: "ELE-BAT-65AH", name: "Amaron Car Battery 65Ah", qty: 2 }
    ],
    totalUnits: 12,
    from: "Main Workshop Bay",
    to: "Parts Storeroom A",
    status: "Completed",
    initiatedBy: "Saman Perera"
  },
];

export default function StockTransfersPage() {
  const router = useRouter();

  const [fromWarehouse, setFromWarehouse] = useState("Parts Storeroom A");
  const [toWarehouse, setToWarehouse] = useState("Main Workshop Bay");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const [transferItems, setTransferItems] = useState([
    { id: 1, sku: "OIL-MOB-5W30", qty: 5 },
    { id: 2, sku: "FLT-AIR-HND", qty: 2 },
  ]);

  const addItemRow = () => {
    setTransferItems([
      ...transferItems,
      { id: Date.now(), sku: "", qty: 1 }
    ]);
  };

  const removeItemRow = (id: number) => {
    if (transferItems.length > 1) {
      setTransferItems(transferItems.filter(item => item.id !== id));
    }
  };

  const updateItemRow = (id: number, field: "sku" | "qty", value: any) => {
    setTransferItems(transferItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalTransferUnits = transferItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const handleConfirmTransfer = () => {
    router.push("/stock/transfers");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/stock/warehouses" className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Transfers</h1>
            <p className="text-slate-500 text-sm mt-1">Move multiple stock items between warehouse locations with a single transfer manifest.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Multi-Item Transfer Form */}
        <div className="xl:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ArrowRightLeft size={18} className="text-[#00184d]" /> New Multi-Item Stock Transfer
            </h2>

            {/* From / To Warehouses & Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Source Warehouse <span className="text-red-500">*</span>
                </label>
                <select value={fromWarehouse} onChange={e => setFromWarehouse(e.target.value)} className={sel}>
                  {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Destination Warehouse <span className="text-red-500">*</span>
                </label>
                <select value={toWarehouse} onChange={e => setToWarehouse(e.target.value)} className={sel}>
                  {WAREHOUSES.filter(w => w !== fromWarehouse).map(w => <option key={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Transfer Date
                </label>
                <input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)} className={inp} />
              </div>
            </div>

            {/* Multi Item Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Items to Transfer ({transferItems.length} SKUs)
                </label>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#00184d] hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Add Another Item
                </button>
              </div>

              <div className="space-y-2.5">
                {transferItems.map((row, idx) => {
                  const selectedCatItem = CATALOG_ITEMS.find(c => c.sku === row.sku);

                  return (
                    <div key={row.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                      <span className="text-xs font-bold text-slate-400 w-5 text-center">#{idx + 1}</span>

                      {/* Item Dropdown */}
                      <div className="flex-1 min-w-0">
                        <select
                          value={row.sku}
                          onChange={(e) => updateItemRow(row.id, "sku", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                        >
                          <option value="">— Select Stock Item —</option>
                          {CATALOG_ITEMS.map((item) => (
                            <option key={item.sku} value={item.sku}>
                              {item.name} ({item.sku}) — Max: {item.maxQty} units
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity Input */}
                      <div className="w-24 shrink-0">
                        <input
                          type="number"
                          min="1"
                          max={selectedCatItem?.maxQty}
                          value={row.qty}
                          onChange={(e) => updateItemRow(row.id, "qty", Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItemRow(row.id)}
                        disabled={transferItems.length === 1}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note & Remarks */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Transfer Remarks / Reason
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Restocking Main Bay for scheduled morning vehicle services..."
                className={`${inp} resize-none`}
              />
            </div>

            {/* Summary & Submit */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Total Units Being Transferred: <strong className="text-slate-900 text-sm">{totalTransferUnits} Units</strong>
              </div>
              <button
                onClick={handleConfirmTransfer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                <Save size={16} /> Confirm & Dispatch Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Transfer History Log */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-slate-900">Transfer Audit History</h2>
            <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
              {transferLog.length} Transfers
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {transferLog.map((t) => (
              <div key={t.ref} className="p-4 hover:bg-slate-50/60 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#00184d] text-xs">{t.ref}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                      <CheckCircle2 size={10} className="inline mr-0.5" />
                      {t.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{t.date}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{t.from}</span>
                  <ArrowRightLeft size={12} className="text-slate-400" />
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{t.to}</span>
                </div>

                {/* Items List inside Transfer Card */}
                <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  {t.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-700">
                      <span className="truncate pr-2">• {it.name}</span>
                      <span className="font-bold text-slate-900 shrink-0">×{it.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>By {t.initiatedBy}</span>
                  <span className="font-bold text-slate-600">{t.totalUnits} Total Units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const sel = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] font-medium text-slate-800";
const inp = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] font-medium text-slate-800";
