"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Plus, Trash2, Building2, Calendar, Warehouse, ShoppingCart, Tag } from "lucide-react";

export default function CreatePOPage() {
  const router = useRouter();

  const [supplierName, setSupplierName] = useState("Caltex Lubricants Lanka (Pvt) Ltd");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [deliveryLocation, setDeliveryLocation] = useState("Main Workshop Bay");
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days after goods receipt and GRN confirmation.");

  const suppliersList = [
    "Caltex Lubricants Lanka (Pvt) Ltd",
    "Toyota Lanka Spare Parts",
    "Bosch Auto Parts Lanka",
    "Bridgestone Lanka Tyres",
    "NGK Spark Plugs Lanka",
    "Honda Lanka Spare Parts",
  ];

  const presetItems = [
    { sku: "OIL-MOB-5W30", description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)", unitCost: 6500 },
    { sku: "BRK-PAD-TOY", description: "Genuine Toyota Prius Front Brake Pad Set", unitCost: 8500 },
    { sku: "FLT-AIR-HND", description: "Honda Civic Engine Air Filter Element", unitCost: 2500 },
    { sku: "TYR-BCH-205", description: "Bridgestone Ecopia 205/55R16 Tyre", unitCost: 28000 },
    { sku: "FLD-DOT4-500", description: "Bosch DOT4 Brake Fluid 500ml", unitCost: 1800 },
  ];

  const [items, setItems] = useState([
    { id: 1, sku: "OIL-MOB-5W30", description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)", quantity: 100, unitCost: 6500 },
    { id: 2, sku: "FLD-DOT4-500", description: "Bosch DOT4 Brake Fluid 500ml", quantity: 20, unitCost: 1800 },
  ]);

  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);

  const addRow = () => {
    setItems([
      ...items,
      { id: Date.now(), sku: "", description: "", quantity: 1, unitCost: 0 }
    ]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateRow = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "preset") {
            const preset = presetItems.find(p => p.sku === value);
            if (preset) {
              return { ...item, sku: preset.sku, description: preset.description, unitCost: preset.unitCost };
            }
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitCost) || 0), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discountAmount = (subtotal * discountRate) / 100;
  const grandTotal = subtotal + taxAmount - discountAmount;

  const handleSubmit = (status: "Draft" | "Sent") => {
    router.push("/stock/po");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/stock/po" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Purchase Order</h1>
              <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                PO-2023-089
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">Order stock items from registered suppliers with payment and delivery terms.</p>
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
            onClick={() => handleSubmit("Sent")}
            className="px-5 py-2 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <Send size={18} />
            Send to Supplier
          </button>
        </div>
      </div>

      {/* Supplier & Header Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 size={20} className="text-[#00184d]" />
          Supplier & Order Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supplier Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Supplier <span className="text-red-500">*</span>
            </label>
            <select
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#00184d] focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            >
              {suppliersList.map((sup, i) => (
                <option key={i} value={sup}>{sup}</option>
              ))}
            </select>
          </div>

          {/* Order Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            />
          </div>

          {/* Expected Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Expected Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            />
          </div>

          {/* Receiving Warehouse */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Receiving Warehouse Location <span className="text-red-500">*</span>
            </label>
            <select
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
            >
              <option value="Main Workshop Bay">Main Workshop Bay (Section A)</option>
              <option value="Parts Storeroom A">Parts Storeroom A (Rack 04)</option>
              <option value="Tyre Bay">Tyre Bay (Bay T-01)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Line Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#00184d]" />
            Order Line Items
          </h2>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-[#00184d] hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Line Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[750px]">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="py-3 px-3 font-semibold w-48">Select Preset Item</th>
                <th className="py-3 px-3 font-semibold">Item Description</th>
                <th className="py-3 px-3 font-semibold text-center w-28">Quantity</th>
                <th className="py-3 px-3 font-semibold text-right w-36">Unit Cost (Rs.)</th>
                <th className="py-3 px-3 font-semibold text-right w-36">Line Total</th>
                <th className="py-3 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const lineTotal = Number(item.quantity) * Number(item.unitCost) || 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    {/* Preset Picker */}
                    <td className="py-3 px-3">
                      <select
                        value={item.sku}
                        onChange={(e) => updateRow(item.id, "preset", e.target.value)}
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      >
                        <option value="">Custom Item</option>
                        {presetItems.map((p) => (
                          <option key={p.sku} value={p.sku}>{p.sku} - {p.description.substring(0, 20)}...</option>
                        ))}
                      </select>
                    </td>

                    {/* Item Description */}
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="Enter item description..."
                        value={item.description}
                        onChange={(e) => updateRow(item.id, "description", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateRow(item.id, "quantity", Number(e.target.value))}
                        className="w-20 px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Unit Cost */}
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.unitCost}
                        onChange={(e) => updateRow(item.id, "unitCost", Number(e.target.value))}
                        className="w-28 px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                      />
                    </td>

                    {/* Line Total */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      Rs. {lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Delete button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(item.id)}
                        disabled={items.length === 1}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Payment Terms & Delivery Instructions
              </label>
              <textarea
                rows={3}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="State payment terms, delivery window, or special handling notes..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 resize-none"
              />
            </div>
          </div>

          <div className="w-full md:w-80 space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold">Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Tax (0%)</span>
              <span className="font-semibold">Rs. 0.00</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Grand Total</span>
              <span className="text-xl font-bold text-[#00184d]">
                Rs. {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
