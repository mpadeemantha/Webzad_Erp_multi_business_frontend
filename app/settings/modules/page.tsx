"use client";

import { useState } from "react";
import Link from "next/link";
import { ToggleLeft, ToggleRight, Wrench, FileText, Package, Users, ShoppingCart, BarChart2, Settings, CheckCircle, Info } from "lucide-react";

const modules = [
  {
    id: "jobs",
    name: "Job Cards",
    description: "Manage customer vehicle service jobs from intake to delivery.",
    icon: Wrench,
    color: "bg-blue-50 text-blue-600",
    enabled: true,
    version: "v1.2",
    pages: ["Job List", "Create Job", "Job Detail", "Job → Invoice Conversion"],
  },
  {
    id: "invoicing",
    name: "Invoicing",
    description: "Create and manage invoices, record payments, and track outstanding balances.",
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600",
    enabled: true,
    version: "v1.3",
    pages: ["Invoice List", "Create Invoice", "Invoice Detail", "Payments", "Customers"],
  },
  {
    id: "stock",
    name: "Stock Management",
    description: "Full inventory management — items, GRNs, warehouses, transfers, and low-stock alerts.",
    icon: Package,
    color: "bg-purple-50 text-purple-600",
    enabled: true,
    version: "v1.1",
    pages: ["Stock Dashboard", "Item Catalog", "GRN", "Warehouses", "Transfers", "Low Stock", "Reports", "Suppliers"],
  },
  {
    id: "po",
    name: "Purchase Orders",
    description: "Raise purchase orders to suppliers and track delivery against GRNs.",
    icon: ShoppingCart,
    color: "bg-indigo-50 text-indigo-600",
    enabled: true,
    version: "v1.0",
    pages: ["PO List", "Create PO", "PO Detail", "Printable PO"],
  },
  {
    id: "hr",
    name: "HR & Payroll",
    description: "Employee profiles, attendance, leave management, and monthly payroll processing.",
    icon: Users,
    color: "bg-rose-50 text-rose-600",
    enabled: true,
    version: "v1.0",
    pages: ["HR Dashboard", "Employee Directory", "Attendance", "Leave", "Payroll", "Payslips", "Self-Portal"],
    settingsUrl: "/settings/hr",
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    description: "Cross-module reporting, financial summaries, and business analytics.",
    icon: BarChart2,
    color: "bg-amber-50 text-amber-600",
    enabled: false,
    version: "v0.9 (Beta)",
    pages: ["Revenue Reports", "Stock Valuation", "HR Summary", "Custom Reports"],
  },
];

export default function ModuleManagementPage() {
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map((m) => [m.id, m.enabled]))
  );
  const [saving, setSaving] = useState<string | null>(null);

  const toggle = (id: string) => {
    const current = moduleStates[id];
    setSaving(id);
    setTimeout(() => {
      setModuleStates((prev) => ({ ...prev, [id]: !current }));
      setSaving(null);
    }, 600);
  };

  const enabledCount = Object.values(moduleStates).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Module Management</h1>
          <p className="text-slate-500 text-sm mt-1">Enable or disable system modules. Changes apply immediately.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded-xl">
          <CheckCircle size={15} />
          {enabledCount} of {modules.length} modules active
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p>Disabling a module hides it from the navigation and restricts access for all users. Existing data is preserved and can be restored by re-enabling the module.</p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isEnabled = moduleStates[mod.id];
          const isSaving = saving === mod.id;

          return (
            <div
              key={mod.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-all ${
                isEnabled ? "border-slate-100" : "border-slate-200 opacity-60"
              }`}
            >
              {/* Module Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${mod.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">{mod.name}</h2>
                    <span className="text-[10px] text-slate-400">{mod.version}</span>
                  </div>
                </div>

                {/* Actions (Toggle & Settings) */}
                <div className="flex items-center gap-2">
                  {mod.settingsUrl && isEnabled && (
                    <Link
                      href={mod.settingsUrl}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                      title="Module settings"
                    >
                      <Settings size={15} />
                    </Link>
                  )}
                  <button
                    onClick={() => toggle(mod.id)}
                    disabled={isSaving}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isEnabled
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    } ${isSaving ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {isEnabled
                      ? <><ToggleRight size={15} /> Active</>
                      : <><ToggleLeft size={15} /> Disabled</>
                    }
                  </button>
                </div>
              </div>


              <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>

              {/* Included Pages */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Included Pages</p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.pages.map((pg) => (
                    <span key={pg} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{pg}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
