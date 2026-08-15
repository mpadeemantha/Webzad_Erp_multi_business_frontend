"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Bell, Mail, Smartphone, Package, FileText, Wrench, Users, ShoppingCart, Check } from "lucide-react";

const categories = [
  {
    id: "stock",
    label: "Stock & Inventory",
    icon: Package,
    color: "text-purple-600 bg-purple-50",
    items: [
      { id: "stock.lowstock", label: "Low Stock Alerts", desc: "Notify when an item falls below its reorder point" },
      { id: "stock.grn", label: "GRN Confirmed", desc: "Notify when a goods received note is confirmed" },
      { id: "stock.transfer", label: "Stock Transfer Complete", desc: "Notify when a stock transfer is completed" },
    ],
  },
  {
    id: "invoicing",
    label: "Invoicing & Payments",
    icon: FileText,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { id: "inv.payment", label: "Payment Received", desc: "Notify when a payment is recorded against an invoice" },
      { id: "inv.overdue", label: "Invoice Overdue", desc: "Notify when an invoice passes its due date unpaid" },
      { id: "inv.created", label: "New Invoice Created", desc: "Notify when a new invoice is generated" },
    ],
  },
  {
    id: "jobs",
    label: "Job Cards",
    icon: Wrench,
    color: "text-blue-600 bg-blue-50",
    items: [
      { id: "job.new", label: "New Job Card Created", desc: "Notify when a new job is logged" },
      { id: "job.status", label: "Job Status Changed", desc: "Notify when a job moves to In Progress, Completed, or Delivered" },
      { id: "job.assign", label: "Worker Assigned to Job", desc: "Notify the assigned worker when a job is allocated" },
    ],
  },
  {
    id: "hr",
    label: "HR & Leave",
    icon: Users,
    color: "text-rose-600 bg-rose-50",
    items: [
      { id: "hr.leave", label: "Leave Request Submitted", desc: "Notify manager when an employee submits a leave request" },
      { id: "hr.leave.status", label: "Leave Approved / Rejected", desc: "Notify the employee of their leave decision" },
      { id: "hr.payroll", label: "Payroll Processed", desc: "Notify when monthly payroll run is completed" },
    ],
  },
  {
    id: "po",
    label: "Purchase Orders",
    icon: ShoppingCart,
    color: "text-indigo-600 bg-indigo-50",
    items: [
      { id: "po.created", label: "PO Created", desc: "Notify when a new purchase order is raised" },
      { id: "po.received", label: "PO Partially / Fully Received", desc: "Notify when goods arrive against a PO" },
    ],
  },
];

export default function NotificationSettingsPage() {
  const [inApp, setInApp] = useState<Set<string>>(
    new Set(categories.flatMap((c) => c.items.map((i) => i.id)))
  );
  const [email, setEmail] = useState<Set<string>>(new Set(["stock.lowstock", "inv.overdue", "hr.leave", "po.received"]));
  const [saved, setSaved] = useState(false);

  const toggle = (set: Set<string>, setter: Dispatch<SetStateAction<Set<string>>>, id: string) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Choose which events trigger in-app and email notifications.</p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-[#00184d] hover:bg-[#002470] text-white"
          }`}
        >
          {saved ? <><Check size={15} /> Saved!</> : "Save Preferences"}
        </button>
      </div>

      {/* Column Headers */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Event</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-20 justify-center">
            <Smartphone size={12} /> In-App
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-16 justify-center">
            <Mail size={12} /> Email
          </div>
        </div>

        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.id} className="border-b border-slate-100 last:border-b-0">
              {/* Category Header */}
              <div className="flex items-center gap-3 px-5 py-3 bg-slate-50/30">
                <div className={`p-1.5 rounded-lg ${cat.color}`}>
                  <CatIcon size={14} />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{cat.label}</span>
              </div>

              {/* Items */}
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/50 transition-colors border-t border-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  {/* In-App Toggle */}
                  <div className="flex justify-center w-20">
                    <button
                      onClick={() => toggle(inApp, setInApp, item.id)}
                      className={`w-10 h-5 rounded-full transition-all relative ${inApp.has(item.id) ? "bg-blue-600" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${inApp.has(item.id) ? "left-5.5" : "left-0.5"}`} />
                    </button>
                  </div>
                  {/* Email Toggle */}
                  <div className="flex justify-center w-16">
                    <button
                      onClick={() => toggle(email, setEmail, item.id)}
                      className={`w-10 h-5 rounded-full transition-all relative ${email.has(item.id) ? "bg-emerald-500" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${email.has(item.id) ? "left-5.5" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
