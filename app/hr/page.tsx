"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, UserCheck, Clock, Calendar, DollarSign, Plus,
  CheckCircle2, XCircle, ChevronRight, User, Loader2,
  AlertCircle, RefreshCw, TrendingUp,
} from "lucide-react";
import { getEmployees } from "@/utils/api/employees";
import { getAttendance, AttendanceRecord } from "@/utils/api/attendance";
import { getLeaveRequests, LeaveRequest, approveLeaveRequest, rejectLeaveRequest } from "@/utils/api/leave";
import { getPayrollRuns, formatMoney, monthLabel } from "@/utils/api/payroll";

// ─── Helper: today's date as YYYY-MM-DD ──────────────────────────────────────
function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    present:  "bg-green-100 text-green-700 border-green-200",
    late:     "bg-purple-100 text-purple-700 border-purple-200",
    half_day: "bg-blue-100 text-blue-700 border-blue-200",
    leave:    "bg-amber-100 text-amber-700 border-amber-200",
    absent:   "bg-rose-100 text-rose-700 border-rose-200",
  };
  const labels: Record<string, string> = {
    present: "Present", late: "Late", half_day: "Half Day",
    leave: "On Leave", absent: "Absent",
  };
  return { cls: map[status] ?? "bg-slate-100 text-slate-600 border-slate-200", label: labels[status] ?? status };
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function HRDashboardPage() {
  const today = todayIso();
  const now   = new Date();

  // ── Data ────────────────────────────────────────────────────────────────────
  const [totalEmployees, setTotalEmployees]       = useState<number | null>(null);
  const [todayAttendance, setTodayAttendance]     = useState<AttendanceRecord[]>([]);
  const [pendingLeaves, setPendingLeaves]         = useState<LeaveRequest[]>([]);
  const [latestRunLabel, setLatestRunLabel]       = useState<string | null>(null);
  const [latestRunNetPay, setLatestRunNetPay]     = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // Leave action states
  const [actioningLeaveId, setActioningLeaveId] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [empRes, attRes, leaveRes, payrollRes] = await Promise.allSettled([
        getEmployees({ limit: 1, status: "active" }),
        getAttendance({ startDate: today, endDate: today, limit: 50 }),
        getLeaveRequests({ status: "pending", limit: 10 }),
        getPayrollRuns({ year: now.getFullYear(), limit: 1 }),
      ]);

      if (empRes.status === "fulfilled")     setTotalEmployees(empRes.value.meta.total);
      if (attRes.status === "fulfilled")     setTodayAttendance(attRes.value.data);
      if (leaveRes.status === "fulfilled")   setPendingLeaves(leaveRes.value.data);

      if (payrollRes.status === "fulfilled" && payrollRes.value.data.length > 0) {
        const run = payrollRes.value.data[0];
        setLatestRunLabel(monthLabel(run.month, run.year));
        // We don't have total net here so show employee count
        setLatestRunNetPay(`${run._count.payslips} payslips · ${run.status}`);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  // ── Derived stats from today's attendance ──────────────────────────────────
  const presentCount  = todayAttendance.filter(a => a.status === "present" || a.status === "late").length;
  const onLeaveCount  = todayAttendance.filter(a => a.status === "leave").length;
  const lateCount     = todayAttendance.filter(a => a.status === "late").length;
  const totalToday    = todayAttendance.length;
  const attendancePct = totalEmployees && totalEmployees > 0
    ? Math.round((presentCount / totalEmployees) * 100) : 0;

  const hrStats = [
    {
      label: "Total Active Staff",
      count: totalEmployees != null ? `${totalEmployees} Staff` : "—",
      sub: "Active employees",
      color: "text-blue-600", bg: "bg-blue-100", icon: Users,
    },
    {
      label: "Present Today",
      count: `${presentCount} In`,
      sub: totalToday > 0 ? `${attendancePct}% of recorded` : "No records yet",
      color: "text-green-600", bg: "bg-green-100", icon: UserCheck,
    },
    {
      label: "On Leave Today",
      count: `${onLeaveCount} Staff`,
      sub: "Approved leave",
      color: "text-amber-600", bg: "bg-amber-100", icon: Calendar,
    },
    {
      label: "Late Arrivals",
      count: `${lateCount} Staff`,
      sub: "Today",
      color: "text-purple-600", bg: "bg-purple-100", icon: Clock,
    },
    {
      label: "Latest Payroll",
      count: latestRunLabel ?? "No runs yet",
      sub: latestRunNetPay ?? "Run payroll to see data",
      color: "text-indigo-600", bg: "bg-indigo-100", icon: DollarSign,
    },
  ];

  // ── Leave actions ──────────────────────────────────────────────────────────
  const handleLeaveAction = async (id: string, action: "approve" | "reject") => {
    setActioningLeaveId(id);
    try {
      if (action === "approve") await approveLeaveRequest(id);
      else await rejectLeaveRequest(id);
      setPendingLeaves(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      alert(err?.message ?? `Failed to ${action} leave.`);
    } finally {
      setActioningLeaveId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR & Staff Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage staff profiles, daily attendance tracking, leave requests, and monthly payroll runs.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={loadDashboard}
            disabled={isLoading}
            title="Refresh dashboard"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#00184d] hover:border-slate-300 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
          <Link href="/hr/employees/create" className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
            <Plus size={16} /> Add Employee
          </Link>
          <Link href="/hr/payroll" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm">
            <DollarSign size={16} /> Process Payroll
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Today Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#00184d] to-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Live Dashboard</span>
          </div>
          <h2 className="text-xl font-bold">Today — {new Date().toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h2>
          <p className="text-xs text-blue-200">
            {totalToday} attendance records logged · {pendingLeaves.length} pending leave requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/hr/attendance"
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/20 backdrop-blur-sm transition-colors"
          >
            <TrendingUp size={15} /> View Attendance
          </Link>
          <Link href="/hr/leave"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Calendar size={15} />
            {pendingLeaves.length > 0 && (
              <span className="bg-white text-amber-700 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {pendingLeaves.length}
              </span>
            )}
            Leave Queue
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {hrStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className={`text-xl font-bold text-slate-900 mt-1 ${isLoading ? "opacity-40" : ""}`}>
                  {isLoading ? "…" : stat.count}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
              <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Attendance & Leave Approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Today's Attendance Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <UserCheck size={18} className="text-[#00184d]" />
                Today's Attendance Status
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date().toLocaleDateString("en-LK", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <Link href="/hr/attendance" className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1">
              Full Log <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-14">
                <Loader2 size={22} className="animate-spin text-slate-300" />
              </div>
            ) : todayAttendance.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                <Clock size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="font-medium">No attendance records for today yet.</p>
                <p className="text-xs mt-1">Records appear once staff are marked in.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Staff Member</th>
                    <th className="px-5 py-3.5 font-semibold">Department</th>
                    <th className="px-5 py-3.5 font-semibold text-center">Hours</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {todayAttendance.slice(0, 10).map((rec) => {
                    const badge = statusBadge(rec.status);
                    const name = rec.employee?.fullName ?? "Unknown";
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#00184d]/10 text-[#00184d] font-bold text-xs flex items-center justify-center shrink-0">
                              {initials(name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{name}</p>
                              <p className="text-xs text-slate-400 font-mono">
                                {rec.employee?.employeeCode} · {rec.employee?.designation}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">{rec.employee?.department ?? "—"}</td>
                        <td className="px-5 py-3.5 text-center font-mono font-bold text-xs text-slate-800">
                          {rec.hoursWorked != null ? `${rec.hoursWorked}h` : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {todayAttendance.length > 10 && (
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing 10 of {todayAttendance.length} records.{" "}
              <Link href="/hr/attendance" className="text-[#00184d] font-semibold hover:underline">View all →</Link>
            </div>
          )}
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-amber-600" />
                Pending Leave Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manager approval required</p>
            </div>
            <Link href="/hr/leave" className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 size={20} className="animate-spin text-slate-300" />
              </div>
            ) : pendingLeaves.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <CheckCircle2 size={28} className="mx-auto text-green-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">All caught up!</p>
                <p className="text-xs mt-1">No pending leave requests.</p>
              </div>
            ) : (
              pendingLeaves.map((lv) => {
                const isActioning = actioningLeaveId === lv.id;
                const start = new Date(lv.startDate).toLocaleDateString("en-LK", { month: "short", day: "numeric" });
                const end   = new Date(lv.endDate).toLocaleDateString("en-LK", { month: "short", day: "numeric" });
                const daysLabel = `${start} – ${end} (${lv.totalDays} day${Number(lv.totalDays) > 1 ? "s" : ""})`;
                return (
                  <div key={lv.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800 text-sm truncate">{lv.employee?.fullName ?? "Employee"}</span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                        {lv.leaveType?.name ?? "Leave"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Dates: <strong className="text-slate-900">{daysLabel}</strong></p>
                    {lv.reason && (
                      <p className="text-xs text-slate-500 italic truncate">"{lv.reason}"</p>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => handleLeaveAction(lv.id, "approve")}
                        disabled={isActioning}
                        className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                      >
                        {isActioning ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveAction(lv.id, "reject")}
                        disabled={isActioning}
                        className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Submodule Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Employee Directory",  href: "/hr/employees",  icon: Users,       color: "text-blue-600",   bg: "bg-blue-50" },
          { label: "Attendance Tracking", href: "/hr/attendance", icon: Clock,        color: "text-green-600",  bg: "bg-green-50" },
          { label: "Leave Management",    href: "/hr/leave",      icon: Calendar,     color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Payroll & Payslips",  href: "/hr/payroll",    icon: DollarSign,   color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Employee Self-Portal",href: "/hr/portal",     icon: User,         color: "text-purple-600", bg: "bg-purple-50" },
        ].map((link, i) => {
          const Icon = link.icon;
          return (
            <Link key={i} href={link.href}
              className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`p-2.5 rounded-xl ${link.bg} group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={link.color} />
              </div>
              <span className="text-xs font-semibold text-slate-700">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
