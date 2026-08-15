"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, ChevronRight, Printer, Download, Loader2, AlertCircle,
  CheckCircle2, Lock, User, Calendar, Briefcase, Building2,
} from "lucide-react";
import { getPayslip, Payslip, formatMoney, monthLabel } from "@/utils/api/payroll";

function DecimalRow({ label, value, variant = "normal", indent = false }: {
  label: string;
  value: string;
  variant?: "normal" | "deduction" | "total" | "net" | "employer";
  indent?: boolean;
}) {
  const variantClasses: Record<string, string> = {
    normal:    "text-slate-700",
    deduction: "text-rose-600",
    total:     "text-slate-800 font-bold border-t border-slate-200 pt-2",
    net:       "text-[#00184d] font-extrabold text-base border-t-2 border-[#00184d]/20 pt-2 mt-1",
    employer:  "text-violet-700",
  };

  return (
    <div className={`flex items-center justify-between py-1.5 ${indent ? "pl-4" : ""}`}>
      <span className={`text-sm ${indent ? "text-slate-500" : "font-medium text-slate-600"}`}>{label}</span>
      <span className={`text-sm tabular-nums ${variantClasses[variant]}`}>
        {variant === "deduction" ? `-${value}` : value}
      </span>
    </div>
  );
}

export default function PayslipDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPayslip(id);
        setPayslip(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load payslip.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 size={28} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !payslip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle size={32} className="text-rose-400" />
        <p className="text-slate-700 font-semibold">{error ?? "Payslip not found."}</p>
        <Link href="/hr/payroll" className="text-sm text-[#00184d] underline">Back to Payroll</Link>
      </div>
    );
  }

  const emp = payslip.employee;
  const run = payslip.payrollRun;
  const periodLabel = monthLabel(payslip.month, payslip.year);
  const isFinalized = run?.status === "finalized";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/hr" className="text-xs font-semibold text-slate-400 hover:text-[#00184d] flex items-center gap-1 transition-colors">
          <ArrowLeft size={12} /> HR Dashboard
        </Link>
        <ChevronRight size={10} className="text-slate-300" />
        <Link href="/hr/payroll" className="text-xs font-semibold text-slate-400 hover:text-[#00184d] transition-colors">
          Payroll & Payslips
        </Link>
        <ChevronRight size={10} className="text-slate-300" />
        <span className="text-xs font-semibold text-[#00184d] uppercase tracking-wider">Payslip</span>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payslip — {periodLabel}</h1>
          <p className="text-slate-500 text-sm mt-1">{emp?.fullName} · {emp?.employeeCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${isFinalized ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
            {isFinalized ? <><CheckCircle2 size={12} />Finalized</> : <><Lock size={12} />Draft</>}
          </span>
          <Link
            href={`/hr/payroll/payslip/${id}/print`}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm print:hidden"
          >
            <Printer size={16} />
            Print Payslip
          </Link>
          <Link
            href={`/hr/payroll/payslip/${id}/print`}
            className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm print:hidden"
          >
            <Download size={16} />
            Download PDF
          </Link>
        </div>
      </div>

      {/* Payslip Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Top header strip */}
        <div className="bg-[#00184d] px-6 py-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Pay Slip</p>
              <h2 className="text-xl font-extrabold">{periodLabel}</h2>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs font-medium">Generated</p>
              <p className="text-sm font-semibold">{new Date(payslip.generatedAt).toLocaleDateString("en-LK")}</p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="px-6 py-5 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/40">
          <div className="flex items-start gap-2">
            <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Employee</p>
              <p className="text-sm font-bold text-slate-800">{emp?.fullName}</p>
              <p className="text-xs text-[#00184d] font-semibold font-mono">{emp?.employeeCode}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Briefcase size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Designation</p>
              <p className="text-sm font-semibold text-slate-700">{emp?.designation}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Building2 size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Department</p>
              <p className="text-sm font-semibold text-slate-700">{emp?.department}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Pay Period</p>
              <p className="text-sm font-semibold text-slate-700">{periodLabel}</p>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6 border-b border-slate-100">

          {/* Earnings */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Earnings</p>
            <div className="space-y-0.5">
              <DecimalRow label="Basic Salary" value={formatMoney(payslip.basicSalary)} />
              <DecimalRow label="Fixed Allowances" value={formatMoney(payslip.fixedAllowances)} />
              <DecimalRow label="Daily Allowance (Attendance)" value={formatMoney(payslip.dailyAllowanceTotal)} />
              {parseFloat(payslip.unpaidLeaveDeduction) > 0 && (
                <DecimalRow label="Unpaid Leave Deduction" value={formatMoney(payslip.unpaidLeaveDeduction)} variant="deduction" />
              )}
              <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between">
                <span className="text-sm font-bold text-slate-800">Gross Pay</span>
                <span className="text-sm font-extrabold text-slate-900">{formatMoney(payslip.grossPay)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Deductions</p>
            <div className="space-y-0.5">
              <DecimalRow label="EPF Employee (8% of Basic)" value={formatMoney(payslip.epfEmployeeDeduction)} variant="deduction" />
              <DecimalRow label="Other Deductions" value={formatMoney(payslip.otherDeductions)} variant={parseFloat(payslip.otherDeductions) > 0 ? "deduction" : "normal"} />
              <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between">
                <span className="text-sm font-bold text-slate-800">Total Deductions</span>
                <span className="text-sm font-bold text-rose-600">-{formatMoney(payslip.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="px-6 py-5 bg-[#00184d]/5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Net Take-Home Pay</p>
              <p className="text-xs text-slate-400 mt-0.5">After all deductions</p>
            </div>
            <p className="text-3xl font-extrabold text-[#00184d] tracking-tight">{formatMoney(payslip.netPay)}</p>
          </div>
        </div>

        {/* Employer Contributions */}
        <div className="px-6 py-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Employer Statutory Contributions <span className="text-slate-300">(Not deducted from employee)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
              <p className="text-xs text-violet-600 font-semibold">EPF Employer (12%)</p>
              <p className="text-base font-extrabold text-violet-800 mt-1">{formatMoney(payslip.epfEmployerContribution)}</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
              <p className="text-xs text-violet-600 font-semibold">ETF Employer (3%)</p>
              <p className="text-base font-extrabold text-violet-800 mt-1">{formatMoney(payslip.etfEmployerContribution)}</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
              <p className="text-xs text-violet-600 font-semibold">Total Employer Cost</p>
              <p className="text-base font-extrabold text-violet-800 mt-1">
                {formatMoney((parseFloat(payslip.epfEmployerContribution) + parseFloat(payslip.etfEmployerContribution)).toString())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/hr/payroll"
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#00184d] text-sm font-medium transition-colors print:hidden"
      >
        <ArrowLeft size={14} />
        Back to Payroll
      </Link>
    </div>
  );
}
