"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Calendar, DollarSign, Download, Plus, CheckCircle2, User, Eye, Printer, ShieldCheck } from "lucide-react";

export default function EmployeePortalPage() {
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState("08:15 AM");

  const myProfile = {
    empId: "EMP-001",
    name: "Saman Perera",
    role: "Service Advisor",
    dept: "Front Desk & Service",
    nic: "882341092V",
    joiningDate: "Jan 15, 2021",
  };

  const myLeaves = [
    { type: "Annual Leave", remaining: 10, total: 14, color: "bg-blue-500" },
    { type: "Casual Leave", remaining: 5, total: 7, color: "bg-green-500" },
    { type: "Medical Leave", remaining: 6, total: 7, color: "bg-purple-500" },
  ];

  const myAttendance = [
    { date: "Oct 27, 2023", clockIn: "08:15 AM", clockOut: "05:30 PM", hours: "9.25 hrs", status: "On Time" },
    { date: "Oct 26, 2023", clockIn: "08:18 AM", clockOut: "05:30 PM", hours: "9.2 hrs", status: "On Time" },
    { date: "Oct 25, 2023", clockIn: "08:42 AM", clockOut: "05:45 PM", hours: "9.05 hrs", status: "Late" },
    { date: "Oct 24, 2023", clockIn: "08:10 AM", clockOut: "05:30 PM", hours: "9.33 hrs", status: "On Time" },
  ];

  const myPayslips = [
    { month: "October 2023", date: "Oct 31, 2023", netSalary: "Rs. 102,400.00", id: "emp-001" },
    { month: "September 2023", date: "Sep 30, 2023", netSalary: "Rs. 102,400.00", id: "emp-001" },
    { month: "August 2023", date: "Aug 31, 2023", netSalary: "Rs. 102,400.00", id: "emp-001" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#00184d] to-indigo-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-white font-bold text-xl flex items-center justify-center border border-white/20">
            SP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{myProfile.name}</h1>
              <span className="bg-green-400/20 text-green-300 border border-green-400/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Staff Account
              </span>
            </div>
            <p className="text-blue-200 text-sm">{myProfile.role} • {myProfile.dept} (<span className="font-mono">{myProfile.empId}</span>)</p>
          </div>
        </div>

        {/* Quick Duty Clock Button */}
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
          <div className="text-right">
            <span className="text-xs text-blue-200 block">Duty Status</span>
            <span className="font-mono text-xs font-bold text-white">{isClockedIn ? `In at ${clockInTime}` : "Off Duty"}</span>
          </div>
          <button
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              isClockedIn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <Clock size={14} />
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
        </div>
      </div>

      {/* Grid: Leave Balances & Payslips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leave Balances Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-[#00184d]" />
              My Leave Balances
            </h2>
            <Link
              href="/hr/leave"
              className="text-xs font-semibold text-[#00184d] hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Apply Leave
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {myLeaves.map((lb, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{lb.type}</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-slate-900">{lb.remaining} Days</span>
                  <span className="text-xs text-slate-400">of {lb.total} Allocated</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${lb.color}`} style={{ width: `${(lb.remaining / lb.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Downloadable Payslips */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign size={18} className="text-[#00184d]" />
            My Payslips
          </h2>

          <div className="space-y-3">
            {myPayslips.map((ps, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <p className="font-bold text-slate-800 text-xs">{ps.month}</p>
                  <p className="text-[11px] font-semibold text-green-700">{ps.netSalary}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/hr/payroll/payslip/${ps.id}`}
                    className="p-1.5 text-slate-400 hover:text-[#00184d] hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    href={`/hr/payroll/payslip/${ps.id}/print`}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Printer size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock size={18} className="text-[#00184d]" />
          My Recent Attendance History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Clock In</th>
                <th className="px-4 py-3 font-semibold">Clock Out</th>
                <th className="px-4 py-3 font-semibold">Total Hours</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAttendance.map((att, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{att.date}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-900 font-bold">{att.clockIn}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{att.clockOut}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{att.hours}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      att.status === "On Time" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {att.status}
                    </span>
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
