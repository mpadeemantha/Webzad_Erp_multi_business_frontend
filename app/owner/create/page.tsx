"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OwnerLayout from "@/components/OwnerLayout";
import {
  ArrowLeft, Building2, LayoutGrid, Users, Check, ShoppingCart,
  Package, FileText, Wrench, ChevronRight, Camera, Loader2, ImageIcon, AlertCircle,
} from "lucide-react";
import {
  createBusiness,
  uploadBusinessLogo,
  listAvailableModules,
  installModule,
} from "@/utils/api/business";

const moduleOptions = [
  { code: "jobs",    name: "Job Cards",        desc: "Log vehicle details, assign staff, and track job status to completion", icon: Wrench },
  { code: "invoice", name: "Invoicing",         desc: "Manage billing, customers, payments, and view financial reports", icon: FileText },
  { code: "stock",   name: "Stock Management",  desc: "Overview stock levels, supplier records, and inventory transfers", icon: Package },
  { code: "po",      name: "Purchase Orders",   desc: "Order stock from suppliers, calculate tax, and check order status", icon: ShoppingCart },
  { code: "hr",      name: "HR & Payroll",      desc: "Manage staff profiles, track attendance, run monthly basic payroll", icon: Users },
];

export default function CreateNewBusinessPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("Car Service");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [web, setWeb] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [vatId, setVatId] = useState("");

  // Logo upload state (replaces logo initials)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [selectedModules, setSelectedModules] = useState<string[]>(["jobs", "invoice", "stock"]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBusiness, setCreatedBusiness] = useState<{ id: string; name: string } | null>(null);

  const toggleModule = (code: string) => {
    setSelectedModules(prev =>
      prev.includes(code) ? prev.filter(m => m !== code) : [...prev, code]
    );
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleNext = () => { if (step < 4) setStep(prev => prev + 1); };
  const handleBack = () => { if (step > 1) setStep(prev => prev - 1); };

  const handleCreate = async () => {
    setError(null);
    setIsCreating(true);
    try {
      // Step 1: Create business
      const business = await createBusiness({
        name: businessName,
        address: address || undefined,
        zipCode: zipCode || undefined,
        country: country || undefined,
        state: state || undefined,
        phone: phone || undefined,
        mobile: mobile || undefined,
        web: web || undefined,
        email: email || undefined,
        vatId: vatId || undefined,
        status: "ACTIVE",
      });

      // Step 2: Upload logo if provided
      if (logoFile) {
        await uploadBusinessLogo(business.id, logoFile);
      }

      // Step 3: Install selected modules
      if (selectedModules.length > 0) {
        // Fetch real module UUIDs from the backend and match by code
        const availableModules = await listAvailableModules();
        for (const code of selectedModules) {
          const mod = availableModules.find(
            m => m.code === code || m.name.toLowerCase().includes(code)
          );
          if (mod) {
            try {
              await installModule(business.id, mod.id);
            } catch {
              // Non-fatal: skip if module install fails
            }
          }
        }
      }

      setCreatedBusiness({ id: business.id, name: business.name });
    } catch (err: any) {
      setError(err?.message ?? "Failed to create business. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (createdBusiness) {
    return (
      <OwnerLayout>
        <div className="max-w-md mx-auto text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Check size={32} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Created!</h1>
            <p className="text-slate-500 text-sm mt-2">
              <strong>{createdBusiness.name}</strong> has been initialized successfully.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-600">
            <p><strong>Workspace Name:</strong> {createdBusiness.name}</p>
            <p><strong>Industry:</strong> {industry}</p>
            <p><strong>Installed Modules:</strong> {selectedModules.map(c => moduleOptions.find(m => m.code === c)?.name).filter(Boolean).join(", ")}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/owner")}
              className="w-full bg-[#00184d] hover:bg-[#002470] text-white font-bold py-3 rounded-xl text-sm shadow-sm transition-all"
            >
              Back to My Businesses
            </button>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  // ── Derived initials for preview ────────────────────────────────────────────
  const logoInitials = businessName
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "NB";

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex items-center gap-3">
          <Link href="/owner" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Business</h1>
            <p className="text-slate-500 text-sm mt-0.5">Initialize a brand new business workspace with custom modules.</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
          {[
            { step: 1, label: "Business Details" },
            { step: 2, label: "Module Selection" },
            { step: 3, label: "Assign Admin" },
            { step: 4, label: "Review & Confirm" },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.step
                  ? "bg-[#00184d] text-white shadow"
                  : step > s.step
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}>
                {step > s.step ? <Check size={14} /> : s.step}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.step ? "text-slate-800" : "text-slate-400"}`}>
                {s.label}
              </span>
              {s.step < 4 && <ChevronRight size={14} className="text-slate-300 hidden sm:block" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
          {/* Global error */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Step 1: Details ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Business details</h2>
                <p className="text-xs text-slate-400 mt-0.5">Provide general information about the new business workspace.</p>
              </div>

              {/* Logo Upload Widget */}
              <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
                <div className="relative">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00184d] to-[#0059b3] flex items-center justify-center text-white font-black text-2xl shadow-md overflow-hidden border border-slate-200 cursor-pointer group"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="group-hover:opacity-0 transition-opacity absolute">{logoInitials}</span>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Business Logo</p>
                  <p className="text-xs text-slate-400 mt-0.5">Upload a square image (JPG, PNG, max 2MB)</p>
                  {logoPreview ? (
                    <button
                      onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                      className="mt-2 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                    >
                      Remove logo
                    </button>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="mt-2 text-xs text-[#00184d] hover:text-[#002470] font-semibold transition-colors"
                    >
                      Upload logo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Business Name <span className="text-rose-500">*</span></label>
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Perera Auto Service"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Industry / Type</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option>Car Service</option>
                    <option>Retail Store</option>
                    <option>Restaurant</option>
                    <option>Warehouse & Logistics</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 11 000 0000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Mobile Number</label>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+94 77 000 0000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@business.lk"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Website</label>
                  <input
                    value={web}
                    onChange={(e) => setWeb(e.target.value)}
                    placeholder="https://www.business.lk"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Business Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. No. 15, Galle Road"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">City / State / Province</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Colombo"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Zip / Postal Code</label>
                  <input
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="00300"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">— Select country —</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Singapore">Singapore</option>
                    <option value="UAE">UAE</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">VAT ID / Tax Number</label>
                  <input
                    value={vatId}
                    onChange={(e) => setVatId(e.target.value)}
                    placeholder="VAT-000-000-000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Modules ─────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Module installation</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select modules to be pre-installed and available in the workspace sidebar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleOptions.map((m) => {
                  const Icon = m.icon;
                  const isChecked = selectedModules.includes(m.code);
                  return (
                    <button
                      key={m.code}
                      onClick={() => toggleModule(m.code)}
                      className={`flex gap-4 p-4 rounded-2xl border text-left transition-all ${
                        isChecked
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-slate-50 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${isChecked ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-100"}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isChecked ? "text-blue-900" : "text-slate-700"}`}>{m.name}</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Admin ───────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Assign Admin</h2>
                <p className="text-xs text-slate-400 mt-0.5">Create the primary administrator account for this business workspace.</p>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Admin user creation will be available in an upcoming update. You can create staff users from the business settings after the workspace is initialized.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50 pointer-events-none select-none">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Admin Full Name</label>
                  <input value={adminName} readOnly placeholder="e.g. John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Admin Email Address</label>
                  <input value={adminEmail} readOnly placeholder="admin@business.lk" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Temp Password</label>
                  <input type="password" value={adminPassword} readOnly placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Summary ─────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Review details</h2>
                <p className="text-xs text-slate-400 mt-0.5">Please review your setup before initializing the workspace.</p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl bg-slate-50/50">
                {/* Business preview */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{businessName || "Unnamed Business"}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{industry} {address ? `· ${address}` : ""}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#00184d] to-[#0059b3] flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm">{logoInitials}</span>
                    )}
                  </div>
                </div>

                <div className="p-4 text-xs space-y-1.5">
                  <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Selected Modules ({selectedModules.length})</p>
                  <p className="text-slate-700">
                    {selectedModules.map(c => moduleOptions.find(m => m.code === c)?.name).filter(Boolean).join(", ") || "None selected"}
                  </p>
                </div>

                <div className="p-4 text-xs space-y-1 text-slate-500 italic">
                  <p>Admin user can be assigned after workspace creation.</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1 || isCreating}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 && !businessName.trim()}
                className="bg-[#00184d] hover:bg-[#002470] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create Workspace"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
