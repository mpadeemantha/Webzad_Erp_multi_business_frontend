"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, FileText, ShoppingCart, Truck, Eye, CheckCircle2, Clock, AlertTriangle, Printer } from "lucide-react";

export default function PurchaseOrderListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const poStats = [
    { label: "Total POs Issued", count: "14 POs", sub: "All time", color: "text-blue-600", bg: "bg-blue-100", icon: ShoppingCart },
    { label: "Sent to Suppliers", count: "6 POs", sub: "Awaiting delivery", color: "text-purple-600", bg: "bg-purple-100", icon: FileText },
    { label: "Partially Received", count: "2 POs", sub: "Stock arriving in batches", color: "text-amber-600", bg: "bg-amber-100", icon: Clock },
    { label: "Fully Received", count: "5 POs", sub: "Stock confirmed via GRN", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
  ];

  const purchaseOrders = [
    {
      id: "PO-2023-088",
      supplier: "Caltex Lubricants Lanka (Pvt) Ltd",
      orderDate: "Oct 24, 2023",
      expectedDate: "Oct 28, 2023",
      location: "Main Workshop Bay",
      itemsCount: 2,
      orderedQty: 120,
      receivedQty: 98,
      totalAmount: "Rs. 780,000.00",
      status: "Partially Received",
    },
    {
      id: "PO-2023-089",
      supplier: "Toyota Lanka Spare Parts",
      orderDate: "Oct 26, 2023",
      expectedDate: "Oct 30, 2023",
      location: "Parts Storeroom A",
      itemsCount: 3,
      orderedQty: 50,
      receivedQty: 0,
      totalAmount: "Rs. 425,000.00",
      status: "Sent",
    },
    {
      id: "PO-2023-084",
      supplier: "Toyota Lanka Spare Parts",
      orderDate: "Oct 20, 2023",
      expectedDate: "Oct 25, 2023",
      location: "Parts Storeroom A",
      itemsCount: 2,
      orderedQty: 50,
      receivedQty: 50,
      totalAmount: "Rs. 425,000.00",
      status: "Received",
    },
    {
      id: "PO-2023-079",
      supplier: "Bridgestone Lanka Tyres",
      orderDate: "Oct 18, 2023",
      expectedDate: "Oct 22, 2023",
      location: "Tyre Bay",
      itemsCount: 1,
      orderedQty: 20,
      receivedQty: 19,
      totalAmount: "Rs. 560,000.00",
      status: "Partially Received",
    },
    {
      id: "PO-2023-090",
      supplier: "Bosch Auto Lanka",
      orderDate: "Oct 27, 2023",
      expectedDate: "Nov 02, 2023",
      location: "Main Workshop Bay",
      itemsCount: 4,
      orderedQty: 40,
      receivedQty: 0,
      totalAmount: "Rs. 210,000.00",
      status: "Draft",
    },
  ];

  const suppliersList = ["All", "Caltex Lubricants Lanka (Pvt) Ltd", "Toyota Lanka Spare Parts", "Bridgestone Lanka Tyres", "Bosch Auto Lanka"];

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSupplier = selectedSupplier === "All" || po.supplier === selectedSupplier;
    const matchesStatus = selectedStatus === "All" || po.status === selectedStatus;
    const matchesSearch =
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSupplier && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Received": return "bg-green-100 text-green-700 border-green-200";
      case "Partially Received": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Sent": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Orders (PO)</h1>
          <p className="text-slate-500 text-sm mt-1">Issue official purchase orders to stock suppliers, track fulfillment, and generate GRNs.</p>
        </div>
        <Link
          href="/stock/po/create"
          className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          Create New PO
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {poStats.map((stat, i) => {
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

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PO #, Supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all bg-white"
              />
            </div>

            {/* Supplier Filter */}
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
            {["All", "Sent", "Partially Received", "Received", "Draft"].map((st) => (
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

        {/* PO Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">PO Number</th>
                <th className="px-6 py-4 font-semibold">Supplier Name</th>
                <th className="px-6 py-4 font-semibold">Dates (Ordered ➔ Expected)</th>
                <th className="px-6 py-4 font-semibold">Delivery Location</th>
                <th className="px-6 py-4 font-semibold text-center">Fulfillment Progress</th>
                <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPOs.map((po) => {
                const percentReceived = Math.round((po.receivedQty / po.orderedQty) * 100);

                return (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#00184d]">
                      <Link href={`/stock/po/${po.id.toLowerCase()}`} className="hover:underline flex items-center gap-1">
                        {po.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{po.supplier}</p>
                      <p className="text-xs text-slate-400">{po.itemsCount} Line Items</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{po.orderDate}</p>
                      <p className="text-slate-400">Exp: {po.expectedDate}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{po.location}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-36 mx-auto space-y-1">
                        <div className="flex justify-between text-[11px] font-medium text-slate-600">
                          <span>{po.receivedQty} / {po.orderedQty} Units</span>
                          <span className="font-bold">{percentReceived}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percentReceived === 100 ? "bg-green-500" : percentReceived > 0 ? "bg-amber-500" : "bg-blue-400"
                            }`}
                            style={{ width: `${percentReceived}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{po.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/stock/po/${po.id.toLowerCase()}`}
                          className="p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View PO Details"
                        >
                          <Eye size={18} />
                        </Link>
                        {po.status !== "Received" && (
                          <Link
                            href={`/stock/grn/create?poId=${po.id}`}
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Create GRN from this PO"
                          >
                            <Truck size={18} />
                          </Link>
                        )}
                        <Link
                          href={`/stock/po/${po.id.toLowerCase()}/print`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Print PO Document"
                        >
                          <Printer size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
