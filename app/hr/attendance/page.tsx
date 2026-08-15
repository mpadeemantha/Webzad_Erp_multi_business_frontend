"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock, Search, CheckCircle2, AlertTriangle, Calendar, Edit3, X, Save,
  Plus, Loader2, AlertCircle, Trash2, UserCheck
} from "lucide-react";
import { getEmployees, Employee } from "@/utils/api/employees";
import {
  getAttendance, createAttendance, updateAttendance, deleteAttendance, AttendanceRecord
} from "@/utils/api/attendance";

export default function AttendancePage() {
  // Date State
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit/Create Modal State
  const [editingRecord, setEditingRecord] = useState<{
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    recordId?: string; // Present if updating existing record
    status: 'present' | 'absent' | 'half_day' | 'late' | 'leave';
    hoursWorked: string;
    notes: string;
  } | null>(null);

  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load employees and attendance records
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch all active employees
        const empRes = await getEmployees({ limit: 100, status: "active" });
        setEmployees(empRes?.data ?? []);

        // 2. Fetch attendance records for the selected date
        const attRes = await getAttendance({
          startDate: selectedDate,
          endDate: selectedDate,
          limit: 100,
        });

        // Map employeeId to attendance record
        const map: Record<string, AttendanceRecord> = {};
        (attRes?.data ?? []).forEach(rec => {
          map[rec.employeeId] = rec;
        });
        setAttendanceMap(map);

      } catch (err: any) {
        setError(err?.message ?? "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedDate]);

  // Handle Mark / Edit Click
  const handleOpenMarkModal = (emp: Employee) => {
    const existing = attendanceMap[emp.id];
    setModalError(null);
    setEditingRecord({
      employeeId: emp.id,
      employeeName: emp.fullName,
      employeeCode: emp.employeeCode,
      recordId: existing?.id,
      status: existing?.status ?? 'present',
      hoursWorked: existing?.hoursWorked ? String(existing.hoursWorked) : "",
      notes: existing?.notes ?? "",
    });
  };

  // Handle Save
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setIsSaving(true);
    setModalError(null);

    const hours = editingRecord.hoursWorked ? Number(editingRecord.hoursWorked) : null;
    if (hours !== null && (isNaN(hours) || hours < 0 || hours > 24)) {
      setModalError("Hours worked must be a number between 0 and 24");
      setIsSaving(false);
      return;
    }

    try {
      if (editingRecord.recordId) {
        // Update existing record
        const updated = await updateAttendance(editingRecord.recordId, {
          status: editingRecord.status,
          hoursWorked: hours,
          notes: editingRecord.notes,
        });
        setAttendanceMap(prev => ({
          ...prev,
          [editingRecord.employeeId]: updated,
        }));
      } else {
        // Create new record
        const created = await createAttendance({
          employeeId: editingRecord.employeeId,
          date: selectedDate,
          status: editingRecord.status,
          hoursWorked: hours,
          notes: editingRecord.notes,
        });
        setAttendanceMap(prev => ({
          ...prev,
          [editingRecord.employeeId]: created,
        }));
      }

      setEditingRecord(null);
    } catch (err: any) {
      setModalError(err?.message ?? "Failed to save attendance record.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteAttendance = async (recordId: string, employeeId: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      await deleteAttendance(recordId);
      setAttendanceMap(prev => {
        const copy = { ...prev };
        delete copy[employeeId];
        return copy;
      });
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete attendance record.");
    }
  };

  // Filters
  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === "All" || emp.department === selectedDept;
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Calculate Metrics
  const totalStaff = employees.length;
  const markedRecords = Object.values(attendanceMap);
  const presentCount = markedRecords.filter(r => r.status === "present" || r.status === "late").length;
  const absentCount = markedRecords.filter(r => r.status === "absent").length;
  const leaveCount = markedRecords.filter(r => r.status === "leave").length;
  const unmarkedCount = totalStaff - markedRecords.length;

  const departments = ["All", "Workshop", "Front Desk", "Warehouse", "Administration"];

  const statusColors = {
    present: "bg-green-50 text-green-700 border-green-200",
    absent: "bg-rose-50 text-rose-700 border-rose-200",
    half_day: "bg-amber-50 text-amber-700 border-amber-200",
    late: "bg-purple-50 text-purple-700 border-purple-200",
    leave: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Tracking</h1>
          <p className="text-slate-500 text-sm mt-1">Record and manage staff daily attendance records (Manual Entry).</p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Active Staff</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalStaff} Employees</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Present Today</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{presentCount} Staff</p>
          </div>
          <div className="p-3 bg-green-100 text-green-700 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Absent / Leave</p>
            <p className="text-2xl font-bold text-rose-700 mt-1">{absentCount + leaveCount} Staff</p>
          </div>
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Pending marking</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{unmarkedCount} Staff</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 size={36} className="animate-spin text-[#00184d]" />
              <p className="text-sm font-medium">Loading records...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No staff members found matching the criteria.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Department & Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Hours Worked</th>
                  <th className="px-6 py-4 font-semibold">Notes</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const record = attendanceMap[emp.id];
                  const avatar = emp.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "EE";

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#00184d]/10 text-[#00184d] font-bold text-xs flex items-center justify-center">
                            {avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{emp.fullName}</p>
                            <span className="font-mono text-xs text-[#00184d] font-semibold">{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{emp.designation}</p>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{emp.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        {record ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[record.status]}`}>
                            {record.status.replace("_", " ").toUpperCase()}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-100 text-slate-400 border-slate-200">
                            NOT MARKED
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">
                        {record?.hoursWorked ? `${record.hoursWorked} hrs` : "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                        {record?.notes || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenMarkModal(emp)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#00184d]/5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#00184d] transition-colors"
                          >
                            <Edit3 size={12} />
                            {record ? "Edit" : "Mark"}
                          </button>
                          {record && (
                            <button
                              onClick={() => handleDeleteAttendance(record.id, emp.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Attendance Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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

      {/* Mark / Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form onSubmit={handleSaveAttendance} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingRecord.recordId ? "Edit Attendance" : "Mark Attendance"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
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
              <div>
                <span className="text-slate-500 block">Staff Member</span>
                <span className="font-bold text-slate-800 text-sm">{editingRecord.employeeName} ({editingRecord.employeeCode})</span>
              </div>

              <div>
                <span className="text-slate-500 block">Date</span>
                <span className="font-bold text-slate-800 text-sm">
                  {new Date(selectedDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  value={editingRecord.status}
                  onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#00184d]"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half_day">Half Day</option>
                  <option value="late">Late</option>
                  <option value="leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hours Worked (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="24"
                  placeholder="e.g. 8 or 4.5"
                  value={editingRecord.hoursWorked}
                  onChange={(e) => setEditingRecord({ ...editingRecord, hoursWorked: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#00184d]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes (Optional)</label>
                <textarea
                  placeholder="Reason for late/absence, leave details, etc."
                  value={editingRecord.notes}
                  onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#00184d] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-[#00184d] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 flex items-center gap-1.5 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Record
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
