"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Eye, Edit3, Phone, Mail, FileText, UserCheck, Shield, Building2, Loader2 } from "lucide-react";
import { getEmployees, Employee } from "@/utils/api/employees";

export default function EmployeeDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getEmployees({
          search: searchQuery || undefined,
          department: selectedDept !== "All" ? selectedDept : undefined,
          status: selectedStatus !== "All" ? selectedStatus.toLowerCase() : undefined,
        });
        // The API returns { data: Employee[] }
        setEmployees(res?.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Failed to fetch employees");
      } finally {
        setIsLoading(false);
      }
    }
    const timer = setTimeout(() => {
      load();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDept, selectedStatus]);

  const departments = ["All", "Front Desk", "Workshop", "Warehouse", "Administration"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Staff profiles, NIC identification, designations, and salary structures.</p>
        </div>
        <Link
          href="/hr/employees/create"
          className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          Add New Employee
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Name, EMP ID, NIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] bg-white"
              />
            </div>

            {/* Department Filter */}
            <div className="relative w-full sm:w-48">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 font-medium text-slate-700"
              >
                {departments.map((d, idx) => (
                  <option key={idx} value={d}>{d === "All" ? "All Departments" : d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-200/60 rounded-xl">
            {["All", "Active", "On Leave", "Inactive"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === st ? "bg-white text-[#00184d] shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 size={36} className="animate-spin text-[#00184d]" />
              <p className="text-sm font-medium">Loading employees...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-600 font-medium">
              {error}
            </div>
          ) : employees.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No employees found matching the filters.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">NIC Number</th>
                  <th className="px-6 py-4 font-semibold">Designation & Dept</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Joining Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Basic Salary</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const avatar = emp.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "EE";
                  const salary = typeof emp.basicSalary === "number" 
                    ? emp.basicSalary 
                    : parseFloat(emp.basicSalary as string) || 0;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#00184d]/10 text-[#00184d] font-bold text-xs flex items-center justify-center">
                            {avatar}
                          </div>
                          <div>
                            <Link href={`/hr/employees/${emp.id.toLowerCase()}`} className="font-bold text-slate-900 hover:underline flex items-center gap-1">
                              {emp.fullName}
                            </Link>
                            <span className="font-mono text-xs text-[#00184d] font-semibold">{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-700">{emp.nic}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{emp.designation}</p>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{emp.department}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 space-y-0.5">
                        <p>{emp.phone}</p>
                        {emp.email && <p className="text-slate-400">{emp.email}</p>}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(emp.joiningDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        Rs. {salary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          emp.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : emp.status === "suspended"
                            ? "bg-rose-100 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/hr/employees/${emp.id.toLowerCase()}`}
                            className="p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

