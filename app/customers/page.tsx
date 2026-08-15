import Link from "next/link";
import { Plus, Search, Filter, MoreVertical, Mail, Phone, MapPin, Edit } from "lucide-react";

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "Acme Corp", contact: "John Smith", email: "john@acme.com", phone: "+1 (555) 123-4567", balance: "Rs. 0.00", status: "Active" },
    { id: 2, name: "Globex Inc", contact: "Sarah Connor", email: "sarah@globex.com", phone: "+1 (555) 987-6543", balance: "Rs. 345,000.00", status: "Active" },
    { id: 3, name: "Initech", contact: "Peter Gibbons", email: "peter@initech.com", phone: "+1 (555) 456-7890", balance: "Rs. 85,000.00", status: "Overdue" },
    { id: 4, name: "Umbrella Corp", contact: "Albert Wesker", email: "albert@umbrella.com", phone: "+1 (555) 222-3333", balance: "Rs. 1,240,000.00", status: "Active" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your customer database and track balances.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all bg-white"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer Name</th>
                <th className="px-6 py-4 font-semibold">Contact Details</th>
                <th className="px-6 py-4 font-semibold text-right">Outstanding Balance</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.contact}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${c.balance === "Rs. 0.00" ? "text-slate-500" : "text-slate-900"}`}>
                      {c.balance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${c.status === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-100 rounded-md transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
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
      </div>
    </div>
  );
}
