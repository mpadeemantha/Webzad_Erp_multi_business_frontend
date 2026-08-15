"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Wrench, Clock, CheckCircle, Car, User, ArrowRight, Eye, Edit, FileText, ChevronRight } from "lucide-react";

export default function JobsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const summaryCards = [
    { label: "Active Jobs", count: "12", sub: "Currently in station", color: "text-blue-600", bg: "bg-blue-100", icon: Car },
    { label: "In Progress", count: "5", sub: "Under service now", color: "text-amber-600", bg: "bg-amber-100", icon: Wrench },
    { label: "Completed Today", count: "4", sub: "Ready for invoicing", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle },
    { label: "Delivered", count: "8", sub: "Handed over to customer", color: "text-purple-600", bg: "bg-purple-100", icon: Clock },
  ];

  const initialJobs = [
    {
      id: "JOB-1001",
      vehicleNumber: "CAB-4921",
      vehicleInfo: "Toyota Prius (2018)",
      customerName: "John Smith",
      customerPhone: "+1 (555) 123-4567",
      dateTimeIn: "Oct 27, 2023 - 09:30 AM",
      worker: "Mike Ross (Lead Tech)",
      servicesCount: 3,
      estimatedTotal: "Rs. 14,500.00",
      status: "Completed",
    },
    {
      id: "JOB-1002",
      vehicleNumber: "K-9821",
      vehicleInfo: "Honda Civic (2020)",
      customerName: "Sarah Connor",
      customerPhone: "+1 (555) 987-6543",
      dateTimeIn: "Oct 27, 2023 - 10:15 AM",
      worker: "Alex Rivera",
      servicesCount: 2,
      estimatedTotal: "Rs. 9,500.00",
      status: "In Progress",
    },
    {
      id: "JOB-1003",
      vehicleNumber: "WP-6612",
      vehicleInfo: "Nissan Leaf (2019)",
      customerName: "Peter Gibbons",
      customerPhone: "+1 (555) 456-7890",
      dateTimeIn: "Oct 27, 2023 - 11:00 AM",
      worker: "David Miller",
      servicesCount: 4,
      estimatedTotal: "Rs. 23,000.00",
      status: "Pending",
    },
    {
      id: "JOB-1004",
      vehicleNumber: "B-1049",
      vehicleInfo: "BMW X5 (2021)",
      customerName: "Albert Wesker",
      customerPhone: "+1 (555) 222-3333",
      dateTimeIn: "Oct 26, 2023 - 02:30 PM",
      worker: "Mike Ross (Lead Tech)",
      servicesCount: 2,
      estimatedTotal: "Rs. 31,000.00",
      status: "Delivered",
    },
    {
      id: "JOB-1005",
      vehicleNumber: "CA-5531",
      vehicleInfo: "Hyundai Tucson (2022)",
      customerName: "Bruce Wayne",
      customerPhone: "+1 (555) 888-9999",
      dateTimeIn: "Oct 27, 2023 - 08:45 AM",
      worker: "Alex Rivera",
      servicesCount: 1,
      estimatedTotal: "Rs. 4,500.00",
      status: "Completed",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "In Progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Delivered":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredJobs = initialJobs.filter((job) => {
    const matchesStatus = selectedStatus === "All" || job.status === selectedStatus;
    const matchesSearch =
      job.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Car Service Job Cards</h1>
          <p className="text-slate-500 text-sm mt-1">Track vehicle check-ins, service progress, assigned staff, and billing.</p>
        </div>
        <Link
          href="/jobs/create"
          className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create New Job Card
        </Link>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{card.count}</p>
                <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
              </div>
              <div className={`p-3.5 rounded-xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Jobs Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar & Filter Bar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-200/60 rounded-xl">
            {["All", "Pending", "In Progress", "Completed", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? "bg-white text-[#00184d] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Vehicle #, Customer, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all bg-white"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Job ID</th>
                <th className="px-6 py-4 font-semibold">Vehicle Reg #</th>
                <th className="px-6 py-4 font-semibold">Customer Details</th>
                <th className="px-6 py-4 font-semibold">Check-In Date/Time</th>
                <th className="px-6 py-4 font-semibold">Assigned Worker</th>
                <th className="px-6 py-4 font-semibold text-right">Est. Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4 font-bold text-[#00184d]">
                    <Link href={`/jobs/${job.id.toLowerCase()}`} className="hover:underline flex items-center gap-1">
                      {job.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-yellow-400 font-mono font-bold text-xs rounded-lg border border-slate-700 shadow-sm">
                      <Car size={13} />
                      {job.vehicleNumber}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{job.vehicleInfo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{job.customerName}</p>
                    <p className="text-xs text-slate-500">{job.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{job.dateTimeIn}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 text-xs font-medium bg-slate-100 px-2.5 py-1 rounded-md">
                      <User size={13} className="text-slate-400" />
                      {job.worker}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-900">{job.estimatedTotal}</p>
                    <p className="text-xs text-slate-400">{job.servicesCount} Services</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Details */}
                      <Link
                        href={`/jobs/${job.id.toLowerCase()}`}
                        className="p-1.5 text-slate-500 hover:text-[#00184d] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Job Details"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/jobs/${job.id.toLowerCase()}/edit`}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Job Card"
                      >
                        <Edit size={18} />
                      </Link>

                      {/* Convert to Invoice if Completed */}
                      {job.status === "Completed" && (
                        <Link
                          href={`/invoicing/create?jobId=${job.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-all shadow-sm"
                          title="Generate Invoice"
                        >
                          <FileText size={14} />
                          Invoice
                        </Link>
                      )}
                    </div>
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
