"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Truck, Edit3, Building2, Calendar, Warehouse, ShoppingCart, CheckCircle2, Clock, FileText } from "lucide-react";

export default function PODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const poId = resolvedParams.id.toUpperCase();

  const poDetails = {
    id: poId,
    supplier: "Caltex Lubricants Lanka (Pvt) Ltd",
    supplierContact: "Mr. Suresh Bandara (+94 11 234 5678)",
    orderDate: "Oct 24, 2023",
    expectedDate: "Oct 28, 2023",
    location: "Main Workshop Bay (Section A)",
    paymentTerms: "Net 30 Days after goods receipt and GRN confirmation.",
    status: "Partially Received",
    notes: "Please deliver during morning hours between 8:30 AM and 11:30 AM.",
    items: [
      {
        sku: "OIL-MOB-5W30",
        description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)",
        orderedQty: 100,
        receivedQty: 98,
        unitCost: 6500,
      },
      {
        sku: "FLD-DOT4-500",
        description: "Bosch DOT4 Brake Fluid 500ml",
        orderedQty: 20,
        receivedQty: 20,
        unitCost: 1800,
      },
    ],
    grnHistory: [
      { id: "GRN-2023-001", date: "Oct 27, 2023", itemsReceived: "98× Mobil 1 Engine Oil, 20× Brake Fluid", status: "Confirmed" }
    ]
  };

  const totalOrderedQty = poDetails.items.reduce((sum, item) => sum + item.orderedQty, 0);
  const totalReceivedQty = poDetails.items.reduce((sum, item) => sum + item.receivedQty, 0);
  const percentReceived = Math.round((totalReceivedQty / totalOrderedQty) * 100);

  const subtotal = poDetails.items.reduce((sum, item) => sum + (item.orderedQty * item.unitCost), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/stock/po" className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{poDetails.id}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                poDetails.status === "Received"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : poDetails.status === "Partially Received"
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }`}>
                {poDetails.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{poDetails.supplier}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {poDetails.status !== "Received" && (
            <Link
              href={`/stock/grn/create?poId=${poDetails.id}`}
              className="px-4 py-2.5 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              <Truck size={18} />
              Create GRN
            </Link>
          )}

          <Link
            href={`/stock/po/${resolvedParams.id}/print`}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Printer size={18} />
            Print / PDF
          </Link>

          <Link
            href={`/stock/po/${resolvedParams.id}/edit`}
            className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            title="Edit Purchase Order"
          >
            <Edit3 size={18} />
          </Link>
        </div>
      </div>

      {/* Fulfillment Progress Callout Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-[#00184d] text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/80 pb-3">
          <div>
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Goods Fulfillment Progress</span>
            <h2 className="text-xl font-bold mt-0.5">{totalReceivedQty} of {totalOrderedQty} Units Received</h2>
          </div>
          <span className="text-2xl font-extrabold text-blue-300 font-mono">{percentReceived}% Complete</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-blue-950/80 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${percentReceived}%` }} />
        </div>

        <p className="text-xs text-blue-200">
          Stock arrives via Goods Received Notes (GRN). Outstanding items remaining to receive: <strong className="text-white">{totalOrderedQty - totalReceivedQty} Units</strong>.
        </p>
      </div>

      {/* Supplier & Delivery Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 size={16} className="text-[#00184d]" />
            Supplier Info
          </h2>
          <div>
            <span className="text-xs text-slate-400 block">Supplier Name</span>
            <span className="font-semibold text-slate-800 text-sm">{poDetails.supplier}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Contact Person</span>
            <span className="text-xs font-medium text-slate-700">{poDetails.supplierContact}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Calendar size={16} className="text-[#00184d]" />
            Schedule & Location
          </h2>
          <div>
            <span className="text-xs text-slate-400 block">Order Date</span>
            <span className="font-medium text-slate-700 text-xs">{poDetails.orderDate}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Expected Delivery</span>
            <span className="font-bold text-slate-900 text-xs">{poDetails.expectedDate}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Receiving Location</span>
            <span className="font-mono text-xs text-blue-800 font-semibold">{poDetails.location}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText size={16} className="text-[#00184d]" />
            Terms & Payment
          </h2>
          <div>
            <span className="text-xs text-slate-400 block">Payment Terms</span>
            <span className="text-xs font-medium text-slate-700">{poDetails.paymentTerms}</span>
          </div>
        </div>
      </div>

      {/* Item Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>Order Line Items</span>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {poDetails.items.length} Line Items
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Item Description</th>
                <th className="px-4 py-3 font-semibold text-center">Ordered</th>
                <th className="px-4 py-3 font-semibold text-center">Received</th>
                <th className="px-4 py-3 font-semibold text-center">Remaining</th>
                <th className="px-4 py-3 font-semibold text-right">Unit Cost</th>
                <th className="px-4 py-3 font-semibold text-right">Total (Rs.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {poDetails.items.map((item, idx) => {
                const remaining = item.orderedQty - item.receivedQty;
                const lineTotal = item.orderedQty * item.unitCost;

                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-xs text-[#00184d]">{item.sku}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.description}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">{item.orderedQty}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-700">{item.receivedQty}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-600">
                      {remaining > 0 ? `${remaining} units` : "0"}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">Rs. {item.unitCost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      Rs. {lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/60 p-4 rounded-xl">
          <span className="text-sm font-semibold text-slate-700">Total Purchase Order Value</span>
          <span className="text-2xl font-bold text-[#00184d]">
            Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Linked GRN Receiving History Log */}
      {poDetails.grnHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck size={18} className="text-[#00184d]" />
            Linked Goods Received Notes (GRN Audit History)
          </h2>

          <div className="divide-y divide-slate-100">
            {poDetails.grnHistory.map((grn) => (
              <div key={grn.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/stock/grn/${grn.id.toLowerCase()}`} className="font-mono font-bold text-[#00184d] hover:underline text-sm">
                    {grn.id}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{grn.itemsReceived}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {grn.status}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">{grn.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
