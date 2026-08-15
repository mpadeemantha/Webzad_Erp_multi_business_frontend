"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Package, Tag, Warehouse, Building2, Barcode } from "lucide-react";

const CATEGORIES = ["Oils & Lubricants", "Brake Parts", "Filters", "Tyres", "Engine Parts", "Electrical", "Body Parts", "Coolants & Fluids"];
const UNITS = ["Pcs", "Set", "Can", "Litre", "Bottle", "Kg", "Box"];
const WAREHOUSES = ["Main Workshop Bay", "Parts Storeroom A", "Tyre Bay"];
const SUPPLIERS = ["Caltex Lanka", "Toyota Lanka", "Bosch Lanka", "Bridgestone Lanka", "NGK Lanka", "Honda Lanka"];

export default function AddItemPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", sku: "", barcode: "", category: "Oils & Lubricants", unit: "Pcs",
    supplier: "Caltex Lanka", warehouse: "Parts Storeroom A",
    costPrice: "", sellPrice: "", reorderPoint: "", openingStock: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => router.push("/stock/items");

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/stock/items" className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Stock Item</h1>
          <p className="text-slate-500 text-sm">Register a new item in the inventory catalog with pricing and warehouse details.</p>
        </div>
      </div>

      {/* Identity */}
      <FormCard title="Item Identity" icon={<Package size={16} className="text-[#00184d]" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Item Name" required>
            <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
              placeholder="e.g. Mobil 1 Synthetic Engine Oil 5W-30"
              className={inputClass} />
          </Field>
          <Field label="SKU Code" required>
            <input type="text" value={form.sku} onChange={e => update("sku", e.target.value)}
              placeholder="e.g. OIL-MOB-5W30"
              className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Barcode / ISBN" hint="For future barcode scanning support">
            <input type="text" value={form.barcode} onChange={e => update("barcode", e.target.value)}
              placeholder="e.g. 4902867001153"
              className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Unit of Measurement">
            <select value={form.unit} onChange={e => update("unit", e.target.value)} className={inputClass}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </Field>
          <Field label="Category" required>
            <select value={form.category} onChange={e => update("category", e.target.value)} className={inputClass}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Linked Supplier">
            <select value={form.supplier} onChange={e => update("supplier", e.target.value)} className={inputClass}>
              {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </FormCard>

      {/* Pricing */}
      <FormCard title="Pricing" icon={<Tag size={16} className="text-[#00184d]" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Cost Price (Rs.)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
              <input type="number" min="0" value={form.costPrice} onChange={e => update("costPrice", e.target.value)}
                placeholder="0.00" className={`${inputClass} pl-10`} />
            </div>
          </Field>
          <Field label="Selling Price (Rs.)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
              <input type="number" min="0" value={form.sellPrice} onChange={e => update("sellPrice", e.target.value)}
                placeholder="0.00" className={`${inputClass} pl-10`} />
            </div>
          </Field>
          {form.costPrice && form.sellPrice && (
            <div className="sm:col-span-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800 font-medium">
              Gross Margin: <strong>Rs. {(Number(form.sellPrice) - Number(form.costPrice)).toLocaleString()}</strong>
              {" "}({Math.round(((Number(form.sellPrice) - Number(form.costPrice)) / Number(form.sellPrice)) * 100)}%)
            </div>
          )}
        </div>
      </FormCard>

      {/* Stock & Warehouse */}
      <FormCard title="Stock & Warehouse" icon={<Warehouse size={16} className="text-[#00184d]" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Warehouse Location" required>
            <select value={form.warehouse} onChange={e => update("warehouse", e.target.value)} className={inputClass}>
              {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
            </select>
          </Field>
          <Field label="Minimum Reorder Point" required hint="Stock alert triggers below this quantity">
            <input type="number" min="0" value={form.reorderPoint} onChange={e => update("reorderPoint", e.target.value)}
              placeholder="e.g. 10" className={inputClass} />
          </Field>
          <Field label="Opening Stock Quantity">
            <input type="number" min="0" value={form.openingStock} onChange={e => update("openingStock", e.target.value)}
              placeholder="e.g. 50" className={inputClass} />
          </Field>
        </div>
      </FormCard>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/stock/items"
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
          Cancel
        </Link>
        <button onClick={handleSave}
          className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Save size={16} /> Save Item to Catalog
        </button>
      </div>
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all";

function FormCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-xs text-slate-400 font-normal ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
