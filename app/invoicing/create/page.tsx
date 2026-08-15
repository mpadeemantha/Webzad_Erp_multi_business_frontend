"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Send, Plus, Trash2, Calendar, FileText, CheckCircle2, Car } from "lucide-react";

function CreateInvoiceForm() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");

  const [customer, setCustomer] = useState(jobIdParam ? "1" : "");
  const [notes, setNotes] = useState(
    jobIdParam ? `Invoice generated from Job Card #${jobIdParam} for Vehicle CAB-4921 (Toyota Prius).` : ""
  );

  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, price: 0, tax: 0, discount: 0 }
  ]);

  useEffect(() => {
    if (jobIdParam) {
      setItems([
        { id: 1, description: "Full Engine Oil Change (Synthetic 5W-30)", quantity: 1, price: 65, tax: 0, discount: 0 },
        { id: 2, description: "Brake Pad Inspection & Front Pad Replacement", quantity: 1, price: 85, tax: 0, discount: 0 },
        { id: 3, description: "Full Exterior Wash & Vacuum Detail", quantity: 1, price: 25, tax: 0, discount: 0 }
      ]);
    }
  }, [jobIdParam]);

  const addRow = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0, tax: 0, discount: 0 }]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalTax = items.reduce((sum, item) => sum + ((item.quantity * item.price) * (item.tax / 100)), 0);
  const totalDiscount = items.reduce((sum, item) => sum + ((item.quantity * item.price) * (item.discount / 100)), 0);
  const grandTotal = subtotal + totalTax - totalDiscount;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/invoicing" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Invoice</h1>
            <p className="text-slate-500 text-sm">
              {jobIdParam ? `Generating invoice from Job Card #${jobIdParam}` : "Draft a new invoice to send to a customer."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Save size={18} />
            Save as Draft
          </button>
          <button className="px-4 py-2 bg-[#00184d] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2">
            <Send size={18} />
            Send Invoice
          </button>
        </div>
      </div>

      {/* Linked Job Card Callout Banner */}
      {jobIdParam && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <CheckCircle2 size={24} className="text-blue-600 shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-bold text-blue-950 flex items-center gap-2">
              <span>Auto-populated from Job Card #{jobIdParam}</span>
              <span className="px-2 py-0.5 bg-slate-900 text-yellow-400 font-mono text-xs rounded border border-slate-700">CAB-4921</span>
            </p>
            <p className="text-xs text-blue-700 mt-0.5">Customer details and completed service line items have been loaded automatically.</p>
          </div>
          <Link href={`/jobs/${jobIdParam.toLowerCase()}`} className="text-xs font-semibold text-blue-700 hover:underline">
            View Job Card
          </Link>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Top Section: Details */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <div className="relative">
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] appearance-none"
                >
                  <option value="" disabled>Select a customer...</option>
                  <option value="1">John Smith (Acme Corp / CAB-4921)</option>
                  <option value="2">Sarah Connor (Globex Inc / K-9821)</option>
                  <option value="3">Peter Gibbons (Initech / WP-6612)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" defaultValue={new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:pl-8 md:border-l border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number</label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" defaultValue="INV-2023-006" className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
              <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]">
                <option value="LKR">LKR - Sri Lankan Rupee (Rs.)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Middle Section: Line Items */}
        <div className="p-6 md:p-8 overflow-x-auto">
          <table className="w-full text-left text-sm mb-4 min-w-[800px]">
            <thead className="text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="pb-3 pr-4 w-2/5">Item Description</th>
                <th className="pb-3 px-4 w-24">Qty</th>
                <th className="pb-3 px-4 w-32">Price</th>
                <th className="pb-3 px-4 w-24">Tax (%)</th>
                <th className="pb-3 px-4 w-24">Disc (%)</th>
                <th className="pb-3 px-4 text-right w-32">Amount</th>
                <th className="pb-3 pl-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4 pr-4">
                    <input 
                      type="text" 
                      placeholder="Enter description..." 
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#00184d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 transition-all font-medium text-slate-900"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#00184d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 transition-all"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#00184d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 transition-all font-semibold"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input 
                      type="number" 
                      min="0" max="100"
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#00184d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 transition-all"
                      value={item.tax}
                      onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input 
                      type="number" 
                      min="0" max="100"
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#00184d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 transition-all"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">
                    Rs. {((item.quantity * item.price) * (1 + item.tax/100) * (1 - item.discount/100)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button 
                      onClick={() => removeRow(item.id)}
                      disabled={items.length === 1}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            onClick={addRow}
            className="flex items-center gap-2 text-sm font-medium text-[#00184d] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Line Item
          </button>
        </div>

        {/* Bottom Section: Summary & Notes */}
        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Payment Terms</label>
              <textarea 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter payment terms, thank you note, etc."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] resize-none"
              ></textarea>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax</span>
              <span className="font-medium">Rs. {totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Discount</span>
              <span className="font-medium text-green-600">-Rs. {totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-base font-semibold text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-[#00184d]">Rs. {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CreateInvoice() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading invoice form...</div>}>
      <CreateInvoiceForm />
    </Suspense>
  );
}
