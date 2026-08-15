"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OwnerLayout from "@/components/OwnerLayout";
import React from "react";
import {
  ArrowLeft, Building2, Users, Settings, Wrench, FileText,
  Package, ShoppingCart, BarChart2, Globe, Phone, Mail,
  MapPin, Loader2, AlertCircle, ChevronRight, Activity,
  TrendingUp, CheckCircle2, Clock, Boxes,
} from "lucide-react";
import { getBusiness, Business } from "@/utils/api/business";

// ── Module → icon + route + gradient ────────────────────────────────────────
const MODULE_META: Record<string, {
  icon: any;
  route: string;
  gradient: string;
  accent: string;
  description: string;
}> = {
  "Job Cards": {
    icon: Wrench,
    route: "/jobs",
    gradient: "from-blue-500 to-indigo-600",
    accent: "bg-blue-50 text-blue-700 border-blue-100",
    description: "Manage service jobs & job cards",
  },
  "Invoicing": {
    icon: FileText,
    route: "/invoicing",
    gradient: "from-emerald-500 to-teal-600",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
    description: "Create & manage invoices",
  },
  "Stock Management": {
    icon: Package,
    route: "/stock",
    gradient: "from-amber-500 to-orange-500",
    accent: "bg-amber-50 text-amber-700 border-amber-100",
    description: "Track inventory & stock levels",
  },
  "Purchase Orders": {
    icon: ShoppingCart,
    route: "/stock",
    gradient: "from-purple-500 to-violet-600",
    accent: "bg-purple-50 text-purple-700 border-purple-100",
    description: "Manage supplier purchase orders",
  },
  "HR & Payroll": {
    icon: Users,
    route: "/hr",
    gradient: "from-rose-500 to-pink-600",
    accent: "bg-rose-50 text-rose-700 border-rose-100",
    description: "Staff, attendance & payroll",
  },
  "Reports": {
    icon: BarChart2,
    route: "/jobs",
    gradient: "from-cyan-500 to-sky-600",
    accent: "bg-cyan-50 text-cyan-700 border-cyan-100",
    description: "Business reports & analytics",
  },
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE:  "bg-slate-100 text-slate-600 border-slate-200",
  SUSPENDED: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function BusinessDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: businessId } = React.use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBusiness(businessId)
      .then(setBusiness)
      .catch((e: any) => setError(e?.message ?? "Failed to load business."))
      .finally(() => setIsLoading(false));
  }, [businessId]);

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-slate-300" />
        </div>
      </OwnerLayout>
    );
  }

  if (error || !business) {
    return (
      <OwnerLayout>
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{error ?? "Business not found."}</span>
        </div>
      </OwnerLayout>
    );
  }

  const activeModules = business.businessModules?.filter(bm => bm.isActive) ?? [];
  const staffCount = business._count?.users ?? 0;
  const moduleCount = activeModules.length;
  const initials = business.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "BZ";
  const statusStyle = STATUS_STYLES[business.status ?? "ACTIVE"] ?? STATUS_STYLES["ACTIVE"];

  return (
    <OwnerLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-4">
          <Link
            href="/owner"
            className="mt-1 p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex-1 min-w-0 flex items-center gap-4">
            {/* Logo / Initials */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00184d] to-[#0059b3] flex items-center justify-center text-white font-black text-xl shadow-md overflow-hidden shrink-0 border border-white/10">
              {business.logoUrl
                ? <img src={business.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                : initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight truncate">{business.name}</h1>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyle}`}>
                  {business.status ?? "ACTIVE"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {business.address && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={11} /> {business.address}{business.state ? `, ${business.state}` : ""}
                  </span>
                )}
                {business.phone && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={11} /> {business.phone}
                  </span>
                )}
                {business.email && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Mail size={11} /> {business.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Settings button */}
          <Link
            href={`/owner/businesses/${businessId}/settings`}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold transition-all"
          >
            <Settings size={15} />
            Settings
          </Link>
        </div>

        {/* ── KPI Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Active Modules",
              value: moduleCount,
              icon: Boxes,
              color: "from-blue-500 to-indigo-600",
              bg: "bg-blue-50",
              text: "text-blue-700",
            },
            {
              label: "Total Staff",
              value: staffCount,
              icon: Users,
              color: "from-emerald-500 to-teal-600",
              bg: "bg-emerald-50",
              text: "text-emerald-700",
            },
            {
              label: "Status",
              value: business.status ?? "ACTIVE",
              icon: CheckCircle2,
              color: "from-amber-500 to-orange-500",
              bg: "bg-amber-50",
              text: "text-amber-700",
            },
            {
              label: "Member Since",
              value: new Date(business.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
              icon: Clock,
              color: "from-purple-500 to-violet-600",
              bg: "bg-purple-50",
              text: "text-purple-700",
            },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-sm`}>
                <kpi.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{kpi.label}</p>
                <p className="text-xl font-black text-slate-800 mt-0.5 leading-tight">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Installed Modules (Quick Launch) ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Quick Launch</h2>
              <p className="text-xs text-slate-400 mt-0.5">Open a module to start working</p>
            </div>
            <Link
              href={`/owner/businesses/${businessId}/settings`}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Manage modules <ChevronRight size={12} />
            </Link>
          </div>

          {activeModules.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <Boxes size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-600">No modules installed</p>
              <p className="text-sm text-slate-400 mt-1">Go to Settings → Modules to install modules for this business.</p>
              <Link
                href={`/owner/businesses/${businessId}/settings`}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00184d] text-white text-sm font-bold hover:bg-[#002470] transition-colors"
              >
                <Settings size={14} /> Open Settings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeModules.map((bm) => {
                const modName = bm.module.name;
                const meta = MODULE_META[modName] ?? {
                  icon: Activity,
                  route: "/",
                  gradient: "from-slate-500 to-slate-700",
                  accent: "bg-slate-50 text-slate-700 border-slate-100",
                  description: bm.module.description ?? "",
                };
                const Icon = meta.icon;

                return (
                  <Link
                    key={bm.id}
                    href={meta.route}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    {/* Gradient top bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} />
                    <div className="p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-sm shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{modName}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{meta.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Business Info Card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" /> Business Info
            </h2>
            <Link
              href={`/owner/businesses/${businessId}/settings`}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Edit <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            {[
              { icon: Phone,   label: "Phone",   value: business.phone   },
              { icon: Phone,   label: "Mobile",  value: business.mobile  },
              { icon: Mail,    label: "Email",   value: business.email   },
              { icon: Globe,   label: "Website", value: business.web     },
              { icon: MapPin,  label: "Address", value: [business.address, business.state, business.country].filter(Boolean).join(", ") },
              { icon: TrendingUp, label: "VAT / Tax", value: business.vatId },
            ].map(({ icon: Icon, label, value }) =>
              value ? (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 shrink-0 mt-0.5">
                    <Icon size={13} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-slate-700 font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>

      </div>
    </OwnerLayout>
  );
}
