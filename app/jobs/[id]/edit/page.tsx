"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Car, User, Wrench, DollarSign, FileText } from "lucide-react";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const jobId = resolvedParams.id.toUpperCase();

  const [vehicleNumber, setVehicleNumber] = useState("CAB-4921");
  const [makeModel, setMakeModel] = useState("Toyota Prius (2018)");
  const [customerName, setCustomerName] = useState("John Smith");
  const [customerPhone, setCustomerPhone] = useState("+1 (555) 123-4567");
  const [assignedWorker, setAssignedWorker] = useState("Mike Ross (Lead Tech)");
  const [status, setStatus] = useState("Completed");
  const [notes, setNotes] = useState("Customer reported noise from front brake pads during heavy braking.");

  const [services, setServices] = useState([
    { id: 1, name: "Full Engine Oil Change (Synthetic 5W-30)", price: 6500 },
    { id: 2, name: "Brake Pad Inspection & Front Pad Replacement", price: 8500 },
    { id: 3, name: "Full Exterior Wash & Vacuum Detail", price: 2500 }
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
    router.push(`/jobs/${resolvedParams.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/jobs/${resolvedParams.id}`} className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Job Card ({jobId})</h1>
            <p className="text-slate-500 text-sm">Update service details, assigned technician, or job status.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-[#00184d] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Changes
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Vehicle Plate Number</label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Make & Model</label>
              <input
                type="text"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              />
            </div>
          </div>
        </div>

        {/* Assignment & Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Wrench size={20} className="text-[#00184d]" />
            Assignment & Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Technician</label>
              <select
                value={assignedWorker}
                onChange={(e) => setAssignedWorker(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
              >
                <option value="Mike Ross (Lead Tech)">Mike Ross (Lead Tech)</option>
                <option value="Alex Rivera (Senior Mechanic)">Alex Rivera (Senior Mechanic)</option>
                <option value="David Miller (Service Tech)">David Miller (Service Tech)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Status</label>
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
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={20} className="text-[#00184d]" />
            Services Performed
          </h2>

          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={service.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="text-xs font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(service.id, "name", e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d]"
                />
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                  <input
                    type="number"
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
              Add Service Item
            </button>
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Total Cost</span>
              <span className="text-xl font-bold text-[#00184d]">Rs. {totalEstimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">Diagnostic Notes / Remarks</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/20 focus:border-[#00184d] resize-none"
          ></textarea>
        </div>
      </form>
    </div>
  );
}
