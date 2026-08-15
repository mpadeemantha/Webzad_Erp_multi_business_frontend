"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Phone, Mail, FileText, Calendar, Shield, DollarSign, Clock, Download, CheckCircle2, Building2, UserCheck, Loader2, Save, X } from "lucide-react";
import { getEmployee, updateEmployee } from "@/utils/api/employees";

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const empId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<"DOCS" | "LEAVE" | "ATTENDANCE">("DOCS");
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [editForm, setEditForm] = useState({
    fullName: "",
    nic: "",
    phone: "",
    email: "",
    address: "",
    designation: "",
    department: "",
    joiningDate: "",
    basicSalary: "",
    fixedAllowances: "",
    dailyAllowance: "",
    hourlyRate: "",
    payMonthly: true,
    payDaily: false,
    payHourly: false,
    status: "active",
  });

  const startEditing = () => {
    setEditForm({
      fullName: employee.fullName,
      nic: employee.nic,
      phone: employee.phone,
      email: employee.email || "",
      address: employee.address,
      designation: employee.designation,
      department: employee.department,
      joiningDate: new Date(employee.joiningDate).toISOString().split("T")[0],
      basicSalary: String(Number(employee.basicSalary) || 0),
      fixedAllowances: String(Number(employee.fixedAllowances) || 0),
      dailyAllowance: String(Number(employee.dailyAllowance) || 0),
      hourlyRate: String(Number(employee.hourlyRate) || 0),
      payMonthly: Number(employee.basicSalary) > 0 || Number(employee.fixedAllowances) > 0,
      payDaily: Number(employee.dailyAllowance) > 0,
      payHourly: Number(employee.hourlyRate) > 0,
      status: employee.status || "active",
    });
    setValidationErrors({});
    setIsEditing(true);
  };

  const updateEditForm = (field: string, value: any) => {
    setEditForm(p => ({ ...p, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(p => {
        const copy = { ...p };
        delete copy[field];
        return copy;
      });
    }
  };

  const saveChanges = async () => {
    // Validate
    const errs: Record<string, string> = {};
    if (!editForm.fullName.trim()) errs.fullName = "Full name required";
    if (!editForm.nic.trim()) errs.nic = "NIC required";
    if (!editForm.phone.trim()) errs.phone = "Phone required";
    if (!editForm.address.trim()) errs.address = "Address required";
    if (!editForm.designation.trim()) errs.designation = "Designation required";
    if (!editForm.department.trim()) errs.department = "Department required";
    if (!editForm.joiningDate) errs.joiningDate = "Joining date required";

    if (!editForm.payMonthly && !editForm.payDaily && !editForm.payHourly) {
      errs.payType = "At least one pay basis required";
    }

    if (editForm.payMonthly) {
      if (isNaN(Number(editForm.basicSalary)) || Number(editForm.basicSalary) < 0) {
        errs.basicSalary = "Invalid basic salary";
      }
    }
    if (editForm.payDaily) {
      if (isNaN(Number(editForm.dailyAllowance)) || Number(editForm.dailyAllowance) < 0) {
        errs.dailyAllowance = "Invalid daily allowance";
      }
    }
    if (editForm.payHourly) {
      if (isNaN(Number(editForm.hourlyRate)) || Number(editForm.hourlyRate) < 0) {
        errs.hourlyRate = "Invalid hourly rate";
      }
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateEmployee(empId, {
        fullName: editForm.fullName.trim(),
        nic: editForm.nic.trim().toUpperCase(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim() || undefined,
        address: editForm.address.trim(),
        designation: editForm.designation.trim(),
        department: editForm.department.trim(),
        joiningDate: editForm.joiningDate,
        basicSalary: editForm.payMonthly ? (Number(editForm.basicSalary) || 0) : 0,
        fixedAllowances: editForm.payMonthly ? (Number(editForm.fixedAllowances) || 0) : 0,
        dailyAllowance: editForm.payDaily ? (Number(editForm.dailyAllowance) || 0) : 0,
        hourlyRate: editForm.payHourly ? (Number(editForm.hourlyRate) || 0) : 0,
        status: editForm.status as any,
      });
      setEmployee(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err?.message ?? "Failed to save employee profile updates");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getEmployee(empId);
        setEmployee(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load employee details");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [empId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <Loader2 size={36} className="animate-spin text-[#00184d]" />
        <p className="text-sm font-medium">Loading employee details...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-medium">
        {error || "Employee not found."}
      </div>
    );
  }

  const basicSalary = typeof employee.basicSalary === "number" ? employee.basicSalary : parseFloat(employee.basicSalary) || 0;
  const fixedAllowances = typeof employee.fixedAllowances === "number" ? employee.fixedAllowances : parseFloat(employee.fixedAllowances) || 0;
  const dailyAllowance = typeof employee.dailyAllowance === "number" ? employee.dailyAllowance : parseFloat(employee.dailyAllowance) || 0;
  const hourlyRate = typeof employee.hourlyRate === "number" ? employee.hourlyRate : parseFloat(employee.hourlyRate) || 0;
  const epfEmployee = basicSalary * 0.08;
  const epfEmployer = basicSalary * 0.12;
  const etfEmployer = basicSalary * 0.03;

  const joiningDateFormatted = employee.joiningDate 
    ? new Date(employee.joiningDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
    : "N/A";

  const empDetails = {
    id: employee.employeeCode,
    name: employee.fullName,
    nic: employee.nic,
    role: employee.designation,
    dept: employee.department,
    phone: employee.phone,
    email: employee.email || "N/A",
    joiningDate: joiningDateFormatted,
    address: employee.address,
    emergencyContact: "N/A",
    basicSalary,
    allowances: fixedAllowances,
    dailyAllowance,
    hourlyRate,
    epfEmployee,
    epfEmployer,
    etfEmployer,
    status: employee.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1) : "Active",
    avatar: employee.fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "EE",
    documents: [
      { name: "National ID Copy (NIC)", type: "PDF Document", date: joiningDateFormatted, size: "1.2 MB" },
      { name: "Employment Contract 2021", type: "PDF Document", date: joiningDateFormatted, size: "2.4 MB" },
      { name: "NVQ Level 4 Automobile Certificate", type: "PDF Document", date: joiningDateFormatted, size: "3.1 MB" },
    ],
    leaveBalances: employee.leaveBalances && employee.leaveBalances.length > 0
      ? employee.leaveBalances.map((lb: any) => ({
          type: lb.leaveType?.name || "Leave",
          total: Number(lb.allocatedDays),
          used: Number(lb.usedDays),
          remaining: Number(lb.allocatedDays) - Number(lb.usedDays),
          color: lb.leaveType?.name?.toLowerCase().includes("annual") ? "bg-blue-500" : lb.leaveType?.name?.toLowerCase().includes("casual") ? "bg-green-500" : "bg-purple-500"
        }))
      : [
          { type: "Annual Leave", total: 14, used: 4, remaining: 10, color: "bg-blue-500" },
          { type: "Casual Leave", total: 7, used: 2, remaining: 5, color: "bg-green-500" },
          { type: "Medical Leave", total: 7, used: 1, remaining: 6, color: "bg-purple-500" },
        ],
    attendanceHistory: employee.attendanceRecords && employee.attendanceRecords.length > 0
      ? employee.attendanceRecords.map((att: any) => {
          const dateStr = new Date(att.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
          return {
            date: dateStr,
            clockIn: "—",
            clockOut: "—",
            hours: att.hoursWorked ? `${att.hoursWorked} hrs` : "—",
            status: att.status.charAt(0).toUpperCase() + att.status.slice(1)
          };
        })
      : [
          { date: "Oct 27, 2023", clockIn: "08:15 AM", clockOut: "05:30 PM", hours: "9.25 hrs", status: "On Time" },
          { date: "Oct 26, 2023", clockIn: "08:18 AM", clockOut: "05:30 PM", hours: "9.2 hrs", status: "On Time" },
          { date: "Oct 25, 2023", clockIn: "08:42 AM", clockOut: "05:45 PM", hours: "9.05 hrs", status: "Late" },
          { date: "Oct 24, 2023", clockIn: "08:10 AM", clockOut: "05:30 PM", hours: "9.33 hrs", status: "On Time" },
        ],
  };

  const grossSalary = empDetails.basicSalary + empDetails.allowances;
  const netSalary = grossSalary - empDetails.epfEmployee;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/hr/employees" className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00184d] text-white font-bold text-lg flex items-center justify-center shadow-sm">
              {empDetails.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={e => updateEditForm("fullName", e.target.value)}
                      placeholder="Full Name"
                      className="px-3 py-1 border border-slate-200 rounded-lg text-lg font-bold text-slate-900 focus:outline-none focus:border-[#00184d]"
                    />
                    <select
                      value={editForm.status}
                      onChange={e => updateEditForm("status", e.target.value)}
                      className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{empDetails.name}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      employee.status === "active" ? "bg-green-100 text-green-700 border-green-200" :
                      employee.status === "inactive" ? "bg-slate-100 text-slate-700 border-slate-200" :
                      "bg-rose-100 text-rose-700 border-rose-200"
                    }`}>
                      {empDetails.status}
                    </span>
                  </>
                )}
              </div>
              <p className="text-slate-500 text-sm mt-1">{empDetails.role} • {empDetails.dept} (<span className="font-mono text-[#00184d] font-bold">{empDetails.id}</span>)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="px-4 py-2 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
              <Link
                href={`/hr/payroll/payslip/${empDetails.id.toLowerCase()}`}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <DollarSign size={18} />
                View Payslip
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <UserCheck size={16} className="text-[#00184d]" />
            Personal Details
          </h2>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">NIC / ID Number</label>
                <input
                  type="text"
                  value={editForm.nic}
                  onChange={e => updateEditForm("nic", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00184d]"
                />
                {validationErrors.nic && <p className="text-[10px] text-rose-600 mt-0.5">{validationErrors.nic}</p>}
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={e => updateEditForm("phone", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00184d]"
                />
                {validationErrors.phone && <p className="text-[10px] text-rose-600 mt-0.5">{validationErrors.phone}</p>}
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">Email Address</label>
                <input
                  type="text"
                  value={editForm.email}
                  onChange={e => updateEditForm("email", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00184d]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">Residential Address</label>
                <textarea
                  value={editForm.address}
                  onChange={e => updateEditForm("address", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00184d] resize-none"
                />
                {validationErrors.address && <p className="text-[10px] text-rose-600 mt-0.5">{validationErrors.address}</p>}
              </div>
            </div>
          ) : (
            <>
              <div>
                <span className="text-xs text-slate-400 block">NIC / ID Number</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{empDetails.nic}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Phone</span>
                <span className="font-medium text-slate-700 text-xs">{empDetails.phone}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Email Address</span>
                <span className="font-medium text-slate-700 text-xs">{empDetails.email}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Residential Address</span>
                <span className="text-xs text-slate-600">{empDetails.address}</span>
              </div>
            </>
          )}
        </div>

        {/* Position Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 size={16} className="text-[#00184d]" />
            Employment Position
          </h2>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">Designation</label>
                <input
                  type="text"
                  value={editForm.designation}
                  onChange={e => updateEditForm("designation", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00184d]"
                />
                {validationErrors.designation && <p className="text-[10px] text-rose-600 mt-0.5">{validationErrors.designation}</p>}
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">Department</label>
                <select
                  value={editForm.department}
                  onChange={e => updateEditForm("department", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-[#00184d]"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-bold uppercase">Joining Date</label>
                <input
                  type="date"
                  value={editForm.joiningDate}
                  onChange={e => updateEditForm("joiningDate", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00184d]"
                />
                {validationErrors.joiningDate && <p className="text-[10px] text-rose-600 mt-0.5">{validationErrors.joiningDate}</p>}
              </div>
            </div>
          ) : (
            <>
              <div>
                <span className="text-xs text-slate-400 block">Designation</span>
                <span className="font-semibold text-slate-800 text-sm">{empDetails.role}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Department</span>
                <span className="font-medium text-slate-700 text-xs">{empDetails.dept}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Joining Date</span>
                <span className="font-medium text-slate-700 text-xs">{empDetails.joiningDate}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Emergency Contact</span>
                <span className="text-xs text-slate-600">{empDetails.emergencyContact}</span>
              </div>
            </>
          )}
        </div>

        {/* Salary & EPF/ETF Structure */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <DollarSign size={16} className="text-[#00184d]" />
            Salary & EPF/ETF Structure
          </h2>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.payMonthly}
                    onChange={e => updateEditForm("payMonthly", e.target.checked)}
                    className="accent-[#00184d]"
                  />
                  Monthly Basis
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.payDaily}
                    onChange={e => updateEditForm("payDaily", e.target.checked)}
                    className="accent-[#00184d]"
                  />
                  Daily Basis
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.payHourly}
                    onChange={e => updateEditForm("payHourly", e.target.checked)}
                    className="accent-[#00184d]"
                  />
                  Hourly Basis
                </label>
                {validationErrors.payType && <p className="text-[10px] text-rose-600">{validationErrors.payType}</p>}
              </div>

              {editForm.payMonthly && (
                <>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-bold">BASIC SALARY (Rs.)</label>
                    <input
                      type="number"
                      value={editForm.basicSalary}
                      onChange={e => updateEditForm("basicSalary", e.target.value)}
                      className="w-full px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
                    />
                    {validationErrors.basicSalary && <p className="text-[10px] text-rose-600">{validationErrors.basicSalary}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-bold">FIXED ALLOWANCE (Rs.)</label>
                    <input
                      type="number"
                      value={editForm.fixedAllowances}
                      onChange={e => updateEditForm("fixedAllowances", e.target.value)}
                      className="w-full px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {editForm.payDaily && (
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold">DAILY RATE (Rs.)</label>
                  <input
                    type="number"
                    value={editForm.dailyAllowance}
                    onChange={e => updateEditForm("dailyAllowance", e.target.value)}
                    className="w-full px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
                  />
                  {validationErrors.dailyAllowance && <p className="text-[10px] text-rose-600">{validationErrors.dailyAllowance}</p>}
                </div>
              )}

              {editForm.payHourly && (
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold">HOURLY RATE (Rs.)</label>
                  <input
                    type="number"
                    value={editForm.hourlyRate}
                    onChange={e => updateEditForm("hourlyRate", e.target.value)}
                    className="w-full px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
                  />
                  {validationErrors.hourlyRate && <p className="text-[10px] text-rose-600">{validationErrors.hourlyRate}</p>}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Pay basis badges */}
              <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${empDetails.basicSalary > 0 ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"}`}>
                  Monthly Salary {empDetails.basicSalary > 0 ? "✓" : "—"}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${empDetails.dailyAllowance > 0 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                  Daily Pay {empDetails.dailyAllowance > 0 ? "✓" : "—"}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${empDetails.hourlyRate > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
                  Hourly Pay {empDetails.hourlyRate > 0 ? "✓" : "—"}
                </span>
              </div>

              {/* Earnings breakdown */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Earnings</p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Basic Salary (Monthly)</span>
                  <span className={`font-semibold ${empDetails.basicSalary > 0 ? "text-slate-800" : "text-slate-300"}`}>
                    {empDetails.basicSalary > 0 ? `Rs. ${empDetails.basicSalary.toLocaleString()}` : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Fixed Allowances</span>
                  <span className={`font-semibold ${empDetails.allowances > 0 ? "text-slate-800" : "text-slate-300"}`}>
                    {empDetails.allowances > 0 ? `Rs. ${empDetails.allowances.toLocaleString()}` : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Daily Rate</span>
                  <span className={`font-semibold ${empDetails.dailyAllowance > 0 ? "text-green-700" : "text-slate-300"}`}>
                    {empDetails.dailyAllowance > 0 ? `Rs. ${empDetails.dailyAllowance.toLocaleString()} / day` : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Hourly Rate</span>
                  <span className={`font-semibold ${empDetails.hourlyRate > 0 ? "text-blue-700" : "text-slate-300"}`}>
                    {empDetails.hourlyRate > 0 ? `Rs. ${empDetails.hourlyRate.toLocaleString()} / hr` : "Not set"}
                  </span>
                </div>
              </div>

              {/* EPF / ETF */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EPF / ETF (on Basic)</p>
                <div className="flex justify-between text-xs text-red-600">
                  <span>Employee EPF (8%)</span>
                  <span className="font-semibold">
                    {empDetails.basicSalary > 0 ? `-Rs. ${empDetails.epfEmployee.toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Employer EPF (12%)</span>
                  <span className="font-semibold">
                    {empDetails.basicSalary > 0 ? `Rs. ${empDetails.epfEmployer.toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Employer ETF (3%)</span>
                  <span className="font-semibold">
                    {empDetails.basicSalary > 0 ? `Rs. ${empDetails.etfEmployer.toLocaleString()}` : "—"}
                  </span>
                </div>
              </div>

              {/* Net Pay / Footer */}
              {empDetails.basicSalary > 0 ? (
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Estimated Net Pay</span>
                  <span className="text-base font-bold text-[#00184d]">Rs. {netSalary.toLocaleString()}</span>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>No salary configured — click <strong>Edit Profile</strong> to set up pay rates.</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("DOCS")}
            className={`px-5 py-3.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "DOCS" ? "border-[#00184d] text-[#00184d] bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Uploaded Documents ({empDetails.documents.length})
          </button>
          <button
            onClick={() => setActiveTab("LEAVE")}
            className={`px-5 py-3.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "LEAVE" ? "border-[#00184d] text-[#00184d] bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Leave Balances
          </button>
          <button
            onClick={() => setActiveTab("ATTENDANCE")}
            className={`px-5 py-3.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "ATTENDANCE" ? "border-[#00184d] text-[#00184d] bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Recent Attendance Log
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: DOCUMENTS */}
          {activeTab === "DOCS" && (
            <div className="space-y-3">
              {empDetails.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                      <p className="text-xs text-slate-400">Uploaded {doc.date} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-500 hover:text-[#00184d] hover:bg-slate-200 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: LEAVE BALANCES */}
          {activeTab === "LEAVE" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {empDetails.leaveBalances.map((lb, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
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
          )}

          {/* TAB 3: ATTENDANCE LOG */}
          {activeTab === "ATTENDANCE" && (
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
                  {empDetails.attendanceHistory.map((att, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-medium text-slate-800">{att.date}</td>
                      <td className="px-4 py-3 font-mono text-xs">{att.clockIn}</td>
                      <td className="px-4 py-3 font-mono text-xs">{att.clockOut}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}
