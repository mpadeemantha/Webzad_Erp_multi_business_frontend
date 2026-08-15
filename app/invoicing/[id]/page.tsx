"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Printer, Download, Mail, Edit, CreditCard, Building2 } from "lucide-react";
import RecordPaymentModal from "../../../components/RecordPaymentModal";

export default function InvoicePreview({ params }: { params: { id: string } }) {
  const invoiceId = params.id.toUpperCase();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/invoicing" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice {invoiceId}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                Sent
              </span>
              <span className="text-slate-500 text-sm">Issued Oct 15, 2023</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Edit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <Link href={`/invoicing/${params.id}/print`} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </Link>
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Mail size={16} />
            <span className="hidden sm:inline">Email</span>
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-4 py-2 bg-[#00184d] text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2 ml-2"
          >
            <CreditCard size={16} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Invoice Document Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Invoice Header */}
        <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 text-[#00184d] mb-4">
              <Building2 size={32} />
              <span className="text-2xl font-bold tracking-tight">ERP SYS</span>
            </div>
            <p className="text-slate-500 text-sm">123 Business Road</p>
            <p className="text-slate-500 text-sm">Tech City, TC 10101</p>
            <p className="text-slate-500 text-sm">hello@erpsys.com</p>
            <p className="text-slate-500 text-sm">+1 (555) 123-4567</p>
          </div>
          
          <div className="text-left md:text-right">
            <h2 className="text-4xl font-bold text-slate-200 uppercase tracking-widest mb-4">Invoice</h2>
            <p className="text-slate-900 font-medium">Invoice Number: <span className="text-slate-600 font-normal">{invoiceId}</span></p>
            <p className="text-slate-900 font-medium mt-1">Date of Issue: <span className="text-slate-600 font-normal">Oct 15, 2023</span></p>
            <p className="text-slate-900 font-medium mt-1">Due Date: <span className="text-slate-600 font-normal">Oct 29, 2023</span></p>
          </div>
        </div>

        {/* Bill To */}
        <div className="px-8 py-6 md:px-12 bg-slate-50/50 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
          <h3 className="text-lg font-bold text-slate-900">Globex Inc</h3>
          <p className="text-slate-600 text-sm mt-1">456 Corporate Blvd</p>
          <p className="text-slate-600 text-sm">Metropolis, NY 10001</p>
          <p className="text-slate-600 text-sm mt-1">billing@globex.com</p>
        </div>

        {/* Line Items */}
        <div className="p-8 md:p-12 overflow-x-auto">
          <table className="w-full text-left text-sm mb-4">
            <thead className="text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 px-4 text-center">Qty</th>
                <th className="pb-3 px-4 text-right">Unit Price</th>
                <th className="pb-3 pl-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4">
                  <p className="font-medium text-slate-900">Enterprise License</p>
                  <p className="text-xs text-slate-500 mt-1">Annual subscription for 50 users</p>
                </td>
                <td className="py-4 px-4 text-center">1</td>
                <td className="py-4 px-4 text-right">Rs. 250,000.00</td>
                <td className="py-4 pl-4 text-right font-medium">Rs. 250,000.00</td>
              </tr>
              <tr>
                <td className="py-4 pr-4">
                  <p className="font-medium text-slate-900">Setup & Integration</p>
                  <p className="text-xs text-slate-500 mt-1">One-time fee</p>
                </td>
                <td className="py-4 px-4 text-center">1</td>
                <td className="py-4 px-4 text-right">Rs. 75,000.00</td>
                <td className="py-4 pl-4 text-right font-medium">Rs. 75,000.00</td>
              </tr>
              <tr>
                <td className="py-4 pr-4">
                  <p className="font-medium text-slate-900">Training Session</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours remote training</p>
                </td>
                <td className="py-4 px-4 text-center">2</td>
                <td className="py-4 px-4 text-right">Rs. 10,000.00</td>
                <td className="py-4 pl-4 text-right font-medium">Rs. 20,000.00</td>
              </tr>
            </tbody>
          </table>
          
          <div className="flex justify-end mt-8">
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">Rs. 345,000.00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax (0%)</span>
                <span className="font-medium text-slate-900">Rs. 0.00</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-bold text-[#00184d]">Rs. 345,000.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Notes */}
        <div className="p-8 md:p-12 border-t border-slate-100 bg-slate-50/30">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Payment Terms</h4>
          <p className="text-sm text-slate-600 mb-4">Please remit payment within 14 days of receiving this invoice. Late payments may be subject to a 1.5% monthly fee.</p>
          
          <h4 className="text-sm font-bold text-slate-900 mb-2">Bank Details</h4>
          <p className="text-sm text-slate-600">Bank: Tech National Bank<br/>Account Name: ERP SYS LLC<br/>Account Number: 1234567890<br/>Routing: 098765432</p>
        </div>

      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        invoiceId={invoiceId}
        totalAmount={3450.00}
      />
    </div>
  );
}
