"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import OwnerLayout from "@/components/OwnerLayout";
import {
  ArrowLeft, Building2, Globe, Phone, Mail, MapPin, Shield,
  Check, Loader2, AlertCircle, Camera, FileText, Package,
  Wrench, Users, ShoppingCart, BarChart2, Archive,
} from "lucide-react";
import {
  getBusiness,
  updateBusiness,
  deleteBusiness,
  uploadBusinessLogo,
  listAvailableModules,
  installModule,
  Business,
  Module,
} from "@/utils/api/business";

const moduleIconMap: Record<string, any> = {
  "Job Cards": Wrench,
  "Invoicing": FileText,
  "Stock Management": Package,
  "Purchase Orders": ShoppingCart,
  "HR & Payroll": Users,
  "Reports": BarChart2,
};

import React from "react";

type Tab = "Details" | "Modules" | "Danger";

const COUNTRIES = [
  "", "Sri Lanka", "India", "United Kingdom", "United States", "Australia",
  "Canada", "Germany", "Singapore", "UAE", "Other"
];

const STATUS_OPTS = [
  { value: "ACTIVE",    label: "Active",    color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "INACTIVE",  label: "Inactive",  color: "text-slate-600 bg-slate-50 border-slate-200" },
  { value: "SUSPENDED", label: "Suspended", color: "text-rose-700 bg-rose-50 border-rose-200" },
];

export default function BusinessSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: businessId } = React.use(params);

  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [business, setBusiness] = useState<Business | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable form fields
  const [name, setName]       = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState]     = useState("");
  const [phone, setPhone]     = useState("");
  const [mobile, setMobile]   = useState("");
  const [web, setWeb]         = useState("");
  const [email, setEmail]     = useState("");
  const [vatId, setVatId]     = useState("");
  const [status, setStatus]   = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">("ACTIVE");

  // Logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);


  // Load business on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [biz, mods] = await Promise.all([
          getBusiness(businessId),
          listAvailableModules(),
        ]);
        setBusiness(biz);
        setAvailableModules(mods);
        // Populate form
        setName(biz.name ?? "");
        setAddress(biz.address ?? "");
        setZipCode(biz.zipCode ?? "");
        setCountry(biz.country ?? "");
        setState(biz.state ?? "");
        setPhone(biz.phone ?? "");
        setMobile(biz.mobile ?? "");
        setWeb(biz.web ?? "");
        setEmail(biz.email ?? "");
        setVatId(biz.vatId ?? "");
        setStatus((biz.status as any) ?? "ACTIVE");
        setLogoPreview(biz.logoUrl ?? null);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load business details.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [businessId]);

  const executeDelete = async () => {
    setShowDeleteModal(false);
    setError(null);
    setIsDeleting(true);
    try {
      await deleteBusiness(businessId);
      window.location.href = "/owner";
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete business.");
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const updated = await updateBusiness(businessId, {
        name, address, zipCode, country, state,
        phone, mobile, web, email, vatId, status,
      });
      setBusiness(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    setError(null);
    try {
      setLogoPreview(URL.createObjectURL(file));
      const updated = await uploadBusinessLogo(businessId, file);
      setBusiness(prev => prev ? { ...prev, logoUrl: updated.logoUrl } : prev);
      setLogoPreview(updated.logoUrl ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Logo upload failed.");
      setLogoPreview(business?.logoUrl ?? null);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const installedModuleIds = business?.businessModules
    ?.filter(bm => bm.isActive)
    .map(bm => bm.moduleId) ?? [];

  // Derived initials
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "BZ";
  const statusObj = STATUS_OPTS.find(s => s.value === status) ?? STATUS_OPTS[0];

  // ── Input class ─────────────────────────────────────────────────────────────
  const input = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white";

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href={`/owner/businesses/${businessId}`} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight truncate">{name || "Business Settings"}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage details, modules, and configuration.</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusObj.color}`}>
            {statusObj.label}
          </span>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {(["Details", "Modules", "Danger"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
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

          {/* ── DETAILS TAB ─────────────────────────────────────────────────── */}
          {activeTab === "Details" && (
            <div className="space-y-8">
              {/* Logo + Business Name Row */}
              <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                <div className="relative">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00184d] to-[#0059b3] flex items-center justify-center text-white font-black text-2xl shadow-md overflow-hidden border border-slate-200 cursor-pointer group"
                  >
                    {isUploadingLogo ? (
                      <Loader2 size={22} className="animate-spin text-white/70" />
                    ) : logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="group-hover:opacity-0 transition-opacity absolute">{initials}</span>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Business Name <span className="text-rose-500">*</span></label>
                  <input value={name} onChange={e => setName(e.target.value)} className={input} placeholder="e.g. Perera Auto Service" />
                  <p className="text-xs text-slate-400 mt-1.5">Click the logo to upload a new image.</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                  <Phone size={14} className="text-slate-400" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className={input} placeholder="+94 11 000 0000" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Mobile Number</label>
                    <input value={mobile} onChange={e => setMobile(e.target.value)} className={input} placeholder="+94 77 000 0000" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={input} placeholder="contact@business.lk" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Website</label>
                    <input value={web} onChange={e => setWeb(e.target.value)} className={input} placeholder="https://www.business.lk" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                  <MapPin size={14} className="text-slate-400" /> Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Street Address</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} className={input} placeholder="No. 15, Galle Road" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">City / State / Province</label>
                    <input value={state} onChange={e => setState(e.target.value)} className={input} placeholder="Colombo" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Zip / Postal Code</label>
                    <input value={zipCode} onChange={e => setZipCode(e.target.value)} className={input} placeholder="00300" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Country</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className={input}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c || "— Select country —"}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Business & Tax */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                  <Globe size={14} className="text-slate-400" /> Business & Tax
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">VAT ID / Tax Number</label>
                    <input value={vatId} onChange={e => setVatId(e.target.value)} className={input} placeholder="VAT-000-000-000" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Business Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className={input}>
                      {STATUS_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">Changes are saved to the database immediately.</p>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#00184d] hover:bg-[#002470] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm disabled:opacity-60"
                >
                  {isSaving ? (
                    <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  ) : saved ? (
                    <><Check size={15} /> Saved!</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── MODULES TAB ─────────────────────────────────────────────────── */}
          {activeTab === "Modules" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Installed Modules</h2>
                <p className="text-xs text-slate-400 mt-0.5">These modules are currently active for this business workspace.</p>
              </div>
              {availableModules.length === 0 ? (
                <p className="text-sm text-slate-400">No modules available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableModules.map(mod => {
                    const Icon = moduleIconMap[mod.name] ?? Building2;
                    const isInstalled = installedModuleIds.includes(mod.id);
                    return (
                      <div key={mod.id} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                        isInstalled ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-100"
                      }`}>
                        <div className={`p-2 rounded-xl shrink-0 ${isInstalled ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-100"}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${isInstalled ? "text-blue-900" : "text-slate-600"}`}>{mod.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                        </div>
                        {isInstalled && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">Active</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-slate-400 pt-2">To install/uninstall modules, contact the platform administrator or use the API.</p>
            </div>
          )}

          {/* ── DANGER TAB ──────────────────────────────────────────────────── */}
          {activeTab === "Danger" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Danger Zone</h2>
                <p className="text-xs text-slate-400 mt-0.5">Irreversible actions for this business workspace.</p>
              </div>
              <div className="border border-rose-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Deactivate Business</p>
                  <p className="text-xs text-slate-500 mt-0.5">Set this business to Inactive. Staff will lose access until reactivated.</p>
                </div>
                <button
                  onClick={() => { setStatus("INACTIVE"); handleSave(); }}
                  className="shrink-0 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition-colors"
                >
                  Deactivate
                </button>
              </div>
              <div className="border border-rose-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Delete Business</p>
                  <p className="text-xs text-slate-500 mt-0.5">Permanently delete this workspace and all its data. This cannot be undone.</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className="shrink-0 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CUSTOM DELETE CONFIRMATION MODAL ────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
                <Archive size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900">Delete Business?</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete this business? It will be marked for deletion and permanently removed after <span className="font-bold text-rose-600">60 days</span>.
                </p>
                <p className="text-sm text-slate-500">
                  You can safely restore it from your dashboard during this time.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm shadow-rose-600/20 transition-all hover:-translate-y-0.5"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
