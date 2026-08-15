"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User, Building2, DollarSign, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { createEmployee } from "@/utils/api/employees";

export default function CreateEmployeePage() {
  const router = useRouter();

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    nic: "",
    phone: "",
    email: "",
    address: "",
    designation: "Service Advisor",
    department: "Workshop",
    joiningDate: new Date().toISOString().split("T")[0],
    basicSalary: "",
    fixedAllowances: "0",
    dailyAllowance: "0",
    hourlyRate: "0",
    payMonthly: true,
    payDaily: false,
    payHourly: false,
  });

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setForm(p => ({ ...p, [field]: value }));
    // Clear field-specific error when modified
    if (errors[field]) {
      setErrors(p => {
        const copy = { ...p };
        delete copy[field];
        return copy;
      });
    }
    setGeneralError(null);
  };

  // Client-Side Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!form.nic.trim()) {
      newErrors.nic = "NIC / National ID Number is required";
    } else {
      const nicPattern = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
      if (!nicPattern.test(form.nic.trim())) {
        newErrors.nic = "Invalid NIC format. Old: 9 digits + V/X, New: 12 digits";
      }
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    }

    if (form.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email.trim())) {
        newErrors.email = "Invalid Email Address format";
      }
    }

    if (!form.address.trim()) {
      newErrors.address = "Residential Address is required";
    }

    if (!form.designation.trim()) {
      newErrors.designation = "Designation / Role is required";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!form.joiningDate) {
      newErrors.joiningDate = "Joining Date is required";
    } else {
      const selectedDate = new Date(form.joiningDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.joiningDate = "Joining Date cannot be in the future";
      }
    }

    if (!form.payMonthly && !form.payDaily && !form.payHourly) {
      newErrors.payType = "At least one salary/allowance setup option must be enabled";
    }

    if (form.payMonthly) {
      const salary = Number(form.basicSalary);
      if (!form.basicSalary || isNaN(salary) || salary <= 0) {
        newErrors.basicSalary = "Basic Salary is required and must be a positive number";
      }
      const fixedAllow = Number(form.fixedAllowances);
      if (isNaN(fixedAllow) || fixedAllow < 0) {
        newErrors.fixedAllowances = "Fixed Allowances cannot be negative";
      }
    }

    if (form.payDaily) {
      const dailyAllow = Number(form.dailyAllowance);
      if (!form.dailyAllowance || isNaN(dailyAllow) || dailyAllow <= 0) {
        newErrors.dailyAllowance = "Daily Allowance / Pay is required and must be a positive number";
      }
    }

    if (form.payHourly) {
      const hourly = Number(form.hourlyRate);
      if (!form.hourlyRate || isNaN(hourly) || hourly <= 0) {
        newErrors.hourlyRate = "Hourly Rate is required and must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError(null);
    setSuccessMsg(null);

    try {
      const response = await createEmployee({
        fullName: form.fullName.trim(),
        nic: form.nic.trim().toUpperCase(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim(),
        designation: form.designation.trim(),
        department: form.department.trim(),
        joiningDate: form.joiningDate,
        basicSalary: form.payMonthly ? (Number(form.basicSalary) || 0) : 0,
        fixedAllowances: form.payMonthly ? (Number(form.fixedAllowances) || 0) : 0,
        dailyAllowance: form.payDaily ? (Number(form.dailyAllowance) || 0) : 0,
        hourlyRate: form.payHourly ? (Number(form.hourlyRate) || 0) : 0,
      });

      setSuccessMsg(`Employee profile successfully created! Generated ID: ${response.employeeCode}`);
      
      setTimeout(() => {
        router.push("/hr/employees");
      }, 2500);

    } catch (err: any) {
      if (err?.message && err.message.toLowerCase().includes("nic")) {
        setErrors(p => ({ ...p, nic: "An employee with this NIC already exists" }));
      } else {
        setGeneralError(err?.message ?? "An error occurred while creating the employee profile.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const basicNum = form.payMonthly ? (Number(form.basicSalary) || 0) : 0;
  const allowNum = form.payMonthly ? (Number(form.fixedAllowances) || 0) : 0;
  const epfEmp = (basicNum * 8) / 100;
  const netPay = basicNum + allowNum - epfEmp;

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/hr/employees" className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Employee</h1>
            <p className="text-slate-500 text-sm">Register a new staff member profile, designation, and salary structure.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[#00184d] hover:bg-blue-900 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Employee Profile
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {generalError && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-800 text-sm">
          <CheckCircle size={16} className="text-green-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Personal Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User size={18} className="text-[#00184d]" /> Personal Identification & Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kasun Jayasinghe"
              value={form.fullName}
              onChange={e => update("fullName", e.target.value)}
              className={`${inp} ${errors.fullName ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              NIC / National ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 940192849V or 199401902849"
              value={form.nic}
              onChange={e => update("nic", e.target.value)}
              className={`${inp} font-mono ${errors.nic ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            <p className="text-[11px] text-slate-400 mt-1">Old format: 9 digits + V/X, New format: 12 digits</p>
            {errors.nic && <p className="text-xs text-rose-600 mt-1">{errors.nic}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="+94 77 123 4567"
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
              className={`${inp} ${errors.phone ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="text"
              placeholder="kasun.j@autoservice.lk"
              value={form.email}
              onChange={e => update("email", e.target.value)}
              className={`${inp} ${errors.email ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Residential Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="House address, street, city..."
              value={form.address}
              onChange={e => update("address", e.target.value)}
              rows={3}
              className={`${inp} resize-none ${errors.address ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
          </div>
        </div>
      </div>

      {/* Designation & Department */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 size={18} className="text-[#00184d]" /> Designation & Employment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Designation / Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Technician"
              value={form.designation}
              onChange={e => update("designation", e.target.value)}
              className={`${inp} ${errors.designation ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            {errors.designation && <p className="text-xs text-rose-600 mt-1">{errors.designation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={form.department}
              onChange={e => update("department", e.target.value)}
              className={`${inp} ${errors.department ? "border-rose-400 focus:ring-rose-200" : ""}`}
            >
              <option value="Workshop">Workshop</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Administration">Administration</option>
            </select>
            {errors.department && <p className="text-xs text-rose-600 mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.joiningDate}
              onChange={e => update("joiningDate", e.target.value)}
              className={`${inp} ${errors.joiningDate ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
            />
            {errors.joiningDate && <p className="text-xs text-rose-600 mt-1">{errors.joiningDate}</p>}
          </div>
        </div>
      </div>

      {/* Salary & Setup */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <DollarSign size={18} className="text-[#00184d]" /> Salary & Allowances Setup
        </h2>

        {/* Checkbox options for enabling pay methods */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Active Pay Bases</span>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.payMonthly}
                onChange={e => update("payMonthly", e.target.checked)}
                className="w-4.5 h-4.5 accent-[#00184d] rounded-md"
              />
              Monthly Basic & Allowances
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.payDaily}
                onChange={e => update("payDaily", e.target.checked)}
                className="w-4.5 h-4.5 accent-[#00184d] rounded-md"
              />
              Daily Pay / Daily Allowance
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.payHourly}
                onChange={e => update("payHourly", e.target.checked)}
                className="w-4.5 h-4.5 accent-[#00184d] rounded-md"
              />
              Hourly Rate / Hourly Pay
            </label>
          </div>
          {errors.payType && <p className="text-xs text-rose-600 mt-1">{errors.payType}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {form.payMonthly && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Basic Salary (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 95000"
                  value={form.basicSalary}
                  onChange={e => update("basicSalary", e.target.value)}
                  className={`${inp} ${errors.basicSalary ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
                />
                {errors.basicSalary && <p className="text-xs text-rose-600 mt-1">{errors.basicSalary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Allowances (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 15000"
                  value={form.fixedAllowances}
                  onChange={e => update("fixedAllowances", e.target.value)}
                  className={`${inp} ${errors.fixedAllowances ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
                />
                {errors.fixedAllowances && <p className="text-xs text-rose-600 mt-1">{errors.fixedAllowances}</p>}
              </div>
            </>
          )}

          {form.payDaily && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Daily Pay / Allowance (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2500"
                value={form.dailyAllowance}
                onChange={e => update("dailyAllowance", e.target.value)}
                className={`${inp} ${errors.dailyAllowance ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
              />
              <p className="text-[11px] text-slate-400 mt-1">Per-day rate used in payroll calculations</p>
              {errors.dailyAllowance && <p className="text-xs text-rose-600 mt-1">{errors.dailyAllowance}</p>}
            </div>
          )}

          {form.payHourly && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hourly Rate / Pay (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 450"
                value={form.hourlyRate}
                onChange={e => update("hourlyRate", e.target.value)}
                className={`${inp} ${errors.hourlyRate ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500" : ""}`}
              />
              <p className="text-[11px] text-slate-400 mt-1">Hourly rate used for timesheet calculations</p>
              {errors.hourlyRate && <p className="text-xs text-rose-600 mt-1">{errors.hourlyRate}</p>}
            </div>
          )}

          {form.payMonthly && basicNum > 0 && (
            <div className="md:col-span-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Calculated EPF Employee Deduction (8%):</span>
                <span className="font-bold text-red-600">-Rs. {epfEmp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-sm">
                <span>Estimated Net Take-Home Monthly Salary:</span>
                <span className="text-[#00184d]">Rs. {netPay.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

const inp = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] font-medium text-slate-800";
