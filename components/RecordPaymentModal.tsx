"use client";

import { X, Calendar, DollarSign, FileText } from "lucide-react";
import { useState } from "react";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  totalAmount: number;
}

export default function RecordPaymentModal({ isOpen, onClose, invoiceId, totalAmount }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState(totalAmount.toString());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-sm font-medium flex justify-between items-center">
            <span>Invoice {invoiceId}</span>
            <span>Total Due: Rs. {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount Received</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] font-semibold text-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] text-slate-900 appearance-none">
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Cash</option>
              <option>Check</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Note (Optional)</label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
              <textarea 
                rows={2}
                placeholder="Transaction ID, check number, etc."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] resize-none text-sm text-slate-900"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Mock save action
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#00184d] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
}
