"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Car, User, Wrench, CheckCircle, Clock, FileText, Printer, Edit, Phone, Calendar, ArrowRight, AlertCircle, Check } from "lucide-react";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id.toUpperCase();

  const [currentStatus, setCurrentStatus] = useState<"Pending" | "In Progress" | "Completed" | "Delivered">("Completed");

  const jobDetails = {
    id: jobId,
    vehicleNumber: "CAB-4921",
    vehicleInfo: "Toyota Prius (2018 - Hybrid Silver)",
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    customerEmail: "john.smith@example.com",
    dateTimeIn: "Oct 27, 2023 - 09:30 AM",
    worker: "Mike Ross (Lead Tech)",
    notes: "Customer reported slight squeaking noise from front brake pads during heavy braking. Checked fluid levels and requested full synthetic oil change.",
    services: [
      { id: 1, name: "Full Engine Oil Change (Synthetic 5W-30)", price: 6500.00 },
      { id: 2, name: "Brake Pad Inspection & Front Pad Replacement", price: 8500.00 },
      { id: 3, name: "Full Exterior Wash & Vacuum Detail", price: 2500.00 },
    ],
  };

  const statuses = ["Pending", "In Progress", "Completed", "Delivered"] as const;

  const totalCost = jobDetails.services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{jobDetails.id}</h1>
              <div className="px-3 py-1 bg-slate-900 text-yellow-400 font-mono font-bold text-xs rounded-lg border border-slate-700 shadow-sm flex items-center gap-1.5">
                <Car size={14} />
                {jobDetails.vehicleNumber}
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{jobDetails.vehicleInfo}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} />
            Print Job Card
          </button>

          <Link
            href={`/jobs/${resolvedParams.id}/edit`}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>

          {/* Primary Invoice Conversion Button */}
          {currentStatus === "Completed" && (
            <Link
              href={`/invoicing/create?jobId=${jobDetails.id}`}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 animate-pulse"
            >
              <FileText size={18} />
              Convert to Invoice
            </Link>
          )}
        </div>
      </div>

      {/* Interactive Status Step Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Progress Status</span>
          <span className="text-xs text-slate-500">Click a step to update status</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {statuses.map((s, index) => {
            const isCurrent = currentStatus === s;
            const currentIndex = statuses.indexOf(currentStatus);
            const isPassed = index <= currentIndex;

            return (
              <button
                key={s}
                onClick={() => setCurrentStatus(s)}
                className={`
                  p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-20
                  ${isCurrent
                    ? "bg-[#00184d] text-white border-[#00184d] shadow-md ring-2 ring-[#00184d]/30"
                    : isPassed
                    ? "bg-blue-50 text-blue-900 border-blue-200"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold font-mono">STEP 0{index + 1}</span>
                  {isPassed && <Check size={16} className={isCurrent ? "text-white" : "text-blue-600"} />}
                </div>
                <span className="font-bold text-sm">{s}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoice Conversion Banner */}
      {currentStatus === "Completed" && (
        <div className="bg-gradient-to-r from-green-900 to-[#00184d] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-green-300 shrink-0">
              <CheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Service Completed & Ready for Invoicing</h3>
              <p className="text-sm text-green-100 mt-0.5">
                All assigned services have been performed by {jobDetails.worker}. Generate an official customer invoice with one click.
              </p>
            </div>
          </div>
          <Link
            href={`/invoicing/create?jobId=${jobDetails.id}`}
            className="px-5 py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <FileText size={18} />
            Generate Invoice Now
          </Link>
        </div>
      )}

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Vehicle Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User size={18} className="text-[#00184d]" />
            Customer & Contact
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Customer Name</span>
              <span className="font-semibold text-slate-800 text-base">{jobDetails.customerName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Phone Number</span>
              <span className="font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Phone size={14} className="text-slate-400" />
                {jobDetails.customerPhone}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Email Address</span>
              <span className="text-slate-600">{jobDetails.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Vehicle & Check-In */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Car size={18} className="text-[#00184d]" />
            Vehicle Details
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Registration Plate</span>
              <span className="font-mono font-bold text-slate-900 text-lg">{jobDetails.vehicleNumber}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Make / Model</span>
              <span className="font-medium text-slate-700">{jobDetails.vehicleInfo}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Check-In Date & Time</span>
              <span className="font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Calendar size={14} className="text-slate-400" />
                {jobDetails.dateTimeIn}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Technician */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Wrench size={18} className="text-[#00184d]" />
            Assigned Technician
          </h2>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-400 block">Lead Worker</span>
              <span className="font-bold text-[#00184d] text-base">{jobDetails.worker}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block">Diagnostic Notes</span>
              <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 mt-1">
                "{jobDetails.notes}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Line Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-3">
          <span>Services Performed</span>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {jobDetails.services.length} Line Items
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold w-12">#</th>
                <th className="px-4 py-3 font-semibold">Service Description</th>
                <th className="px-4 py-3 font-semibold text-right w-36">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobDetails.services.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">Rs. {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/60 p-4 rounded-xl">
          <span className="text-sm font-semibold text-slate-700">Total Job Service Cost</span>
          <span className="text-2xl font-bold text-[#00184d]">Rs. {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
