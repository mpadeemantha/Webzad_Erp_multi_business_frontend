"use client";

import { useState, useEffect } from "react";
import OwnerLayout from "@/components/OwnerLayout";
import Link from "next/link";
import {
  PlusCircle, Building2, Wrench, FileText, Package, Users, ShoppingCart,
  BarChart2, Settings, ExternalLink, MoreHorizontal, TrendingUp,
  CheckCircle, XCircle, Archive, ChevronRight, Phone, Loader2,
} from "lucide-react";
import { getMeProfile, OwnerProfile } from "@/utils/api/auth";
import { listBusinesses, restoreBusiness, Business } from "@/utils/api/business";

const moduleIconMap: Record<string, any> = {
  "Job Cards": Wrench,
  "Invoicing": FileText,
  "Stock Management": Package,
  "Purchase Orders": ShoppingCart,
  "HR & Payroll": Users,
  "Reports": BarChart2,
};

// Derive 2-letter initials from a business name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BZ";
}

// Stable gradient per business (cycles through palette)
const gradients = [
  "from-[#00184d] to-[#0059b3]",
  "from-emerald-600 to-teal-700",
  "from-violet-600 to-purple-700",
  "from-rose-600 to-red-700",
  "from-amber-500 to-orange-600",
  "from-slate-500 to-slate-700",
];

export default function OwnerHomePage() {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
  const [restoreTargetId, setRestoreTargetId] = useState<string | null>(null);

  // ── Load profile ────────────────────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      const cached = localStorage.getItem("ownerProfile");
      if (cached) {
        setProfile(JSON.parse(cached));
        setIsLoadingProfile(false);
        return;
      }
      const p = await getMeProfile();
      const nameParts = p.name ? p.name.split(" ") : [];
      const derived: OwnerProfile = {
        ...p,
        firstName: p.firstName || nameParts[0] || "",
        lastName: p.lastName || nameParts.slice(1).join(" ") || "",
        phone: p.phone || "",
      };
      setProfile(derived);
      localStorage.setItem("ownerProfile", JSON.stringify(derived));
    } catch {
      // Silently fallback
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // ── Load businesses ─────────────────────────────────────────────────────────
  const loadBusinesses = async () => {
    try {
      const data = await listBusinesses();
      const sorted = data.sort((a, b) => {
        const aDeleted = !!a.deletedAt;
        const bDeleted = !!b.deletedAt;
        if (aDeleted && !bDeleted) return 1;
        if (!aDeleted && bDeleted) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setBusinesses(sorted);
    } catch {
      setBusinesses([]);
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadBusinesses();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ownerProfile" && e.newValue) {
        setProfile(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleRestore = async (id: string) => {
    setRestoreTargetId(null);
    try {
      await restoreBusiness(id);
      await loadBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to restore business.");
    }
  };

  // ── KPI derivations ─────────────────────────────────────────────────────────
  const activeCount = businesses.length; // All DB-returned businesses count as active for now
  const totalUsers = businesses.reduce((sum, b) => sum + (b._count?.users ?? 0), 0);
  const totalModules = new Set(
    businesses.flatMap(b => b.businessModules?.map(bm => bm.moduleId) ?? [])
  ).size;

  return (
    <OwnerLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            {isLoadingProfile ? (
              <div className="space-y-2.5">
                <div className="h-9 w-64 bg-slate-200 animate-pulse rounded-lg" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Welcome back, {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1.5">
                  <span>{activeCount} {activeCount === 1 ? "business" : "businesses"} · Owner Portal</span>
                  {profile?.phone && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {profile.phone}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
          <Link
            href="/owner/create"
            className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-[#002470] text-white font-bold px-5 py-3 rounded-2xl text-sm shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 self-start md:self-center"
          >
            <PlusCircle size={17} />
            Create New Business
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Businesses", value: businesses.length, icon: Building2, color: "bg-blue-50 text-blue-600" },
            { label: "Active", value: activeCount, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
            { label: "Total Staff", value: totalUsers, icon: Users, color: "bg-purple-50 text-purple-600" },
            { label: "Modules in Use", value: totalModules, icon: BarChart2, color: "bg-amber-50 text-amber-600" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${k.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  {isLoadingBusinesses ? (
                    <div className="h-7 w-10 bg-slate-200 animate-pulse rounded mb-1" />
                  ) : (
                    <p className="text-2xl font-black text-slate-900">{k.value}</p>
                  )}
                  <p className="text-xs text-slate-500">{k.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Loading skeletons */}
          {isLoadingBusinesses && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
              <div className="h-32 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}

          {/* Real business cards */}
          {!isLoadingBusinesses && businesses.map((biz, idx) => {
            const gradient = gradients[idx % gradients.length];
            const initials = getInitials(biz.name);
            const modules = biz.businessModules?.filter(bm => bm.isActive).map(bm => bm.module.name) ?? [];
            const userCount = biz._count?.users ?? 0;
            const isDeleted = !!biz.deletedAt;
            const deletedDate = isDeleted ? new Date(biz.deletedAt!) : null;
            const daysRemaining = deletedDate ? Math.max(0, 60 - Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24))) : 0;

            return (
              <div
                key={biz.id}
                className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 group ${isDeleted ? 'opacity-80' : 'hover:shadow-xl'}`}
              >
                {/* Card Top Banner */}
                <div className={`bg-gradient-to-br ${isDeleted ? 'from-rose-800 to-rose-950' : gradient} px-5 py-6 relative overflow-hidden`}>
                  <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-4 -right-2 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-black text-base shadow-lg overflow-hidden ${isDeleted ? 'grayscale' : ''}`}>
                        {biz.logoUrl ? (
                          <img src={biz.logoUrl} alt={biz.name} className="w-full h-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div>
                        <h2 className="font-black text-white text-sm leading-tight">{biz.name}</h2>
                        <p className="text-white/60 text-xs mt-0.5">{biz.address || "No address set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isDeleted ? (
                        <span className="flex items-center gap-1 bg-rose-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-rose-400/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Pending Deletion
                        </span>
                      ) : (
                        <>
                          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/30">
                            <span className={`w-1.5 h-1.5 rounded-full ${(!biz.status || biz.status === "ACTIVE") ? "bg-emerald-300" : biz.status === "SUSPENDED" ? "bg-amber-300" : "bg-rose-300"}`} />
                            {(!biz.status || biz.status === "ACTIVE") ? "Active" : biz.status === "SUSPENDED" ? "Suspended" : "Inactive"}
                          </span>
                          <Link
                            href={`/owner/businesses/${biz.id}`}
                            className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                          >
                            <Settings size={14} />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {isDeleted ? (
                    <div className="flex flex-col items-center justify-center py-4 text-center space-y-3">
                      <Archive className="text-rose-500 opacity-50" size={32} />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Scheduled for Deletion</p>
                        <p className="text-xs text-slate-500 mt-1">
                          This business will be permanently removed in <span className="font-bold text-rose-600">{daysRemaining} days</span>.
                        </p>
                      </div>
                      <button
                        onClick={() => setRestoreTargetId(biz.id)}
                        className="mt-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Restore Business
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-slate-50 rounded-xl py-2">
                          <p className="text-base font-black text-slate-800">{modules.length}</p>
                          <p className="text-[10px] text-slate-400">Modules</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl py-2">
                          <p className="text-base font-black text-slate-800">{userCount}</p>
                          <p className="text-[10px] text-slate-400">Staff</p>
                        </div>
                      </div>

                      {/* Modules */}
                      {modules.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Installed Modules</p>
                          <div className="flex flex-wrap gap-1.5">
                            {modules.map((mod) => {
                              const ModIcon = moduleIconMap[mod];
                              return (
                                <span key={mod} className="flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] font-medium px-2 py-1 rounded-md border border-slate-100">
                                  {ModIcon && <ModIcon size={10} className="text-slate-400" />} {mod}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Created at */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <TrendingUp size={10} />
                        Created {new Date(biz.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/owner/businesses/${biz.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all bg-[#00184d] hover:bg-[#002470] text-white shadow-sm hover:shadow-md"
                      >
                        <ExternalLink size={14} /> Open Business
                      </Link>

                      {/* Login to Business Dashboard */}
                      <a
                        href={`http://localhost:3000/?businessId=${biz.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border border-[#00184d] text-[#00184d] hover:bg-[#00184d]/5 shadow-sm hover:shadow-md"
                      >
                        <ExternalLink size={14} /> Login to Business Dashboard
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty state — no businesses yet */}
          {!isLoadingBusinesses && businesses.length === 0 && (
            <div className="lg:col-span-2 xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
              <Building2 size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="font-bold text-slate-700 text-base">No businesses yet</p>
              <p className="text-sm text-slate-400 mt-1">Get started by creating your first business workspace.</p>
              <Link
                href="/owner/create"
                className="inline-flex items-center gap-2 mt-5 bg-[#00184d] hover:bg-[#002470] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all"
              >
                <PlusCircle size={16} /> Create Business
              </Link>
            </div>
          )}

          {/* Create New Card (ghost) — always show when there are businesses */}
          {!isLoadingBusinesses && businesses.length > 0 && (
            <Link
              href="/owner/create"
              className="bg-white/60 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 hover:border-[#00184d] hover:bg-[#00184d]/5 transition-all group min-h-[320px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-[#00184d]/10 flex items-center justify-center transition-colors">
                <PlusCircle size={26} className="text-slate-400 group-hover:text-[#00184d] transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-500 group-hover:text-[#00184d] transition-colors">Create New Business</p>
                <p className="text-xs text-slate-400 mt-0.5">Set up a new workspace in minutes</p>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* ── RESTORE CONFIRMATION MODAL ─────────────────────────────────── */}
      {restoreTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900">Restore Business?</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to restore this business? It will become <span className="font-bold text-emerald-600">active</span> again and all data will be preserved.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setRestoreTargetId(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRestore(restoreTargetId)}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
                >
                  Yes, Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
