"use client";

import { useState, useRef } from "react";
import { Upload, Building2, Phone, Mail, MapPin, Globe, FileText, Palette, Check, Image } from "lucide-react";

export default function CompanySettingsPage() {
  const [company, setCompany] = useState({
    name: "Perera Auto Service (Pvt) Ltd",
    reg: "PV 00124531",
    phone: "+94 11 234 5678",
    mobile: "+94 77 123 4567",
    email: "info@perereauto.lk",
    website: "www.perereauto.lk",
    address: "No. 45, Galle Road, Dehiwala, Colombo 10, Sri Lanka",
    vatNo: "VAT-123456789",
    primaryColor: "#00184d",
    accentColor: "#0059b3",
    currency: "LKR",
    invoiceNote: "Thank you for choosing Perera Auto Service. All vehicles are serviced with guaranteed workmanship.",
    invoiceTerms: "Payment is due within 14 days of invoice date. We accept cash, bank transfer, and card payments.",
  });

  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof company, v: string) => setCompany((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Update your business details, branding, and invoice letterhead.</p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-[#00184d] hover:bg-[#002470] text-white"
          }`}
        >
          {saved ? <><Check size={15} /> Saved!</> : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Company Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-[#00184d]" /> Business Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Company Name", key: "name", full: true },
                { label: "Registration No.", key: "reg" },
                { label: "VAT / Tax No.", key: "vatNo" },
              ].map((f) => (
                <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                  <input
                    value={company[f.key as keyof typeof company]}
                    onChange={(e) => set(f.key as keyof typeof company, e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Phone size={16} className="text-[#00184d]" /> Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Office Phone", key: "phone", icon: Phone },
                { label: "Mobile / WhatsApp", key: "mobile", icon: Phone },
                { label: "Email Address", key: "email", icon: Mail },
                { label: "Website", key: "website", icon: Globe },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                    <div className="relative">
                      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={company[f.key as keyof typeof company]}
                        onChange={(e) => set(f.key as keyof typeof company, e.target.value)}
                        className="w-full pl-8 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Business Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    value={company.address}
                    onChange={(e) => set("address", e.target.value)}
                    rows={2}
                    className="w-full pl-8 pr-3 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Letterhead */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[#00184d]" /> Invoice Letterhead Text
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Footer Note (shown on every invoice)</label>
                <textarea
                  value={company.invoiceNote}
                  onChange={(e) => set("invoiceNote", e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Payment Terms</label>
                <textarea
                  value={company.invoiceTerms}
                  onChange={(e) => set("invoiceTerms", e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Logo Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Image size={16} className="text-[#00184d]" /> Company Logo
            </h2>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-[#00184d] flex items-center justify-center text-white font-black text-lg shadow-md">PA</div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">Click to upload logo</p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG · Max 2MB · Recommended 200×200px</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
                <Upload size={13} /> Choose file
              </div>
            </div>
          </div>

          {/* Branding Colors */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Palette size={16} className="text-[#00184d]" /> Brand Colors
            </h2>
            <div className="space-y-4">
              {[
                { label: "Primary Color", key: "primaryColor", hint: "Used in headers, buttons, invoice headings" },
                { label: "Accent Color", key: "accentColor", hint: "Used in links and highlights" },
              ].map((c) => (
                <div key={c.key}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{c.label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={company[c.key as keyof typeof company]}
                      onChange={(e) => set(c.key as keyof typeof company, e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-mono text-slate-700">{company[c.key as keyof typeof company].toUpperCase()}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.hint}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-3">Currency</h2>
            <select
              value={company.currency}
              onChange={(e) => set("currency", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="LKR">LKR — Sri Lankan Rupee (Rs.)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
