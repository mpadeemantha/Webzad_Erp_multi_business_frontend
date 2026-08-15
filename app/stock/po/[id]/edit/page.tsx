"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Plus, Trash2, Building2, Calendar, ShoppingCart } from "lucide-react";

export default function EditPOPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const poId = resolvedParams.id.toUpperCase();

  const [supplierName, setSupplierName] = useState("Caltex Lubricants Lanka (Pvt) Ltd");
  const [orderDate, setOrderDate] = useState("2023-10-24");
  const [expectedDate, setExpectedDate] = useState("2023-10-28");
  const [deliveryLocation, setDeliveryLocation] = useState("Main Workshop Bay");
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days after goods receipt and GRN confirmation.");

  const [items, setItems] = useState([
    { id: 1, sku: "OIL-MOB-5W30", description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)", quantity: 100, unitCost: 6500 },
    { id: 2, sku: "FLD-DOT4-500", description: "Bosch DOT4 Brake Fluid 500ml", quantity: 20, unitCost: 1800 },
  ]);

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
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitCost) || 0), 0);

  const handleSave = () => {
    router.push(`/stock/po/${resolvedParams.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/stock/po/${resolvedParams.id}`} className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Purchase Order {poId}</h1>
            <p className="text-slate-500 text-sm">Update line items, expected delivery dates, or supplier notes.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      {/* Form Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Delivery Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-semibold text-slate-800">Order Items</h2>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-[#00184d] hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Line Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="py-3 px-3 font-semibold">SKU</th>
                <th className="py-3 px-3 font-semibold">Description</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Quantity</th>
                <th className="py-3 px-3 font-semibold text-right w-36">Unit Cost (Rs.)</th>
                <th className="py-3 px-3 font-semibold text-right w-36">Total</th>
                <th className="py-3 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={item.sku}
                      onChange={(e) => updateRow(item.id, "sku", e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-[#00184d]"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateRow(item.id, "description", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateRow(item.id, "quantity", Number(e.target.value))}
                      className="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <input
                      type="number"
                      value={item.unitCost}
                      onChange={(e) => updateRow(item.id, "unitCost", Number(e.target.value))}
                      className="w-28 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-right"
                    />
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    Rs. {(item.quantity * item.unitCost).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      disabled={items.length === 1}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-800">Total Order Amount</span>
          <span className="text-xl font-bold text-[#00184d]">Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
