"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

export default function InvoicePrintView({ params }: { params: { id: string } }) {
  const invoiceId = params.id.toUpperCase();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Optionally trigger print automatically when the page loads
    // setTimeout(() => window.print(), 500);
  }, []);

  return (
    <div className="bg-white min-h-screen relative text-slate-900 font-sans">
      
      {/* Non-printable back button / instructions */}
      <div className="print:hidden absolute top-4 left-4 flex gap-4">
        <Link href={`/invoicing/${params.id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
          <ArrowLeft size={16} /> Back to Preview
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-[#00184d] hover:bg-blue-900 text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          Print Now
        </button>
      </div>

      {/* A4 Document Container */}
      <div className="max-w-[210mm] mx-auto bg-white p-8 md:p-[20mm] print:p-0 print:m-0 print:shadow-none shadow-lg my-12 print:my-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#00184d] pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#00184d] mb-4">
              <Building2 size={40} />
              <span className="text-3xl font-bold tracking-tight">ERP SYS</span>
            </div>
            <p className="text-slate-600">123 Business Road</p>
            <p className="text-slate-600">Tech City, TC 10101</p>
            <p className="text-slate-600">hello@erpsys.com</p>
            <p className="text-slate-600">+1 (555) 123-4567</p>
          </div>
          <div className="text-right">
            <h1 className="text-5xl font-bold text-[#00184d] uppercase tracking-wider mb-4">Invoice</h1>
            <table className="ml-auto text-sm text-slate-600">
              <tbody>
                <tr>
                  <td className="pr-4 font-bold text-slate-800 text-right">Invoice #:</td>
                  <td className="text-right">{invoiceId}</td>
                </tr>
                <tr>
                  <td className="pr-4 font-bold text-slate-800 text-right">Date:</td>
                  <td className="text-right">Oct 15, 2023</td>
                </tr>
                <tr>
                  <td className="pr-4 font-bold text-slate-800 text-right">Due Date:</td>
                  <td className="text-right">Oct 29, 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-[#00184d] uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 inline-block">Bill To</h2>
          <h3 className="text-xl font-bold text-slate-900 mt-2">Globex Inc</h3>
          <p className="text-slate-600 mt-1">456 Corporate Blvd</p>
          <p className="text-slate-600">Metropolis, NY 10001</p>
          <p className="text-slate-600">billing@globex.com</p>
        </div>

        {/* Items Table */}
        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2 border-slate-300">
              <th className="py-3 font-bold text-slate-800 w-1/2">Description</th>
              <th className="py-3 font-bold text-slate-800 text-center">Qty</th>
              <th className="py-3 font-bold text-slate-800 text-right">Unit Price</th>
              <th className="py-3 font-bold text-slate-800 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-4 pr-4">
                <p className="font-bold text-slate-900">Enterprise License</p>
                <p className="text-sm text-slate-500">Annual subscription for 50 users</p>
              </td>
              <td className="py-4 text-center">1</td>
              <td className="py-4 text-right">Rs. 250,000.00</td>
              <td className="py-4 text-right font-medium">Rs. 250,000.00</td>
            </tr>
            <tr>
              <td className="py-4 pr-4">
                <p className="font-bold text-slate-900">Setup & Integration</p>
                <p className="text-sm text-slate-500">One-time fee</p>
              </td>
              <td className="py-4 text-center">1</td>
              <td className="py-4 text-right">Rs. 75,000.00</td>
              <td className="py-4 text-right font-medium">Rs. 75,000.00</td>
            </tr>
            <tr>
              <td className="py-4 pr-4">
                <p className="font-bold text-slate-900">Training Session</p>
                <p className="text-sm text-slate-500">2 hours remote training</p>
              </td>
              <td className="py-4 text-center">2</td>
              <td className="py-4 text-right">Rs. 10,000.00</td>
              <td className="py-4 text-right font-medium">Rs. 20,000.00</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <table className="w-72 text-right">
            <tbody>
              <tr>
                <td className="py-2 text-slate-600">Subtotal:</td>
                <td className="py-2 font-medium">Rs. 345,000.00</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-600 border-b border-slate-200">Tax (0%):</td>
                <td className="py-2 font-medium border-b border-slate-200">Rs. 0.00</td>
              </tr>
              <tr>
                <td className="py-4 text-lg font-bold text-slate-900">Total Due:</td>
                <td className="py-4 text-2xl font-bold text-[#00184d]">Rs. 345,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer / Terms */}
        <div className="pt-8 border-t-2 border-slate-200 text-sm">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Payment Terms</h4>
              <p className="text-slate-600">Please remit payment within 14 days of receiving this invoice. Late payments may be subject to a 1.5% monthly fee.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Bank Details</h4>
              <p className="text-slate-600">
                Bank: Tech National Bank<br/>
                Account Name: ERP SYS LLC<br/>
                Account Number: 1234567890<br/>
                Routing: 098765432
              </p>
            </div>
          </div>
          <div className="mt-12 text-center text-slate-400 font-medium">
            Thank you for your business!
          </div>
        </div>

      </div>
    </div>
  );
}
