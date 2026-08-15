"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertTriangle, Truck, Building2, Calendar, FileText, Package, Check } from "lucide-react";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CreateGRNContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poIdParam = searchParams.get("poId") || "PO-2023-088";

  // Mode: PO vs Direct Entry
  const [entryMode, setEntryMode] = useState<"PO" | "DIRECT">("PO");
  const [selectedPO, setSelectedPO] = useState(poIdParam);

  const purchaseOrders = [
    { id: "PO-2023-088", supplier: "Caltex Lubricants Lanka", itemsCount: 3, expectedDate: "Oct 27, 2023" },
    { id: "PO-2023-084", supplier: "Toyota Lanka Spare Parts", itemsCount: 2, expectedDate: "Oct 26, 2023" },
    { id: "PO-2023-079", supplier: "Bridgestone Lanka Tyres", itemsCount: 1, expectedDate: "Oct 25, 2023" },
  ];

  const [supplierName, setSupplierName] = useState("Caltex Lubricants Lanka");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [receivingLocation, setReceivingLocation] = useState("Main Warehouse - Section A");
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      sku: "OIL-MOB-5W30",
      description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)",
      orderedQty: 100,
      receivedQty: 100,
      damagedQty: 2,
      rejectionReason: "Container leaking / damaged cap",
      unitPrice: 6500,
    },
    {
      id: 2,
      sku: "FLD-DOT4-500",
      description: "Bosch DOT4 Brake Fluid 500ml",
      orderedQty: 20,
      receivedQty: 20,
      damagedQty: 0,
      rejectionReason: "",
      unitPrice: 1800,
    },
  ]);

  const handlePOChange = (poId: string) => {
    setSelectedPO(poId);
    if (poId === "PO-2023-088") {
      setSupplierName("Caltex Lubricants Lanka");
      setItems([
        { id: 1, sku: "OIL-MOB-5W30", description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)", orderedQty: 100, receivedQty: 100, damagedQty: 2, rejectionReason: "Leaking container cap", unitPrice: 6500 },
        { id: 2, sku: "FLD-DOT4-500", description: "Bosch DOT4 Brake Fluid 500ml", orderedQty: 20, receivedQty: 20, damagedQty: 0, rejectionReason: "", unitPrice: 1800 },
      ]);
    } else if (poId === "PO-2023-084") {
      setSupplierName("Toyota Lanka Spare Parts");
      setItems([
        { id: 1, sku: "BRK-PAD-TOY", description: "Toyota Prius Front Brake Pad Set", orderedQty: 30, receivedQty: 30, damagedQty: 0, rejectionReason: "", unitPrice: 8500 },
        { id: 2, sku: "FLT-AIR-HND", description: "Toyota Engine Air Filter Element", orderedQty: 20, receivedQty: 20, damagedQty: 0, rejectionReason: "", unitPrice: 2500 },
      ]);
    }
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { id: Date.now(), sku: "", description: "", orderedQty: 0, receivedQty: 1, damagedQty: 0, rejectionReason: "", unitPrice: 0 }
    ]);
  };

  const removeItemRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculations
  const calculateAcceptedQty = (received: number, damaged: number) => Math.max(0, received - damaged);

  const calculateDiscrepancy = (ordered: number, received: number, damaged: number) => {
    const accepted = calculateAcceptedQty(received, damaged);
    if (entryMode === "DIRECT") {
      if (damaged > 0) return { text: `${damaged} Damaged`, color: "bg-red-100 text-red-700 border-red-200" };
      return { text: "Direct Receipt", color: "bg-blue-100 text-blue-700 border-blue-200" };
    }
    const diff = accepted - ordered;
    if (diff === 0 && damaged === 0) return { text: "Exact Match", color: "bg-green-100 text-green-700 border-green-200" };
    if (damaged > 0) return { text: `${damaged} Damaged`, color: "bg-red-100 text-red-700 border-red-200" };
    if (diff < 0) return { text: `${Math.abs(diff)} Shortage`, color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { text: `+${diff} Excess`, color: "bg-[#00184d]/10 text-[#00184d] border-blue-200" };
  };

  const totalAcceptedValue = items.reduce((sum, item) => {
    const accepted = calculateAcceptedQty(item.receivedQty, item.damagedQty);
    return sum + (accepted * (item.unitPrice || 0));
  }, 0);

  const handleSubmit = (statusToSet: string) => {
    // Navigate back to GRN list
    router.push("/stock/grn");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/stock/grn" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Goods Received Note (GRN)</h1>
            <p className="text-slate-500 text-sm">Log received supplier shipments, inspect damaged items, and update stock.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("Draft")}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Save size={18} />
            Save Draft
          </button>

          <button
            onClick={() => handleSubmit("Confirmed")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Confirm GRN & Update Stock
          </button>
        </div>
      </div>

      {/* Mode Selector Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Receiving Entry Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setEntryMode("PO")}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              entryMode === "PO"
                ? "bg-[#00184d] text-white border-[#00184d] shadow-md ring-2 ring-[#00184d]/30"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Truck size={22} className={entryMode === "PO" ? "text-white" : "text-[#00184d]"} />
            <div>
              <p className="font-bold text-sm">Against Purchase Order (PO)</p>
              <p className={`text-xs mt-0.5 ${entryMode === "PO" ? "text-blue-100" : "text-slate-500"}`}>
                Select a PO to pre-fill ordered items, supplier details, and flag quantity discrepancies automatically.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode("DIRECT")}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              entryMode === "DIRECT"
                ? "bg-[#00184d] text-white border-[#00184d] shadow-md ring-2 ring-[#00184d]/30"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Package size={22} className={entryMode === "DIRECT" ? "text-white" : "text-[#00184d]"} />
            <div>
              <p className="font-bold text-sm">Direct Stock Receipt (No PO)</p>
              <p className={`text-xs mt-0.5 ${entryMode === "DIRECT" ? "text-blue-100" : "text-slate-500"}`}>
                Manually record incoming stock from a supplier without linking to a prior Purchase Order.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Supplier & Header Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 size={20} className="text-[#00184d]" />
          Shipment & Supplier Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PO Dropdown (if PO mode) */}
          {entryMode === "PO" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Select Purchase Order <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPO}
                onChange={(e) => handlePOChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#00184d] focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              >
                {purchaseOrders.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.id} - {po.supplier} ({po.itemsCount} items)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier Name</label>
            <input
              type="text"
              required
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. Caltex Lubricants"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            />
          </div>

          {/* Delivery Note Ref */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Supplier Invoice / Delivery Note # <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DN-88491"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            />
          </div>

          {/* Receiving Warehouse */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Receiving Warehouse Location</label>
            <input
              type="text"
              value={receivingLocation}
              onChange={(e) => setReceivingLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            />
          </div>

          {/* Received Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date Received</label>
            <input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            />
          </div>
        </div>
      </div>

      {/* Item Inspection & Inspection Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Package size={20} className="text-[#00184d]" />
              Item Physical Inspection & Quantities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter physical counts, flag damaged stock, and state rejection reasons.</p>
          </div>
          {entryMode === "DIRECT" && (
            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-[#00184d] hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add Stock Line Item
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="py-3 px-3 font-semibold w-36">SKU Code</th>
                <th className="py-3 px-3 font-semibold">Item Description</th>
                {entryMode === "PO" && <th className="py-3 px-3 font-semibold text-center w-20">Ordered</th>}
                <th className="py-3 px-3 font-semibold text-center w-24">Received</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Damaged</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Accepted</th>
                <th className="py-3 px-3 font-semibold w-48">Rejection Reason</th>
                <th className="py-3 px-3 font-semibold text-right w-28">Unit Cost</th>
                <th className="py-3 px-3 font-semibold text-center w-28">PO Match Tag</th>
                {entryMode === "DIRECT" && <th className="py-3 px-3 w-10"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const accepted = calculateAcceptedQty(item.receivedQty, item.damagedQty);
                const tag = calculateDiscrepancy(item.orderedQty, item.receivedQty, item.damagedQty);

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50">
                    {/* SKU */}
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="SKU-101"
                        value={item.sku}
                        onChange={(e) => updateItem(item.id, "sku", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-[#00184d] focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Description */}
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="Item name description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Ordered (if PO mode) */}
                    {entryMode === "PO" && (
                      <td className="py-3 px-3 text-center font-semibold text-slate-500 text-xs">
                        {item.orderedQty}
                      </td>
                    )}

                    {/* Received Qty */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={item.receivedQty}
                        onChange={(e) => updateItem(item.id, "receivedQty", Number(e.target.value))}
                        className="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Damaged Qty */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={item.damagedQty}
                        onChange={(e) => updateItem(item.id, "damagedQty", Number(e.target.value))}
                        className="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </td>

                    {/* Accepted Qty */}
                    <td className="py-3 px-3 text-center font-bold text-green-700 text-sm">
                      {accepted}
                    </td>

                    {/* Rejection Reason */}
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder={item.damagedQty > 0 ? "Reason for damage..." : "None"}
                        disabled={item.damagedQty === 0}
                        value={item.rejectionReason}
                        onChange={(e) => updateItem(item.id, "rejectionReason", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 disabled:bg-slate-100 disabled:opacity-50"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                        className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Discrepancy Tag */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold border ${tag.color}`}>
                        {tag.text}
                      </span>
                    </td>

                    {/* Delete button (Direct mode) */}
                    {entryMode === "DIRECT" && (
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          disabled={items.length === 1}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors disabled:opacity-30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Accepted Value Summary */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/60 p-4 rounded-xl">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Inspected Stock Value</span>
            <span className="text-xs text-slate-400">Accepted quantities will be added to warehouse stock once confirmed.</span>
          </div>
          <span className="text-2xl font-bold text-[#00184d]">
            Rs. {totalAcceptedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Notes / Remarks */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">GRN Receiving Notes / Warehouse Supervisor Remarks</label>
        <textarea
          rows={3}
          placeholder="State any delivery conditions, vehicle driver details, or discrepancies to report to the supplier..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] resize-none"
        ></textarea>
      </div>
    </div>
  );
}

export default function CreateGRNPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#00184d] font-semibold text-center">Loading GRN form...</div>}>
      <CreateGRNContent />
    </Suspense>
  );
}
