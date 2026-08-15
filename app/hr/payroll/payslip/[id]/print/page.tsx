"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Loader2, AlertCircle } from "lucide-react";
import { getPayslip, Payslip, formatMoney, monthLabel } from "@/utils/api/payroll";

export default function PrintPayslipPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

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
        setSettingsTitle(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load payslip data.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const setSettingsTitle = (data: Payslip) => {
    setPayslip(data);
  };

  const handlePrint = () => {
    if (!payslip) return;
    const originalTitle = document.title;
    const emp = payslip.employee;
    const periodLabel = monthLabel(payslip.month, payslip.year);
    
    // Set document title so browser uses it as default PDF filename
    document.title = `${emp?.fullName || "Employee"} ${periodLabel} Payslip`;
    
    window.print();
    
    // Restore title afterwards
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <Loader2 size={32} className="animate-spin text-[#00184d]" />
      </div>
    );
  }

  if (error || !payslip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 gap-3">
        <AlertCircle size={32} className="text-rose-500" />
        <p className="text-slate-800 font-semibold">{error ?? "Payslip not found."}</p>
        <Link href={`/hr/payroll/payslip/${id}`} className="text-sm text-[#00184d] underline">
          Back to Payslip
        </Link>
      </div>
    );
  }

  const emp = payslip.employee;
  const periodLabel = monthLabel(payslip.month, payslip.year);
  
  // Calculate total gross employer cost
  const employerCost = parseFloat(payslip.epfEmployerContribution) + parseFloat(payslip.etfEmployerContribution);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Action Bar (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href={`/hr/payroll/payslip/${id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Payslip
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors font-semibold text-sm shadow-sm"
          >
            <Printer size={16} /> Print Payslip
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl transition-colors font-semibold text-sm shadow-md"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Company Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#00184d] rounded-lg flex items-center justify-center text-white font-bold text-base">W</div>
              <span className="font-bold text-lg text-[#00184d] tracking-wide">WEBZAD ERP</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Multi-Business Operations Management Spares</p>
            <p className="text-xs text-slate-400">Sri Lanka</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-[#00184d]/10 text-[#00184d] px-3 py-1 rounded-md text-xs font-bold font-mono tracking-wider uppercase mb-1">
              PAYSLIP RECORD
            </span>
            <h1 className="text-base font-bold font-mono text-slate-900">{periodLabel}</h1>
            <p className="text-xs text-slate-500">Date: {new Date(payslip.generatedAt).toLocaleDateString("en-LK")}</p>
          </div>
        </div>

        {/* Employee Info Header */}
        <div className="grid grid-cols-2 gap-4 my-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <p className="text-slate-400 font-medium">Employee Name:</p>
            <p className="font-bold text-slate-900 text-sm">{emp?.fullName}</p>
            <p className="text-slate-600 mt-0.5">NIC: {emp?.nic || "N/A"} | ID: {emp?.employeeCode}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-medium">Designation & Department:</p>
            <p className="font-bold text-slate-900 text-sm">{emp?.designation}</p>
            <p className="text-slate-600 mt-0.5">{emp?.department}</p>
          </div>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 text-xs">
          {/* Earnings */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase border-b border-slate-200 pb-2 mb-3 tracking-wider">Earnings</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Basic Salary</span>
                <span className="font-semibold text-slate-900">{formatMoney(payslip.basicSalary)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Fixed Allowances</span>
                <span className="font-semibold text-slate-900">{formatMoney(payslip.fixedAllowances)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Daily Allowance (Attendance)</span>
                <span className="font-semibold text-slate-900">{formatMoney(payslip.dailyAllowanceTotal)}</span>
              </div>
              {parseFloat(payslip.unpaidLeaveDeduction) > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-rose-600">Unpaid Leave Deduction</span>
                  <span className="font-semibold text-rose-600">-{formatMoney(payslip.unpaidLeaveDeduction)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between py-2.5 font-bold text-slate-900 border-t border-slate-200 mt-4 text-sm">
              <span>Gross Pay</span>
              <span>{formatMoney(payslip.grossPay)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase border-b border-slate-200 pb-2 mb-3 tracking-wider">Deductions</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">EPF Employee Contribution (8%)</span>
                <span className="font-semibold text-rose-600">-{formatMoney(payslip.epfEmployeeDeduction)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Other Deductions</span>
                <span className="font-semibold text-rose-600">-{formatMoney(payslip.otherDeductions)}</span>
              </div>
            </div>
            <div className="flex justify-between py-2.5 font-bold text-rose-600 border-t border-slate-200 mt-4 text-sm">
              <span>Total Deductions</span>
              <span>-{formatMoney(payslip.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Box */}
        <div className="border-2 border-slate-900 p-4 rounded-xl flex justify-between items-center my-6">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">NET TAKE-HOME SALARY:</span>
          <span className="text-2xl font-extrabold text-[#00184d]">{formatMoney(payslip.netPay)}</span>
        </div>

        {/* Employer Contributions Section */}
        <div className="my-6 border-t border-slate-200 pt-6">
          <h3 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-3">
            Employer Statutory Contributions (Not Deducted)
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-slate-500 font-medium">EPF Employer (12%)</span>
              <p className="font-bold text-slate-900 mt-1">{formatMoney(payslip.epfEmployerContribution)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-slate-500 font-medium">ETF Employer (3%)</span>
              <p className="font-bold text-slate-900 mt-1">{formatMoney(payslip.etfEmployerContribution)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-slate-500 font-medium">Total Employer Cost</span>
              <p className="font-bold text-slate-900 mt-1">{formatMoney(employerCost)}</p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-12 text-xs text-slate-600">
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="font-semibold">Employer / HR Authorized Signature</p>
          </div>
          <div className="border-t border-slate-300 pt-2 text-center">
            <p className="font-semibold">Employee Acknowledgement Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
