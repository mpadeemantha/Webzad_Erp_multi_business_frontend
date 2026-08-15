"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, Printer, Building2, Calendar, FileText, Package, Truck, ShieldAlert } from "lucide-react";

export default function GRNDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const grnId = resolvedParams.id.toUpperCase();

  const [status, setStatus] = useState<"Confirmed" | "Draft">("Confirmed");

  const grnDetails = {
    id: grnId,
    supplier: "Caltex Lubricants Lanka (Pvt) Ltd",
    deliveryNote: "DN-88491",
    poNumber: "PO-2023-088",
    receivedDate: "Oct 27, 2023 - 02:15 PM",
    warehouseLocation: "Main Warehouse - Section A (Rack 04)",
    receiverName: "Saman Perera (Inventory Supervisor)",
    notes: "Batch #CX-9021. Shipment arrived in good outer packaging. Upon opening Box 3, 2 cans had broken caps resulting in oil leakage.",
    items: [
      {
        sku: "OIL-MOB-5W30",
        name: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)",
        ordered: 100,
        received: 100,
        damaged: 2,
        rejectionReason: "Broken seal & cap leakage during transport",
        accepted: 98,
        unitCost: 6500,
      },
      {
        sku: "FLD-DOT4-500",
        name: "Bosch DOT4 Brake Fluid 500ml",
        ordered: 20,
        received: 20,
        damaged: 0,
        rejectionReason: "None",
        accepted: 20,
        unitCost: 1800,
      },
    ],
  };

  const totalAcceptedValue = grnDetails.items.reduce((sum, item) => sum + (item.accepted * item.unitCost), 0);
  const totalDamagedCount = grnDetails.items.reduce((sum, item) => sum + item.damaged, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/stock/grn" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{grnDetails.id}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                status === "Confirmed" ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200"
              }`}>
                {status}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{grnDetails.supplier} • DN #{grnDetails.deliveryNote}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Printer size={18} />
            Print GRN Slip
          </button>
        </div>
      </div>

      {/* Stock Confirmed Audit Callout */}
      {status === "Confirmed" && (
        <div className="bg-gradient-to-r from-blue-900 to-[#00184d] text-white p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl text-green-300 shrink-0">
            <CheckCircle2 size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold">Stock Levels Successfully Posted</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              118 Accepted units have been automatically posted to inventory in {grnDetails.warehouseLocation} on {grnDetails.receivedDate}.
            </p>
          </div>
        </div>
      )}

      {/* Discrepancy Callout Banner */}
      {totalDamagedCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950">Discrepancy & Damaged Stock Flagged</h3>
            <p className="text-xs text-amber-800 mt-0.5">
              {totalDamagedCount} damaged/rejected items were isolated during inspection. These units were excluded from stock posting and recorded for supplier debit claim.
            </p>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supplier Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 size={16} className="text-[#00184d]" />
            Supplier Details
          </h2>
          <div>
            <span className="text-xs text-slate-400 block">Supplier Name</span>
            <span className="font-semibold text-slate-800 text-sm">{grnDetails.supplier}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Delivery Note / Invoice Ref</span>
            <span className="font-mono font-bold text-[#00184d] text-sm">{grnDetails.deliveryNote}</span>
          </div>
        </div>

        {/* PO & Warehouse Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Truck size={16} className="text-[#00184d]" />
            Order & Location
          </h2>
          <div>
            <span className="text-xs text-slate-400 block">Linked Purchase Order</span>
            <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-xs">
              {grnDetails.poNumber}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Warehouse Receiving Station</span>
            <span className="font-medium text-slate-700 text-xs">{grnDetails.warehouseLocation}</span>
          </div>
        </div>

        {/* Audit Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar size={16} className="text-[#00184d]" />
            Receiving Verification
          </h2>
          <div>
            <span className="text-xs text-slate-400 block">Received Date & Time</span>
            <span className="font-medium text-slate-700 text-xs">{grnDetails.receivedDate}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Inspected & Confirmed By</span>
            <span className="font-semibold text-slate-800 text-xs">{grnDetails.receiverName}</span>
          </div>
        </div>
      </div>

      {/* Inspected Stock Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
          <span>Received Goods Breakdown</span>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {grnDetails.items.length} SKUs Inspected
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Item Description</th>
                <th className="px-4 py-3 font-semibold text-center">Ordered</th>
                <th className="px-4 py-3 font-semibold text-center">Received</th>
                <th className="px-4 py-3 font-semibold text-center">Damaged</th>
                <th className="px-4 py-3 font-semibold text-center">Accepted</th>
                <th className="px-4 py-3 font-semibold">Rejection Note</th>
                <th className="px-4 py-3 font-semibold text-right">Unit Price</th>
                <th className="px-4 py-3 font-semibold text-right">Accepted Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grnDetails.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-[#00184d]">{item.sku}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-center text-slate-500 font-semibold">{item.ordered}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-800">{item.received}</td>
                  <td className="px-4 py-3 text-center">
                    {item.damaged > 0 ? (
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-xs">
                        {item.damaged}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-green-700">{item.accepted}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 italic">{item.rejectionReason}</td>
                  <td className="px-4 py-3 text-right text-slate-700">Rs. {item.unitCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    Rs. {(item.accepted * item.unitCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/60 p-4 rounded-xl">
          <span className="text-sm font-semibold text-slate-700">Total Confirmed Accepted Value</span>
          <span className="text-2xl font-bold text-[#00184d]">
            Rs. {totalAcceptedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Receiving Remarks */}
      {grnDetails.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supervisor Remarks & Inspection Observations</h3>
          <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
            "{grnDetails.notes}"
          </p>
        </div>
      )}
    </div>
  );
}
