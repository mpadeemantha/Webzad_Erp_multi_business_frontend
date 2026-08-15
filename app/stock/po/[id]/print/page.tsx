"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintPOPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const poId = resolvedParams.id.toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const po = {
    id: poId,
    date: "Oct 24, 2023",
    expectedDate: "Oct 28, 2023",
    supplierName: "Caltex Lubricants Lanka (Pvt) Ltd",
    supplierAddress: "No. 42, Galle Road, Colombo 03, Sri Lanka",
    supplierPhone: "+94 11 234 5678",
    deliveryLocation: "Main Workshop Bay (Section A)",
    deliveryAddress: "No. 150, Kandy Road, Kiribathgoda, Sri Lanka",
    paymentTerms: "Net 30 Days after receipt of goods and confirmed GRN.",
    items: [
      { sku: "OIL-MOB-5W30", description: "Mobil 1 Synthetic Engine Oil 5W-30 (4L Can)", qty: 100, unitPrice: 6500 },
      { sku: "FLD-DOT4-500", description: "Bosch DOT4 Brake Fluid 500ml", qty: 20, unitPrice: 1800 },
    ],
  };

  const subtotal = po.items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href={`/stock/po/${resolvedParams.id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to PO Details
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl transition-colors font-semibold text-sm shadow-md"
        >
          <Printer size={16} /> Print Purchase Order
        </button>
      </div>

      {/* Printable PO Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00184d] rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="font-bold text-xl text-[#00184d] tracking-wide">AUTO SERVICE ERP</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Central Vehicle Service Station & Spares</p>
            <p className="text-xs text-slate-400 mt-0.5">No. 150, Kandy Road, Kiribathgoda, Sri Lanka</p>
            <p className="text-xs text-slate-400">Tel: +94 11 998 8776 | Email: purchasing@autoservice.lk</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-[#00184d]/10 text-[#00184d] px-3 py-1 rounded-md text-xs font-bold font-mono tracking-wider uppercase mb-2">
              PURCHASE ORDER
            </span>
            <h1 className="text-2xl font-bold font-mono text-slate-900">{po.id}</h1>
            <p className="text-xs text-slate-500 mt-1">Order Date: <strong className="text-slate-800">{po.date}</strong></p>
            <p className="text-xs text-slate-500">Exp Delivery: <strong className="text-slate-800">{po.expectedDate}</strong></p>
          </div>
        </div>

        {/* Supplier & Delivery Info Grid */}
        <div className="grid grid-cols-2 gap-8 my-8 text-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vendor / Supplier:</h3>
            <p className="font-bold text-slate-900 text-base">{po.supplierName}</p>
            <p className="text-slate-600 text-xs mt-1">{po.supplierAddress}</p>
            <p className="text-slate-600 text-xs mt-0.5">Tel: {po.supplierPhone}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ship To / Warehouse:</h3>
            <p className="font-bold text-slate-900 text-base">{po.deliveryLocation}</p>
            <p className="text-slate-600 text-xs mt-1">{po.deliveryAddress}</p>
            <p className="text-slate-600 text-xs mt-0.5">Attn: Warehouse Supervisor (Receiving Bay)</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-left text-sm mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-600 font-bold text-xs uppercase">
              <th className="py-3 pr-4">SKU</th>
              <th className="py-3 px-4">Item Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 pl-4 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {po.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 pr-4 font-mono font-bold text-xs text-[#00184d]">{item.sku}</td>
                <td className="py-4 px-4 font-medium text-slate-800">{item.description}</td>
                <td className="py-4 px-4 text-center font-bold text-slate-900">{item.qty}</td>
                <td className="py-4 px-4 text-right text-slate-700">Rs. {item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="py-4 pl-4 text-right font-bold text-slate-900">
                  Rs. {(item.qty * item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <table className="w-72 text-right">
            <tbody>
              <tr>
                <td className="py-2 text-slate-600">Subtotal:</td>
                <td className="py-2 font-medium">Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-600 border-b border-slate-200">Tax (0%):</td>
                <td className="py-2 font-medium border-b border-slate-200">Rs. 0.00</td>
              </tr>
              <tr>
                <td className="py-4 text-lg font-bold text-slate-900">Total Order Amount:</td>
                <td className="py-4 text-2xl font-bold text-[#00184d]">Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms & Authorization Signatures */}
        <div className="border-t-2 border-slate-200 pt-6 text-xs text-slate-600 space-y-6">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Terms & Instructions:</h4>
            <p className="italic">{po.paymentTerms}</p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8">
            <div className="border-t border-slate-300 pt-2 text-center">
              <p className="font-semibold text-slate-800">Authorized Purchasing Manager Signature</p>
            </div>
            <div className="border-t border-slate-300 pt-2 text-center">
              <p className="font-semibold text-slate-800">Supplier Acceptance Signature & Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
