"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  DollarSign, Play, Eye, CheckCircle2, Search, Lock,
  AlertCircle, X, Loader2, ArrowLeft, ChevronRight,
  TrendingUp, Users, Banknote, Shield, Trash2, RefreshCw,
} from "lucide-react";
import {
  getPayrollRuns, runPayroll, finalizePayrollRun, deletePayrollRun, getPayrollRunDetail,
  PayrollRunSummary, PayrollRunDetail, Payslip, formatMoney, monthLabel,
} from "@/utils/api/payroll";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function PayrollPage() {
  const now = new Date();
  // Default to first → last day of current month
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString().slice(0, 10);
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Run list
  const [runs, setRuns] = useState<PayrollRunSummary[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);
  const [runsError, setRunsError] = useState<string | null>(null);

  // Selected run detail
  const [selectedRun, setSelectedRun] = useState<PayrollRunDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Modals
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDeletingRun, setIsDeletingRun] = useState<string | null>(null); // stores id being deleted

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Years dropdown
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const loadRuns = useCallback(async () => {
    setIsLoadingRuns(true);
    setRunsError(null);
    try {
      const res = await getPayrollRuns({ year: selectedYear, limit: 24 });
      setRuns(res.data ?? []);
      // Auto-select the first run if none selected
      if (res.data.length > 0 && !selectedRun) {
        loadRunDetail(res.data[0].id);
      }
    } catch (err: any) {
      setRunsError(err?.message ?? "Failed to load payroll runs.");
    } finally {
      setIsLoadingRuns(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const loadRunDetail = async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const detail = await getPayrollRunDetail(id);
      setSelectedRun(detail);
    } catch {
      // Silently fail — run list still usable
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => { loadRuns(); }, [loadRuns]);

  const handleRunPayroll = async () => {
    setRunError(null);
    setIsRunning(true);
    try {
      const created = await runPayroll(startDate, endDate);
      setSelectedRun(created);
      setRuns(prev => [{ ...created, _count: { payslips: created.payslips.length } }, ...prev]);
      setIsRunModalOpen(false);
    } catch (err: any) {
      setRunError(err?.message ?? "Failed to run payroll.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleDeleteRun = async (run: PayrollRunSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete the payroll run for this period? All payslips will be permanently removed.`)) return;
    setIsDeletingRun(run.id);
    try {
      await deletePayrollRun(run.id);
      setRuns(prev => prev.filter(r => r.id !== run.id));
      if (selectedRun?.id === run.id) {
        setSelectedRun(null);
      }
      // Pre-fill dates from the deleted run so the user can immediately re-run
      if (run.periodStart && run.periodEnd) {
        setStartDate(run.periodStart.slice(0, 10));
        setEndDate(run.periodEnd.slice(0, 10));
      }
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete payroll run.");
    } finally {
      setIsDeletingRun(null);
    }
  };

  const handleFinalize = async () => {
    if (!selectedRun) return;
    if (!confirm(`Finalize the payroll run for ${monthLabel(selectedRun.month, selectedRun.year)}? This action cannot be undone.`)) return;
    setIsFinalizing(true);
    try {
      const updated = await finalizePayrollRun(selectedRun.id);
      setSelectedRun(prev => prev ? { ...prev, status: updated.status } : prev);
      setRuns(prev => prev.map(r => r.id === selectedRun.id ? { ...r, status: updated.status } : r));
    } catch (err: any) {
      alert(err?.message ?? "Failed to finalize payroll.");
    } finally {
      setIsFinalizing(false);
    }
  };

  // Compute KPIs from selected run's payslips
  const payslips = selectedRun?.payslips ?? [];
  const filteredPayslips = payslips.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (p.employee?.fullName ?? "").toLowerCase().includes(q) ||
      (p.employee?.employeeCode ?? "").toLowerCase().includes(q) ||
      (p.employee?.designation ?? "").toLowerCase().includes(q)
    );
  });

  const toNum = (v: unknown) => parseFloat(String(v)) || 0;
  const totalGross = payslips.reduce((s, p) => s + toNum(p.grossPay), 0);
  const totalEpfEmployee = payslips.reduce((s, p) => s + toNum(p.epfEmployeeDeduction), 0);
  const totalEmployerContrib = payslips.reduce(
    (s, p) => s + toNum(p.epfEmployerContribution) + toNum(p.etfEmployerContribution), 0
  );
  const totalNet = payslips.reduce((s, p) => s + toNum(p.netPay), 0);

  const kpiCards = [
    { label: "Total Gross Payroll", value: formatMoney(totalGross), sub: "Basic + Allowances", icon: TrendingUp, color: "blue" },
    { label: "Employee EPF (8%)", value: formatMoney(totalEpfEmployee), sub: "Deducted from staff", icon: Shield, color: "amber" },
    { label: "Employer EPF+ETF (15%)", value: formatMoney(totalEmployerContrib), sub: "Company contribution", icon: Banknote, color: "purple" },
    { label: "Total Net Payout", value: formatMoney(totalNet), sub: "Net bank transfers", icon: DollarSign, color: "emerald" },
  ];

  const colorMap: Record<string, string> = {
    blue:    "bg-blue-50 text-blue-600 border-blue-100",
    amber:   "bg-amber-50 text-amber-600 border-amber-100",
    purple:  "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/hr" className="text-xs font-semibold text-slate-400 hover:text-[#00184d] flex items-center gap-1 transition-colors">
          <ArrowLeft size={12} /> HR Dashboard
        </Link>
        <ChevronRight size={10} className="text-slate-300" />
        <span className="text-xs font-semibold text-[#00184d] uppercase tracking-wider">Payroll & Payslips</span>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payroll & Payslips</h1>
          <p className="text-slate-500 text-sm mt-1">Monthly payroll processing, EPF/ETF contributions, net salaries, and printable payslips.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#00184d] focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 shadow-sm"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            onClick={() => setIsRunModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm text-sm"
          >
            <Play size={16} fill="currentColor" />
            Run Monthly Payroll
          </button>
        </div>
      </div>

      {runsError && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{runsError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar: Run history */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payroll Runs</p>
            </div>
            <div className="divide-y divide-slate-50">
              {isLoadingRuns ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 size={20} className="animate-spin text-slate-400" />
                </div>
              ) : runs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs px-4">No payroll runs for {selectedYear}. Click "Run Monthly Payroll" to begin.</div>
              ) : (
                runs.map(run => (
                  <div
                    key={run.id}
                    onClick={() => loadRunDetail(run.id)}
                    role="button"
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${selectedRun?.id === run.id ? "bg-[#00184d]/5 border-l-2 border-[#00184d]" : ""}`}
                  >
                    <p className="text-sm font-bold text-slate-800">
                      {run.periodStart && run.periodEnd
                        ? `${new Date(run.periodStart).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} – ${new Date(run.periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                        : monthLabel(run.month, run.year)}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400">{run._count.payslips} employees</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${run.status === "finalized" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {run.status === "finalized" ? "Finalized" : "Draft"}
                        </span>
                        <button
                          onClick={(e) => handleDeleteRun(run, e)}
                          disabled={isDeletingRun === run.id}
                          title="Delete this run"
                          className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors disabled:opacity-50"
                        >
                          {isDeletingRun === run.id
                            ? <Loader2 size={12} className="animate-spin" />
                            : <Trash2 size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-5">
          {selectedRun ? (
            <>
              {/* Run header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedRun.periodStart && selectedRun.periodEnd
                      ? `${new Date(selectedRun.periodStart).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} – ${new Date(selectedRun.periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                      : `${monthLabel(selectedRun.month, selectedRun.year)} Payroll`}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Run by {selectedRun.runBy?.name} · {new Date(selectedRun.runAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${selectedRun.status === "finalized" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                    {selectedRun.status === "finalized" ? (
                      <span className="flex items-center gap-1"><CheckCircle2 size={12} />Finalized</span>
                    ) : (
                      <span className="flex items-center gap-1"><Lock size={12} />Draft</span>
                    )}
                  </span>
                  {selectedRun.status === "draft" && (
                    <button
                      onClick={handleFinalize}
                      disabled={isFinalizing}
                      className="inline-flex items-center gap-1.5 bg-[#00184d] text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-blue-900 disabled:opacity-60 transition-colors"
                    >
                      {isFinalizing ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
                      Finalize
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteRun(selectedRun as unknown as PayrollRunSummary, e)}
                    disabled={isDeletingRun === selectedRun.id}
                    title="Delete this run"
                    className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-100 disabled:opacity-60 transition-colors"
                  >
                    {isDeletingRun === selectedRun.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Trash2 size={12} />}
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      handleDeleteRun(selectedRun as unknown as PayrollRunSummary, e).then(() => {
                        setIsRunModalOpen(true);
                      });
                    }}
                    disabled={isDeletingRun === selectedRun.id}
                    title="Delete and re-run payroll"
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-emerald-100 disabled:opacity-60 transition-colors"
                  >
                    <RefreshCw size={12} />
                    Re-run
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {kpiCards.map((card, i) => (
                  <div key={i} className={`bg-white p-4 rounded-2xl shadow-sm border ${colorMap[card.color].split(" ").slice(2).join(" ")} flex flex-col gap-2`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[card.color].split(" ").slice(0, 2).join(" ")}`}>
                      <card.icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">{card.label}</p>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5 tracking-tight">{card.value}</p>
                      <p className="text-xs text-slate-400">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payslip Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center border-b border-slate-100 bg-slate-50/50">
                  <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search staff..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users size={14} className="text-slate-400" />
                    {filteredPayslips.length} of {payslips.length} employees
                  </div>
                </div>

                {isLoadingDetail ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 size={24} className="animate-spin text-slate-300" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-5 py-4 font-semibold">Employee</th>
                          <th className="px-5 py-4 font-semibold">Dept.</th>
                          <th className="px-5 py-4 font-semibold text-right">Basic</th>
                          <th className="px-5 py-4 font-semibold text-right">Allowances</th>
                          <th className="px-5 py-4 font-semibold text-right">Daily Allow.</th>
                          <th className="px-5 py-4 font-semibold text-right">Gross</th>
                          <th className="px-5 py-4 font-semibold text-right text-rose-500">EPF 8%</th>
                          <th className="px-5 py-4 font-semibold text-right text-emerald-600">Net Pay</th>
                          <th className="px-5 py-4 font-semibold text-center">Payslip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredPayslips.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                              No payslips found matching your search.
                            </td>
                          </tr>
                        ) : (
                          filteredPayslips.map((p: Payslip) => (
                            <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-5 py-3.5">
                                <p className="font-bold text-slate-900 text-sm">{p.employee?.fullName}</p>
                                <p className="text-xs font-mono text-[#00184d] font-semibold">{p.employee?.employeeCode}</p>
                              </td>
                              <td className="px-5 py-3.5">
                                <p className="text-xs font-semibold text-slate-700">{p.employee?.designation}</p>
                                <p className="text-xs text-slate-400">{p.employee?.department}</p>
                              </td>
                              <td className="px-5 py-3.5 text-right text-xs text-slate-600 font-medium">{formatMoney(p.basicSalary)}</td>
                              <td className="px-5 py-3.5 text-right text-xs text-slate-600 font-medium">{formatMoney(p.fixedAllowances)}</td>
                              <td className="px-5 py-3.5 text-right text-xs text-slate-500">{formatMoney(p.dailyAllowanceTotal)}</td>
                              <td className="px-5 py-3.5 text-right text-sm font-bold text-slate-800">{formatMoney(p.grossPay)}</td>
                              <td className="px-5 py-3.5 text-right text-xs font-semibold text-rose-500">-{formatMoney(p.epfEmployeeDeduction)}</td>
                              <td className="px-5 py-3.5 text-right font-extrabold text-[#00184d] text-sm">{formatMoney(p.netPay)}</td>
                              <td className="px-5 py-3.5 text-center">
                                <Link
                                  href={`/hr/payroll/payslip/${p.id}`}
                                  className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-100 rounded-lg transition-colors"
                                  title="View Payslip"
                                >
                                  <Eye size={16} />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : isLoadingRuns ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 size={28} className="animate-spin text-slate-300" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <DollarSign size={24} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-700">No Payroll Run Selected</p>
              <p className="text-sm text-slate-400 mt-1 max-w-xs">Select a run from the sidebar, or click "Run Monthly Payroll" to generate payslips for this month.</p>
            </div>
          )}
        </div>
      </div>

      {/* Run Payroll Confirmation Modal */}
      {isRunModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Run Monthly Payroll</h2>
              <button onClick={() => setIsRunModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X size={18} />
              </button>
            </div>

            {runError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{runError}</span>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <strong>Note:</strong> This will generate payslips for all active employees using their current salary and attendance data from <strong>{startDate}</strong> to <strong>{endDate}</strong>. The run will start as a <strong>Draft</strong>.
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsRunModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRunPayroll}
                disabled={isRunning}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-70"
              >
                {isRunning ? (
                  <><Loader2 size={14} className="animate-spin" /> Running...</>
                ) : (
                  <><Play size={14} fill="currentColor" /> Confirm & Run</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
