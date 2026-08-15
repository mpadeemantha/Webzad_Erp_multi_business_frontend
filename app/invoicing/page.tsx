import Link from "next/link";
import { Plus, Search, Filter, MoreVertical, Download, Eye, FileEdit } from "lucide-react";

export default function InvoiceDashboard() {
  const summaryCards = [
    { label: "Total Outstanding", amount: "Rs. 1,524,000.00", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Paid (This Month)", amount: "Rs. 3,215,000.00", color: "text-green-600", bg: "bg-green-100" },
    { label: "Overdue Amount", amount: "Rs. 450,000.00", color: "text-red-600", bg: "bg-red-100" }
  ];

  const invoices = [
    { id: "INV-2023-001", customer: "Acme Corp", date: "Oct 12, 2023", due: "Oct 26, 2023", amount: "Rs. 120,000.00", status: "Paid" },
    { id: "INV-2023-002", customer: "Globex Inc", date: "Oct 15, 2023", due: "Oct 29, 2023", amount: "Rs. 345,000.00", status: "Sent" },
    { id: "INV-2023-003", customer: "Initech", date: "Oct 10, 2023", due: "Oct 24, 2023", amount: "Rs. 85,000.00", status: "Overdue" },
    { id: "INV-2023-004", customer: "Umbrella Corp", date: "Oct 20, 2023", due: "Nov 03, 2023", amount: "Rs. 1,240,000.00", status: "Draft" },
    { id: "INV-2023-005", customer: "Stark Ind", date: "Oct 22, 2023", due: "Nov 05, 2023", amount: "Rs. 450,000.00", status: "Partially Paid" },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Paid": return "bg-green-100 text-green-700 border-green-200";
      case "Sent": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Overdue": return "bg-red-100 text-red-700 border-red-200";
      case "Draft": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Partially Paid": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your customer invoices.</p>
        </div>
        <Link 
          href="/invoicing/create" 
          className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create New Invoice
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.amount}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <FileEdit size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all bg-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice #</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-[#00184d]">
                    <Link href={`/invoicing/${inv.id.toLowerCase()}`} className="hover:underline">
                      {inv.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{inv.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.due}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-700">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/invoicing/${inv.id.toLowerCase()}`} className="p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-100 rounded-md transition-colors" title="View">
                        <Eye size={18} />
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="More">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
          <span>Showing 1 to 5 of 12 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-[#00184d] rounded-md bg-[#00184d] text-white">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
