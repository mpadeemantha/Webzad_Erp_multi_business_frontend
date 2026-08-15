"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit3, Phone, Mail, Building2, ChevronRight, Truck } from "lucide-react";

const suppliers = [
  {
    id: "caltex-lanka",
    name: "Caltex Lubricants Lanka (Pvt) Ltd",
    contact: "Mr. Suresh Bandara",
    phone: "+94 11 234 5678",
    email: "orders@caltexlanka.lk",
    address: "No. 42, Galle Road, Colombo 03",
    category: "Oils & Lubricants",
    activeItems: 8,
    totalGRNs: 12,
    lastGRN: "Oct 27, 2023",
    totalPurchased: 4200000,
    status: "Active",
  },
  {
    id: "toyota-lanka",
    name: "Toyota Lanka Spare Parts",
    contact: "Ms. Dilani Perera",
    phone: "+94 11 456 7890",
    email: "spareparts@toyotalanka.lk",
    address: "No. 18, Nawala Road, Rajagiriya",
    category: "Brake Parts, Engine Parts",
    activeItems: 14,
    totalGRNs: 8,
    lastGRN: "Oct 26, 2023",
    totalPurchased: 2800000,
    status: "Active",
  },
  {
    id: "bosch-lanka",
    name: "Bosch Auto Parts Lanka",
    contact: "Mr. Kavindu Silva",
    phone: "+94 11 678 9012",
    email: "sales@boschlanka.lk",
    address: "No. 55, T.B. Jayah Mawatha, Colombo 10",
    category: "Electrical, Brake Fluids, Filters",
    activeItems: 10,
    totalGRNs: 6,
    lastGRN: "Oct 18, 2023",
    totalPurchased: 1500000,
    status: "Active",
  },
  {
    id: "bridgestone-lanka",
    name: "Bridgestone Lanka Tyres",
    contact: "Mr. Asanka Jayawardena",
    phone: "+94 11 890 1234",
    email: "sales@bridgestonelanka.lk",
    address: "No. 120, High Level Road, Maharagama",
    category: "Tyres",
    activeItems: 6,
    totalGRNs: 4,
    lastGRN: "Oct 22, 2023",
    totalPurchased: 2200000,
    status: "Active",
  },
  {
    id: "ngk-lanka",
    name: "NGK Spark Plugs Lanka",
    contact: "Mr. Danushka Fernando",
    phone: "+94 11 234 5670",
    email: "info@ngklanka.lk",
    address: "No. 7, Baseline Road, Colombo 09",
    category: "Engine Parts",
    activeItems: 5,
    totalGRNs: 3,
    lastGRN: "Oct 24, 2023",
    totalPurchased: 850000,
    status: "Active",
  },
  {
    id: "honda-lanka",
    name: "Honda Lanka Spare Parts",
    contact: "Ms. Nadeesha Wijesinghe",
    phone: "+94 11 345 6789",
    email: "spares@hondalanka.lk",
    address: "No. 33, Dutugemunu Street, Dehiwala",
    category: "Filters, Brake Parts",
    activeItems: 9,
    totalGRNs: 5,
    lastGRN: "Oct 15, 2023",
    totalPurchased: 1100000,
    status: "Active",
  },
];

export default function SuppliersPage() {
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supplier Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your supplier directory with contact info, linked GRNs, and purchase history.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><Building2 size={20} className="text-blue-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Active Suppliers</p>
            <p className="text-2xl font-bold text-slate-900">{suppliers.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl"><Truck size={20} className="text-green-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Total GRNs Received</p>
            <p className="text-2xl font-bold text-slate-900">{suppliers.reduce((s, r) => s + r.totalGRNs, 0)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-violet-50 rounded-xl"><Building2 size={20} className="text-violet-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Total Purchased (All Time)</p>
            <p className="text-xl font-bold text-slate-900">
              Rs. {(suppliers.reduce((s, r) => s + r.totalPurchased, 0) / 1000000).toFixed(2)}M
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by supplier name, contact, or category..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
        />
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((sup) => (
          <div key={sup.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            {/* Card Top */}
            <div className="p-5 flex items-start gap-3">
              <div className="p-3 bg-[#00184d]/5 rounded-xl shrink-0">
                <Building2 size={22} className="text-[#00184d]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{sup.name}</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-semibold rounded-full shrink-0">{sup.status}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{sup.contact}</p>
                <span className="inline-block mt-1.5 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{sup.category}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="px-5 pb-4 space-y-1.5">
              <a href={`tel:${sup.phone}`} className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#00184d] transition-colors">
                <Phone size={13} className="text-slate-400" /> {sup.phone}
              </a>
              <a href={`mailto:${sup.email}`} className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#00184d] transition-colors">
                <Mail size={13} className="text-slate-400" /> {sup.email}
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
              <div className="px-3 py-3 text-center">
                <p className="font-bold text-slate-900">{sup.activeItems}</p>
                <p className="text-[11px] text-slate-400">Items</p>
              </div>
              <div className="px-3 py-3 text-center">
                <p className="font-bold text-slate-900">{sup.totalGRNs}</p>
                <p className="text-[11px] text-slate-400">GRNs</p>
              </div>
              <div className="px-3 py-3 text-center">
                <p className="font-bold text-slate-900 text-xs">Rs. {(sup.totalPurchased/1000).toFixed(0)}K</p>
                <p className="text-[11px] text-slate-400">Purchased</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Last GRN: <strong className="text-slate-600">{sup.lastGRN}</strong></span>
              <Link href={`/stock/grn?supplier=${sup.id}`}
                className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1">
                View GRNs <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
