"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, FileCheck, AlertTriangle, Truck, Eye, Calendar, Building2, FileText, CheckCircle2, Clock } from "lucide-react";

export default function GRNHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const grnStats = [
    { label: "Total GRNs", count: "24", sub: "All time received", color: "text-blue-600", bg: "bg-blue-100", icon: Truck },
    { label: "Stock Updated (Confirmed)", count: "18", sub: "Added to warehouse", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
    { label: "Discrepancies Flagged", count: "3", sub: "Shortage or damage", color: "text-amber-600", bg: "bg-amber-100", icon: AlertTriangle },
    { label: "Pending Confirmation", count: "3", sub: "Draft state", color: "text-purple-600", bg: "bg-purple-100", icon: Clock },
  ];

  const grnRecords = [
    {
      id: "GRN-2023-001",
      date: "Oct 27, 2023",
      supplier: "Caltex Lubricants Lanka",
      deliveryNote: "DN-88491",
      poNumber: "PO-2023-088",
      totalReceived: 120,
      damagedCount: 2,
      acceptedCount: 118,
      totalValue: "Rs. 780,000.00",
      status: "Discrepancy Flagged",
      discrepancyType: "2 Damaged / Shortage",
    },
    {
      id: "GRN-2023-002",
      date: "Oct 26, 2023",
      supplier: "Toyota Lanka Spare Parts",
      deliveryNote: "INV-99201",
      poNumber: "PO-2023-084",
      totalReceived: 50,
      damagedCount: 0,
      acceptedCount: 50,
      totalValue: "Rs. 425,000.00",
      status: "Confirmed",
      discrepancyType: "Matched PO Perfectly",
    },
    {
      id: "GRN-2023-003",
      date: "Oct 24, 2023",
      supplier: "Bosch Auto Lanka",
      deliveryNote: "DN-10293",
      poNumber: "Direct Entry",
      totalReceived: 35,
      damagedCount: 0,
      acceptedCount: 35,
      totalValue: "Rs. 185,000.00",
      status: "Confirmed",
      discrepancyType: "Direct Receipt",
    },
    {
      id: "GRN-2023-004",
      date: "Oct 22, 2023",
      supplier: "Bridgestone Lanka Tyres",
      deliveryNote: "DN-77401",
      poNumber: "PO-2023-079",
      totalReceived: 20,
      damagedCount: 1,
      acceptedCount: 19,
      totalValue: "Rs. 560,000.00",
      status: "Discrepancy Flagged",
      discrepancyType: "1 Unit Shortage",
    },
    {
      id: "GRN-2023-005",
      date: "Oct 20, 2023",
      supplier: "Honda Lanka Spares",
      deliveryNote: "INV-44102",
      poNumber: "PO-2023-075",
      totalReceived: 40,
      damagedCount: 0,
      acceptedCount: 40,
      totalValue: "Rs. 100,000.00",
      status: "Draft",
      discrepancyType: "Pending Review",
    },
  ];

  const suppliersList = ["All", "Caltex Lubricants Lanka", "Toyota Lanka Spare Parts", "Bosch Auto Lanka", "Bridgestone Lanka Tyres", "Honda Lanka Spares"];

  const filteredGRNs = grnRecords.filter((grn) => {
    const matchesSupplier = selectedSupplier === "All" || grn.supplier === selectedSupplier;
    const matchesStatus = selectedStatus === "All" || grn.status === selectedStatus;
    const matchesSearch =
      grn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.deliveryNote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSupplier && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Goods Received Notes (GRN)</h1>
          <p className="text-slate-500 text-sm mt-1">Record incoming supplier stock, match PO items, track damaged goods, and update inventory.</p>
        </div>
        <Link
          href="/stock/grn/create"
          className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          Create New GRN
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {grnStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.count}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
              <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search GRN #, Supplier, PO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all bg-white"
              />
            </div>

            {/* Supplier Filter Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] text-slate-700 font-medium"
              >
                {suppliersList.map((sup, idx) => (
                  <option key={idx} value={sup}>{sup === "All" ? "All Suppliers" : sup}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-200/60 rounded-xl">
            {["All", "Confirmed", "Discrepancy Flagged", "Draft"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === st
                    ? "bg-white text-[#00184d] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">GRN Number</th>
                <th className="px-6 py-4 font-semibold">Date Received</th>
                <th className="px-6 py-4 font-semibold">Supplier & DN Ref</th>
                <th className="px-6 py-4 font-semibold">Linked PO #</th>
                <th className="px-6 py-4 font-semibold text-center">Quantities (Rec / Dam / Acc)</th>
                <th className="px-6 py-4 font-semibold text-right">Total Value</th>
                <th className="px-6 py-4 font-semibold">Status & Discrepancy</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGRNs.map((grn) => (
                <tr key={grn.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#00184d]">
                    <Link href={`/stock/grn/${grn.id.toLowerCase()}`} className="hover:underline flex items-center gap-1">
                      {grn.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{grn.date}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{grn.supplier}</p>
                    <p className="text-xs text-slate-400 font-mono">DN: {grn.deliveryNote}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                      grn.poNumber === "Direct Entry" ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-800"
                    }`}>
                      {grn.poNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-slate-900">{grn.acceptedCount} Acc</span>
                    {grn.damagedCount > 0 && (
                      <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {grn.damagedCount} Damaged
                      </span>
                    )}
                    <span className="text-xs text-slate-400 block mt-0.5">Total Rec: {grn.totalReceived}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{grn.totalValue}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        grn.status === "Confirmed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : grn.status === "Discrepancy Flagged"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {grn.status}
                      </span>
                      {grn.damagedCount > 0 && (
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <AlertTriangle size={11} />
                          {grn.discrepancyType}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/stock/grn/${grn.id.toLowerCase()}`}
                      className="p-1.5 text-slate-500 hover:text-[#00184d] hover:bg-slate-100 rounded-lg transition-colors inline-block"
                      title="View GRN Details"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
