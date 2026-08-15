"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Car, User, Calendar, Wrench, DollarSign, FileText } from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();

  const staffMembers = [
    { id: "staff-1", name: "Mike Ross (Lead Tech)" },
    { id: "staff-2", name: "Alex Rivera (Senior Mechanic)" },
    { id: "staff-3", name: "David Miller (Service Tech)" },
    { id: "staff-4", name: "James Carter (Electrical Specialist)" },
  ];

  const presetServices = [
    { name: "Full Engine Oil Change & Filter Replacement", price: 6500 },
    { name: "Brake Pad Inspection & Replacement", price: 8500 },
    { name: "Wheel Alignment & Balancing", price: 3500 },
    { name: "Full Interior & Exterior Car Wash & Detail", price: 2500 },
    { name: "Air Conditioner Filter & Gas Refill", price: 5000 },
    { name: "Battery Health Check & Charge", price: 2000 },
  ];

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [assignedWorker, setAssignedWorker] = useState("Mike Ross (Lead Tech)");
  const [status, setStatus] = useState("Pending");
  const [dateTimeIn, setDateTimeIn] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState("");

  const [services, setServices] = useState([
    { id: 1, name: "Full Engine Oil Change & Filter Replacement", price: 6500 },
    { id: 2, name: "Brake Pad Inspection & Replacement", price: 8500 }
  ]);

  const addServiceRow = () => {
    setServices([
      ...services,
      { id: Date.now(), name: "", price: 0 }
    ]);
  };

  const removeServiceRow = (id: number) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const updateService = (id: number, field: "name" | "price", value: string | number) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const totalEstimatedCost = services.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to jobs list or details page
    router.push("/jobs");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Job Card</h1>
            <p className="text-slate-500 text-sm">Log a new vehicle check-in and assign services to technicians.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-[#00184d] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save & Open Job Card
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle & Customer Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Car size={20} className="text-[#00184d]" />
            Vehicle & Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Vehicle Plate Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Car size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. CAB-4921 or K-9821"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all uppercase"
                />
              </div>
            </div>

            {/* Make / Model */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Vehicle Make & Model (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Toyota Prius (2018)"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all"
                />
              </div>
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +1 (555) 123-4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Assignment & Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Wrench size={20} className="text-[#00184d]" />
            Job Assignment & Check-In Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check in Date/Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date & Time In</label>
              <input
                type="datetime-local"
                value={dateTimeIn}
                onChange={(e) => setDateTimeIn(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              />
            </div>

            {/* Assigned Worker */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Technician</label>
              <select
                value={assignedWorker}
                onChange={(e) => setAssignedWorker(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              >
                {staffMembers.map(staff => (
                  <option key={staff.id} value={staff.name}>{staff.name}</option>
                ))}
              </select>
            </div>

            {/* Job Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-[#00184d]" />
              Services To Be Performed
            </h2>
            <div className="flex gap-2">
              {/* Preset Service Quick Add */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const preset = presetServices.find(p => p.name === e.target.value);
                    if (preset) {
                      setServices([...services, { id: Date.now(), name: preset.name, price: preset.price }]);
                    }
                    e.target.value = "";
                  }
                }}
                className="text-xs bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
              >
                <option value="">+ Quick Add Preset Service...</option>
                {presetServices.map((p, i) => (
                  <option key={i} value={p.name}>{p.name} (Rs. {p.price.toLocaleString()})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={service.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="text-xs font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                <input
                  type="text"
                  placeholder="Service description (e.g. Engine Oil Change)..."
                  value={service.name}
                  onChange={(e) => updateService(service.id, "name", e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
                />
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                  <input
                    type="number"
                    placeholder="Est. Cost"
                    min="0"
                    value={service.price}
                    onChange={(e) => updateService(service.id, "price", Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeServiceRow(service.id)}
                  disabled={services.length === 1}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={addServiceRow}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#00184d] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Another Service Item
            </button>

            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Estimated Total</span>
              <span className="text-xl font-bold text-[#00184d]">Rs. {totalEstimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">Special Instructions / Diagnostic Notes</label>
          <textarea
            rows={3}
            placeholder="Write any specific notes, customer requests, or vehicle damage observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] resize-none"
          ></textarea>
        </div>
      </form>
    </div>
  );
}
