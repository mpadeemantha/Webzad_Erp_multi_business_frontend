"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Percent,
  DollarSign,
  Calendar,
  FileText,
  Landmark,
  Briefcase,
  Clock,
  CalendarRange,
  Coins,
  Plane,
  ShieldCheck,
  Bell,
  ArrowRight
} from "lucide-react";
import { getHrSettings, updateHrSettings, HrSettings } from "@/utils/api/hr-settings";

const TABS = [
  { id: "financial", name: "Financial Settings", desc: "Configure currency, fiscal year, and taxes.", icon: Landmark },
  { id: "designations", name: "Designations / Job Titles", desc: "Manage company designations and job structures.", icon: Briefcase },
  { id: "attendance", name: "Attendance Settings", desc: "Setup clock-in limits, late grace periods, and rules.", icon: Clock },
  { id: "schedule", name: "Working Schedule", desc: "Set standard shifts, weekends, and calendar settings.", icon: CalendarRange },
  { id: "payroll", name: "Payroll Settings", desc: "Manage EPF/ETF statutory contributions and payslip templates.", icon: Coins },
  { id: "leave", name: "Leave Settings", desc: "Configure leave categories, balances, and carryover rules.", icon: Plane },
  { id: "policies", name: "Company Policies", desc: "Upload and publish code of conduct and policy sheets.", icon: ShieldCheck },
  { id: "notifications", name: "Notification Settings", desc: "Configure custom email, chat, and task notifications.", icon: Bell },
];

export default function HrSettingsPage() {
  const [activeTab, setActiveTab] = useState("payroll");
  const [settings, setSettings] = useState<HrSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states as percentages for convenience in editing
  const [epfEmployeePct, setEpfEmployeePct] = useState("8.00");
  const [epfEmployerPct, setEpfEmployerPct] = useState("12.00");
  const [etfEmployerPct, setEtfEmployerPct] = useState("3.00");
  const [workingDays, setWorkingDays] = useState(26);
  const [currency, setCurrency] = useState("LKR");
  const [footerNote, setFooterNote] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await getHrSettings();
        setSettings(res);
        setEpfEmployeePct((parseFloat(String(res.epfEmployeeRate)) * 100).toFixed(2));
        setEpfEmployerPct((parseFloat(String(res.epfEmployerRate)) * 100).toFixed(2));
        setEtfEmployerPct((parseFloat(String(res.etfEmployerRate)) * 100).toFixed(2));
        setWorkingDays(res.workingDaysPerMonth);
        setCurrency(res.currencyCode);
        setFooterNote(res.payslipFooterNote || "");
      } catch (err: any) {
        setError(err?.message ?? "Failed to load HR settings.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<HrSettings> = {
        epfEmployeeRate: parseFloat(epfEmployeePct) / 100,
        epfEmployerRate: parseFloat(epfEmployerPct) / 100,
        etfEmployerRate: parseFloat(etfEmployerPct) / 100,
        workingDaysPerMonth: workingDays,
        currencyCode: currency,
        payslipFooterNote: footerNote || null,
      };
      const updated = await updateHrSettings(payload);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save HR settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="animate-spin text-[#00184d] mb-4" size={32} />
        <p className="text-slate-500 text-sm">Loading HR settings...</p>
      </div>
    );
  }

  const activeTabInfo = TABS.find((t) => t.id === activeTab)!;
  const ActiveIcon = activeTabInfo.icon;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure parameters and operations rules for your HR and Payroll department.</p>
        </div>
        {activeTab === "payroll" && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center justify-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all min-w-[120px] ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-[#00184d] hover:bg-blue-900 text-white disabled:opacity-50"
            }`}
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : saved ? (
              <><Check size={15} /> Saved!</>
            ) : (
              "Save Changes"
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Settings Layout with Vertical Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-fit">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">Settings Category</p>
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setError(null);
                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? "bg-[#00184d] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <TabIcon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                  <span className="truncate">{tab.name}</span>
                </div>
                {isActive && <ArrowRight size={12} className="text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Setting Content Panel */}
        <div className="lg:col-span-3">
          {activeTab === "payroll" ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              
              {/* Core Forms */}
              <div className="xl:col-span-2 space-y-5">
                
                {/* Statutory Rates */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                  <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Percent size={16} className="text-[#00184d]" /> Statutory Contribution Rates
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Employee EPF (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={epfEmployeePct}
                          onChange={(e) => setEpfEmployeePct(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Deducted from basic salary (e.g. 8.00%)</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Employer EPF (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={epfEmployerPct}
                          onChange={(e) => setEpfEmployerPct(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Paid by company (e.g. 12.00%)</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Employer ETF (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={etfEmployerPct}
                          onChange={(e) => setEtfEmployerPct(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Paid by company (e.g. 3.00%)</p>
                    </div>
                  </div>
                </div>

                {/* Work Defaults */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                  <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Calendar size={16} className="text-[#00184d]" /> Work & Salary Defaults
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Default Working Days / Month</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(parseInt(e.target.value) || 26)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Used to compute daily rate for leave deductions</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Salary Currency Code</label>
                      <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                          className="w-full pl-8 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Currency label on payslips (e.g. LKR, USD)</p>
                    </div>
                  </div>
                </div>

                {/* Payslip Footer Template */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                  <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                    <FileText size={16} className="text-[#00184d]" /> Payslip Template
                  </h2>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Payslip Footer Note</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. This is a computer generated document, signature is not required."
                      value={footerNote}
                      onChange={(e) => setFooterNote(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Will be printed at the bottom of all employee payslips.</p>
                  </div>
                </div>
              </div>

              {/* Sidebar Help */}
              <div className="space-y-5">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Need Help?</h3>
                  <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <p>
                      <strong>Statutory EPF & ETF Rates:</strong> By default in Sri Lanka, the employee contribution is 8% of the basic salary, and the employer contribution is 12% for EPF and 3% for ETF.
                    </p>
                    <p>
                      <strong>Applying Custom Rates:</strong> When you change these percentages, the system will apply them immediately to any new, un-finalized payroll runs. Past finalized runs will remain unchanged to preserve history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Coming Soon State for all other tabs */
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <ActiveIcon size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-base">{activeTabInfo.name}</h3>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                  {activeTabInfo.desc}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
