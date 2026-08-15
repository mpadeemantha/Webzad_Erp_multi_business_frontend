"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, CreditCard, DollarSign, Calendar, CheckCircle2, ArrowUpRight, FileText } from "lucide-react";
import RecordPaymentModal from "@/components/RecordPaymentModal";

export default function PaymentsPage() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{ id: string; amount: number }>({
    id: "INV-2023-002",
    amount: 3450.00
  });

  const paymentStats = [
    { label: "Received This Month", amount: "Rs. 3,215,000.00", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Transactions", amount: "48 Payments", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Pending Verification", amount: "Rs. 120,000.00", icon: Calendar, color: "text-amber-600", bg: "bg-amber-100" }
  ];

  const payments = [
    { id: "PAY-9041", invoiceId: "INV-2023-001", customer: "Acme Corp", date: "Oct 26, 2023", method: "Bank Transfer", reference: "TRX-882194", amount: "Rs. 120,000.00", status: "Completed" },
    { id: "PAY-9042", invoiceId: "INV-2023-005", customer: "Stark Ind", date: "Oct 24, 2023", method: "Credit Card", reference: "CC-4821", amount: "Rs. 200,000.00", status: "Completed" },
    { id: "PAY-9043", invoiceId: "INV-2023-002", customer: "Globex Inc", date: "Oct 22, 2023", method: "Bank Transfer", reference: "TRX-773104", amount: "Rs. 345,000.00", status: "Completed" },
    { id: "PAY-9044", invoiceId: "INV-2023-006", customer: "Wayne Ent", date: "Oct 20, 2023", method: "Check", reference: "CHK-1094", amount: "Rs. 510,000.00", status: "Pending" },
    { id: "PAY-9045", invoiceId: "INV-2023-003", customer: "Initech", date: "Oct 18, 2023", method: "Cash", reference: "CSH-0042", amount: "Rs. 85,000.00", status: "Completed" },
  ];

  const handleOpenNewPayment = () => {
    setSelectedInvoice({ id: "INV-2023-002", amount: 3450.00 });
    setIsRecordModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments Received</h1>
          <p className="text-slate-500 text-sm mt-1">Track payment transactions, receipts, and record incoming customer payments.</p>
        </div>
        <button
          onClick={handleOpenNewPayment}
          className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Record New Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {paymentStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.amount}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search payments..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all bg-white"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter Methods
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Payment ID</th>
                <th className="px-6 py-4 font-semibold">Invoice #</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Payment Method</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#00184d]">{p.id}</td>
                  <td className="px-6 py-4">
                    <Link href={`/invoicing/${p.invoiceId.toLowerCase()}`} className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                      <FileText size={14} />
                      {p.invoiceId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{p.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      <CreditCard size={13} />
                      {p.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{p.reference}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{p.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      p.status === "Completed" 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>
                      <CheckCircle2 size={12} />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal Integration */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        invoiceId={selectedInvoice.id}
        totalAmount={selectedInvoice.amount}
      />
    </div>
  );
}
