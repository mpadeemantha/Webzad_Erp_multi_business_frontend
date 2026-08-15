"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, Plus, CheckCircle2, XCircle, Clock, Search, Filter,
  AlertCircle, X, Save, Loader2, Trash2, ShieldAlert, ArrowLeft,
  RefreshCw, ChevronRight
} from "lucide-react";
import { getEmployees, Employee } from "@/utils/api/employees";
import {
  getLeaveTypes, getLeaveRequests, createLeaveRequest, approveLeaveRequest,
  rejectLeaveRequest, deleteLeaveRequest, allocateLeaveBalances,
  getEmployeeLeaveBalances, updateLeaveBalance, createLeaveType,
  LeaveType, LeaveRequest, LeaveBalance
} from "@/utils/api/leave";

export default function LeaveManagementPage() {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  
  // Data lists
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [selectedEmployeeBalances, setSelectedEmployeeBalances] = useState<LeaveBalance[]>([]);
  
  // Filtering & loading states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEmpForBalance, setSelectedEmpForBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBalancesLoading, setIsBalancesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  
  // New application state
  const [newLeave, setNewLeave] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
    allowBackdated: false,
  });
  
  // Edit Balance state
  const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null);
  const [editingAllocatedDays, setEditingAllocatedDays] = useState<string>("");
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  const [modalError, setModalError] = useState<string | null>(null);
  const [modalWarning, setModalWarning] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Manage Leave Types modal states
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [newType, setNewType] = useState({ name: "", defaultDaysPerYear: 14 });
  const [isSubmittingType, setIsSubmittingType] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);

  // 1. Initial Load of core data
  useEffect(() => {
    async function loadCoreData() {
      setIsLoading(true);
      setError(null);
      try {
        const [empRes, typesRes] = await Promise.all([
          getEmployees({ limit: 100, status: "active" }),
          getLeaveTypes(),
        ]);
        
        const activeEmployees = empRes?.data ?? [];
        setEmployees(activeEmployees);
        setLeaveTypes(typesRes ?? []);
        
        if (activeEmployees.length > 0) {
          setSelectedEmpForBalance(activeEmployees[0].id);
          setNewLeave(prev => ({
            ...prev,
            employeeId: activeEmployees[0].id,
          }));
        }
        
        if (typesRes && typesRes.length > 0) {
          setNewLeave(prev => ({
            ...prev,
            leaveTypeId: typesRes[0].id,
          }));
        }
      } catch (err: any) {
        setError(err?.message ?? "Failed to load initial data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCoreData();
  }, []);

  const handleCreateLeaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    setTypeError(null);
    setIsSubmittingType(true);

    try {
      const created = await createLeaveType({
        name: newType.name,
        defaultDaysPerYear: Number(newType.defaultDaysPerYear),
      });
      
      const updatedTypes = [...leaveTypes, created];
      setLeaveTypes(updatedTypes);
      
      // Select newly created type as default if none selected
      if (!newLeave.leaveTypeId) {
        setNewLeave(prev => ({ ...prev, leaveTypeId: created.id }));
      }

      setNewType({ name: "", defaultDaysPerYear: 14 });
      setIsTypeModalOpen(false);
      alert(`Leave Type "${created.name}" created successfully.`);
    } catch (err: any) {
      setTypeError(err?.message ?? "Failed to create leave type.");
    } finally {
      setIsSubmittingType(false);
    }
  };

  // 2. Fetch requests when page, status, or search query changes
  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await getLeaveRequests({
          status: selectedStatus === "All" ? undefined : selectedStatus,
          page,
          limit: 10,
        });
        setRequests(res?.data ?? []);
        setTotalPages(res?.meta?.totalPages ?? 1);
      } catch (err: any) {
        console.error("Failed to load leave requests:", err);
      }
    }
    loadRequests();
  }, [selectedStatus, page]);

  // 3. Fetch employee balances when selected employee or year changes
  useEffect(() => {
    if (!selectedEmpForBalance) return;
    
    async function loadBalances() {
      setIsBalancesLoading(true);
      try {
        const res = await getEmployeeLeaveBalances(selectedEmpForBalance, currentYear);
        setSelectedEmployeeBalances(res ?? []);
      } catch (err: any) {
        console.error("Failed to load employee balances:", err);
      } finally {
        setIsBalancesLoading(false);
      }
    }
    
    loadBalances();
  }, [selectedEmpForBalance, currentYear]);

  // Actions
  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this leave request?")) return;
    try {
      await approveLeaveRequest(id);
      // Refresh requests and current balances
      refreshAll();
    } catch (err: any) {
      alert(err?.message ?? "Failed to approve request.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this leave request?")) return;
    try {
      await rejectLeaveRequest(id);
      refreshAll();
    } catch (err: any) {
      alert(err?.message ?? "Failed to reject request.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteLeaveRequest(id);
      refreshAll();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete request.");
    }
  };

  const handleAllocateBalances = async () => {
    if (!confirm(`Initialize leave balances for all active employees for year ${currentYear}?`)) return;
    setIsAllocating(true);
    try {
      const res = await allocateLeaveBalances(currentYear);
      alert(res.message);
      // Refresh balances view
      if (selectedEmpForBalance) {
        const balances = await getEmployeeLeaveBalances(selectedEmpForBalance, currentYear);
        setSelectedEmployeeBalances(balances ?? []);
      }
    } catch (err: any) {
      alert(err?.message ?? "Failed to allocate balances.");
    } finally {
      setIsAllocating(false);
    }
  };

  const handleUpdateBalance = async (balanceId: string) => {
    const value = parseFloat(editingAllocatedDays);
    if (isNaN(value) || value < 0) {
      alert("Please enter a valid number of days.");
      return;
    }
    setIsUpdatingBalance(true);
    try {
      await updateLeaveBalance(balanceId, value);
      setEditingBalanceId(null);
      // Refresh balances
      if (selectedEmpForBalance) {
        const res = await getEmployeeLeaveBalances(selectedEmpForBalance, currentYear);
        setSelectedEmployeeBalances(res ?? []);
      }
    } catch (err: any) {
      alert(err?.message ?? "Failed to update balance.");
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalWarning(null);
    setIsSubmittingRequest(true);

    try {
      const res = await createLeaveRequest(newLeave);
      if (res.warning) {
        // Show soft warning first
        setModalWarning(res.warning);
        // Prompt user if they want to override/proceed
        if (confirm(`${res.warning}\n\nDo you still want to submit this request?`)) {
          // If okay, submit request with override or complete
          alert("Request submitted successfully (Pending Approval).");
          setIsApplyModalOpen(false);
          refreshAll();
        }
      } else {
        alert("Leave request submitted successfully (Pending Approval).");
        setIsApplyModalOpen(false);
        refreshAll();
      }
    } catch (err: any) {
      setModalError(err?.message ?? "Failed to submit request.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const refreshAll = async () => {
    // Refresh requests
    const res = await getLeaveRequests({
      status: selectedStatus === "All" ? undefined : selectedStatus,
      page,
      limit: 10,
    });
    setRequests(res?.data ?? []);
    setTotalPages(res?.meta?.totalPages ?? 1);

    // Refresh balances
    if (selectedEmpForBalance) {
      const balRes = await getEmployeeLeaveBalances(selectedEmpForBalance, currentYear);
      setSelectedEmployeeBalances(balRes ?? []);
    }
  };

  // Local filter for search query
  const filteredRequests = requests.filter(r => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      r.id.toLowerCase().includes(q) ||
      (r.employee?.fullName ?? "").toLowerCase().includes(q) ||
      (r.employee?.employeeCode ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/hr" className="text-xs font-semibold text-slate-400 hover:text-[#00184d] flex items-center gap-1 transition-colors">
          <ArrowLeft size={12} /> HR Dashboard
        </Link>
        <ChevronRight size={10} className="text-slate-300" />
        <span className="text-xs font-semibold text-[#00184d] uppercase tracking-wider">Leave Management</span>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review leave applications, manager approval workflow, and staff leave balances.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsTypeModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
          >
            Manage Leave Types
          </button>
          <button
            onClick={() => {
              // Ensure default values are populated if available
              if (!newLeave.leaveTypeId && leaveTypes.length > 0) {
                setNewLeave(prev => ({ ...prev, leaveTypeId: leaveTypes[0].id }));
              }
              if (!newLeave.employeeId && employees.length > 0) {
                setNewLeave(prev => ({ ...prev, employeeId: employees[0].id }));
              }
              setIsApplyModalOpen(true);
            }}
            disabled={leaveTypes.length === 0 || employees.length === 0}
            className="inline-flex items-center justify-center gap-2 bg-[#00184d] hover:bg-blue-900 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
            title={leaveTypes.length === 0 ? "Please create a leave type first using 'Manage Leave Types'" : undefined}
          >
            <Plus size={18} />
            Apply for Leave
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Leave Balances Summary Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={18} className="text-[#00184d]" />
            Staff Leave Balances Overview
          </h2>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Year selector */}
            <select
              value={currentYear}
              onChange={e => setCurrentYear(parseInt(e.target.value, 10))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>

            {/* Employee Selector */}
            <select
              value={selectedEmpForBalance}
              onChange={e => setSelectedEmpForBalance(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 max-w-[200px]"
            >
              <option value="">Select Employee...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</option>
              ))}
            </select>

            {/* Allocate / Initialize Button */}
            <button
              onClick={handleAllocateBalances}
              disabled={isAllocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#00184d]/5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
            >
              {isAllocating ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Initialize Balances
            </button>
          </div>
        </div>

        {isBalancesLoading ? (
          <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-xs">Loading balances...</span>
          </div>
        ) : selectedEmployeeBalances.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No balances initialized for this employee for {currentYear}. Click "Initialize Balances" to generate defaults.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedEmployeeBalances.map((b) => {
              const allocated = parseFloat(String(b.allocatedDays));
              const used = parseFloat(String(b.usedDays));
              const left = allocated - used;
              const isEditing = editingBalanceId === b.id;

              return (
                <div key={b.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{b.leaveType?.name ?? "Leave Type"}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Year {b.year}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      {left} Days Left
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Allocated:</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.5"
                            value={editingAllocatedDays}
                            onChange={e => setEditingAllocatedDays(e.target.value)}
                            className="w-16 px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs font-semibold"
                          />
                          <button
                            onClick={() => handleUpdateBalance(b.id)}
                            disabled={isUpdatingBalance}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button onClick={() => setEditingBalanceId(null)} className="text-slate-400 hover:text-slate-600">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">{allocated} days</span>
                          <button
                            onClick={() => {
                              setEditingBalanceId(b.id);
                              setEditingAllocatedDays(String(allocated));
                            }}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Adjust
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Used:</span>
                      <span className="font-semibold text-slate-700">{used} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leave Applications Queue Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search request or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 bg-white"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-200/60 rounded-xl">
            {["All", "Pending", "Approved", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === st ? "bg-white text-[#00184d] shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 size={36} className="animate-spin text-[#00184d]" />
              <p className="text-sm font-medium">Loading leave applications...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No leave requests found matching the filters.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Staff Member</th>
                  <th className="px-6 py-4 font-semibold">Leave Type</th>
                  <th className="px-6 py-4 font-semibold">Requested Dates</th>
                  <th className="px-6 py-4 font-semibold">Reason</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Manager Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => {
                  const avatar = (req.employee?.fullName ?? "Staff").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  const startFmt = new Date(req.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                  const endFmt = new Date(req.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                  
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00184d]/10 text-[#00184d] font-bold text-xs flex items-center justify-center shrink-0">
                            {avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{req.employee?.fullName ?? "—"}</p>
                            <p className="text-xs text-slate-400 font-mono">
                              {req.employee?.employeeCode ?? "—"} • {req.employee?.designation ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md">{req.leaveType?.name ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {startFmt} to {endFmt} ({parseFloat(String(req.totalDays))} Day{parseFloat(String(req.totalDays)) !== 1 ? 's' : ''})
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">{req.reason ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : req.status === "pending"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {req.status === "pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                            <button
                              onClick={() => handleDelete(req.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Delete Pending Request"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form onSubmit={handleApplySubmit} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">New Leave Application</h2>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Employee Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Employee <span className="text-red-500">*</span></label>
                <select
                  value={newLeave.employeeId}
                  onChange={e => setNewLeave({ ...newLeave, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                  required
                >
                  <option value="">Select Employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</option>
                  ))}
                </select>
              </div>

              {/* Leave Type Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Type <span className="text-red-500">*</span></label>
                <select
                  value={newLeave.leaveTypeId}
                  onChange={e => setNewLeave({ ...newLeave, leaveTypeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                  required
                >
                  <option value="">Select Type...</option>
                  {leaveTypes.map(lt => (
                    <option key={lt.id} value={lt.id}>{lt.name} ({lt.defaultDaysPerYear} days/year)</option>
                  ))}
                </select>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Backdated request flag */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowBackdated"
                  checked={newLeave.allowBackdated}
                  onChange={e => setNewLeave({ ...newLeave, allowBackdated: e.target.checked })}
                  className="w-4 h-4 text-[#00184d] border-slate-300 rounded focus:ring-[#00184d]/20"
                />
                <label htmlFor="allowBackdated" className="text-slate-600 font-medium">This is a backdated entry</label>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  value={newLeave.reason}
                  onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="State brief reason..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="px-4 py-2 bg-[#00184d] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 flex items-center gap-1.5 disabled:opacity-75"
              >
                {isSubmittingRequest ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Leave Types Modal */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Manage Leave Types</h2>
              <button
                type="button"
                onClick={() => setIsTypeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* List current types */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Leave Types</h3>
              {leaveTypes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No leave types defined yet. Create one below.</p>
              ) : (
                <div className="max-h-32 overflow-y-auto space-y-1.5 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                  {leaveTypes.map(lt => (
                    <div key={lt.id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 text-xs">
                      <span className="font-bold text-slate-700">{lt.name}</span>
                      <span className="text-slate-500 font-medium">{lt.defaultDaysPerYear} Days/Year</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create new type form */}
            <form onSubmit={handleCreateLeaveType} className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-800">Add New Leave Type</h3>
              
              {typeError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                  <AlertCircle size={14} className="text-rose-500 shrink-0" />
                  <span>{typeError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Leave, Casual Leave"
                    value={newType.name}
                    onChange={e => setNewType({ ...newType, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Default Days Per Year <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={newType.defaultDaysPerYear}
                    onChange={e => setNewType({ ...newType, defaultDaysPerYear: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingType}
                  className="px-4 py-2 bg-[#00184d] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 flex items-center gap-1.5 disabled:opacity-75"
                >
                  {isSubmittingType ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Add Leave Type
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
