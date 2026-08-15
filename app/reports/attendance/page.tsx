"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock, Search, CheckCircle2, AlertTriangle, Calendar, Download,
  ChevronRight, UserCheck, XCircle, TrendingUp, Filter, BarChart2,
  Loader2, AlertCircle, ArrowLeft, FileSpreadsheet
} from "lucide-react";
import { getEmployees, Employee } from "@/utils/api/employees";
import { getAttendance, AttendanceRecord } from "@/utils/api/attendance";
import * as XLSX from "xlsx";

// ─── Types ───────────────────────────────────────────────────────────────────
type Period = "day" | "week" | "month";
type StatusFilter = "all" | "present" | "absent" | "late" | "half_day" | "leave";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getDateRange(period: Period, anchor: string): { start: string; end: string } {
  const date = new Date(anchor);
  if (period === "day") {
    return { start: anchor, end: anchor };
  }
  if (period === "week") {
    const day = date.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day; // make Mon the start
    const mon = new Date(date);
    mon.setDate(date.getDate() + diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return {
      start: mon.toISOString().split("T")[0],
      end: sun.toISOString().split("T")[0],
    };
  }
  // month
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  present:  { label: "Present",  classes: "bg-green-50 text-green-700 border-green-200" },
  absent:   { label: "Absent",   classes: "bg-rose-50 text-rose-700 border-rose-200" },
  half_day: { label: "Half Day", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  late:     { label: "Late",     classes: "bg-purple-50 text-purple-700 border-purple-200" },
  leave:    { label: "Leave",    classes: "bg-blue-50 text-blue-700 border-blue-200" },
};

// ─── Excel Export ─────────────────────────────────────────────────────────────
function exportToExcel(
  records: AttendanceRecord[],
  employees: Employee[],
  dateRange: { start: string; end: string },
  period: Period
) {
  if (records.length === 0) {
    alert("No records to export.");
    return;
  }

  // Build rows
  const rows = records.map(rec => {
    const emp = employees.find(e => e.id === rec.employeeId);
    const statusLabel = STATUS_CONFIG[rec.status]?.label ?? rec.status;
    return {
      "Employee Name":    emp?.fullName        ?? "—",
      "Employee Code":    emp?.employeeCode    ?? "—",
      "Department":       emp?.department      ?? "—",
      "Designation":      emp?.designation     ?? "—",
      "Date":             fmtDate(rec.date?.toString().split("T")[0] ?? ""),
      "Status":           statusLabel,
      "Hours Worked":     rec.hoursWorked ? String(rec.hoursWorked) : "",
      "Notes":            rec.notes ?? "",
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 25 }, // Employee Name
    { wch: 14 }, // Code
    { wch: 18 }, // Department
    { wch: 22 }, // Designation
    { wch: 16 }, // Date
    { wch: 12 }, // Status
    { wch: 14 }, // Hours
    { wch: 35 }, // Notes
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

  const filename = `Attendance_Report_${period}_${dateRange.start}_to_${dateRange.end}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export default function AttendanceReportPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [anchor, setAnchor] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deptFilter, setDeptFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { start, end } = getDateRange(period, anchor);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [empRes, attRes] = await Promise.all([
          getEmployees({ limit: 200, status: "active" }),
          getAttendance({ startDate: start, endDate: end, limit: 500 }),
        ]);
        setEmployees(empRes?.data ?? []);
        setRecords(attRes?.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [start, end]);

  // ── Derived stats ──
  const totalEmployees = employees.length;
  const totalDays = period === "day" ? 1 : period === "week" ? 7 : new Date(new Date(anchor).getFullYear(), new Date(anchor).getMonth() + 1, 0).getDate();
  const totalExpected = totalEmployees * totalDays;

  const presentCount  = records.filter(r => r.status === "present" || r.status === "late").length;
  const absentCount   = records.filter(r => r.status === "absent").length;
  const leaveCount    = records.filter(r => r.status === "leave").length;
  const lateCount     = records.filter(r => r.status === "late").length;
  const halfCount     = records.filter(r => r.status === "half_day").length;
  const attendancePct = totalExpected > 0 ? ((presentCount / totalExpected) * 100).toFixed(1) : "0.0";

  // ── Summary bar chart data (last 7 days or all days in range) ──
  const chartDays = period === "day" ? [start] : (() => {
    const days: string[] = [];
    const s = new Date(start);
    const e = new Date(end);
    while (s <= e) {
      days.push(s.toISOString().split("T")[0]);
      s.setDate(s.getDate() + 1);
    }
    return days.slice(-14); // max 14 days shown
  })();

  const chartData = chartDays.map(day => ({
    day,
    present: records.filter(r => r.date?.toString().startsWith(day) && (r.status === "present" || r.status === "late")).length,
    absent:  records.filter(r => r.date?.toString().startsWith(day) && r.status === "absent").length,
  }));
  const chartMax = Math.max(...chartData.map(d => d.present + d.absent), 1);

  // ── Filtered table rows ──
  const departments = ["All", ...Array.from(new Set(employees.map(e => e.department))).filter(Boolean)];

  const filteredRecords = records.filter(rec => {
    const emp = employees.find(e => e.id === rec.employeeId);
    if (!emp) return false;
    if (deptFilter !== "All" && emp.department !== deptFilter) return false;
    if (statusFilter !== "all" && rec.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase();
    if (q && !emp.fullName.toLowerCase().includes(q) && !emp.employeeCode.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* ── Breadcrumb + Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link href="/reports" className="text-xs font-semibold text-slate-400 hover:text-[#00184d] flex items-center gap-1 transition-colors">
              <ArrowLeft size={12} /> Reports
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-xs font-semibold text-[#00184d] uppercase tracking-wider">Attendance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Report</h1>
          <p className="text-slate-500 text-sm mt-1">
            {period === "day" ? fmtDate(start) : `${fmtDate(start)} — ${fmtDate(end)}`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Tabs */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            {(["day", "week", "month"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  period === p ? "bg-[#00184d] text-white shadow" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Anchor date */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              value={anchor}
              onChange={e => setAnchor(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
            />
          </div>

          {/* Export to Excel */}
          <button
            onClick={() => exportToExcel(filteredRecords, employees, { start, end }, period)}
            disabled={isLoading || filteredRecords.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            title={filteredRecords.length === 0 ? "No records to export" : `Export ${filteredRecords.length} records to Excel`}
          >
            <FileSpreadsheet size={14} /> Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Employees",    value: totalEmployees, icon: UserCheck,     color: "text-slate-600",  bg: "bg-slate-100" },
          { label: "Present",      value: presentCount,   icon: CheckCircle2,  color: "text-green-700",  bg: "bg-green-100" },
          { label: "Absent",       value: absentCount,    icon: XCircle,       color: "text-rose-700",   bg: "bg-rose-100" },
          { label: "On Leave",     value: leaveCount,     icon: Calendar,      color: "text-blue-700",   bg: "bg-blue-100" },
          { label: "Late",         value: lateCount,      icon: Clock,         color: "text-purple-700", bg: "bg-purple-100" },
          { label: "Attendance %", value: `${attendancePct}%`, icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-100" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                <Icon size={18} className={k.color} />
              </div>
              <p className={`text-xl font-bold ${k.color}`}>{isLoading ? "—" : k.value}</p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Bar Chart ── */}
      {chartDays.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Daily Attendance Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Present (blue) vs Absent (red) per day</p>
            </div>
            <BarChart2 size={18} className="text-slate-300" />
          </div>
          <div className="flex items-end gap-1.5 h-32 overflow-x-auto pb-1">
            {chartData.map(d => (
              <div key={d.day} className="flex-1 min-w-[24px] flex flex-col items-center gap-0.5 group">
                <div className="w-full flex flex-col justify-end gap-px" style={{ height: "100px" }}>
                  {d.present > 0 && (
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all"
                      style={{ height: `${(d.present / chartMax) * 100}%` }}
                      title={`Present: ${d.present}`}
                    />
                  )}
                  {d.absent > 0 && (
                    <div
                      className="w-full bg-gradient-to-t from-rose-500 to-rose-300 rounded-t transition-all"
                      style={{ height: `${(d.absent / chartMax) * 100}%` }}
                      title={`Absent: ${d.absent}`}
                    />
                  )}
                </div>
                <span className="text-[9px] text-slate-400 rotate-45 origin-left whitespace-nowrap mt-1">
                  {new Date(d.day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-3 h-3 rounded bg-blue-500 block" /> Present / Late
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-3 h-3 rounded bg-rose-400 block" /> Absent
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 bg-white"
              />
            </div>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
              <option value="leave">Leave</option>
            </select>
            {/* Dept filter */}
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter size={13} />
            <span>{filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 size={36} className="animate-spin text-[#00184d]" />
              <p className="text-sm font-medium">Loading attendance records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <Clock size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm font-medium">No attendance records found for the selected filters.</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting the period or filters above.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Hours</th>
                  <th className="px-6 py-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(rec => {
                  const emp = employees.find(e => e.id === rec.employeeId);
                  if (!emp) return null;
                  const cfg = STATUS_CONFIG[rec.status] ?? { label: rec.status, classes: "bg-slate-100 text-slate-600 border-slate-200" };
                  const avatar = emp.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00184d]/10 text-[#00184d] font-bold text-xs flex items-center justify-center shrink-0">
                            {avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{emp.fullName}</p>
                            <span className="font-mono text-xs text-[#00184d] font-semibold">{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-700">{emp.designation}</p>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{emp.department}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {fmtDate(rec.date?.toString().split("T")[0] ?? "")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">
                        {rec.hoursWorked ? `${rec.hoursWorked}h` : "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                        {rec.notes || "—"}
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
