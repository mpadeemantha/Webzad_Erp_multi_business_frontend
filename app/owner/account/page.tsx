"use client";

import { useState } from "react";
import OwnerLayout from "@/components/OwnerLayout";
import { User, Lock, Check, Eye, EyeOff, AlertCircle, Camera, Loader2 } from "lucide-react";
import { getMeProfile, updateMeProfile, uploadMeAvatar } from "@/utils/api/auth";

export default function OwnerAccountPage() {
  const [activeTab, setActiveTab] = useState<"Profile" | "Password">("Profile");
  const [saved, setSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Roshan",
    lastName: "Perera",
    email: "owner@pereragroup.lk",
    phone: "+94 77 123 4567"
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage & backend on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("ownerProfile");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile({
            firstName: parsed.firstName || "Roshan",
            lastName: parsed.lastName || "Perera",
            email: parsed.email || "owner@pereragroup.lk",
            phone: parsed.phone || "+94 77 123 4567"
          });
          setAvatarUrl(parsed.avatarUrl || null);
        } catch (_) {}
      }

      // Fetch fresh profile from backend
      getMeProfile().then(p => {
        const nameParts = p.name ? p.name.split(" ") : [];
        const loaded = {
          firstName: p.firstName || nameParts[0] || "Roshan",
          lastName: p.lastName || nameParts.slice(1).join(" ") || "Perera",
          email: p.email || "owner@pereragroup.lk",
          phone: p.phone || "+94 77 123 4567"
        };
        setProfile(loaded);
        setAvatarUrl(p.avatarUrl || null);
        localStorage.setItem("ownerProfile", JSON.stringify({ id: p.id, name: p.name, avatarUrl: p.avatarUrl, ...loaded }));
        window.dispatchEvent(new Event("storage"));
      }).catch(() => {});
    }
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const updatedBackend = await uploadMeAvatar(file);
      setAvatarUrl(updatedBackend.avatarUrl || null);

      // Write updated backend profile to localStorage
      const cached = localStorage.getItem("ownerProfile");
      const current = cached ? JSON.parse(cached) : {};
      const updated = {
        ...current,
        avatarUrl: updatedBackend.avatarUrl
      };
      localStorage.setItem("ownerProfile", JSON.stringify(updated));

      // Force layout sync
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setError(err?.message ?? "Failed to upload profile picture.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    try {
      // Save changes to backend first
      const updatedBackend = await updateMeProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email
      });

      // Write updated backend profile to localStorage
      const updated = {
        id: updatedBackend.id,
        name: updatedBackend.name,
        email: updatedBackend.email,
        firstName: updatedBackend.firstName || profile.firstName,
        lastName: updatedBackend.lastName || profile.lastName,
        phone: updatedBackend.phone || profile.phone,
        avatarUrl: updatedBackend.avatarUrl || avatarUrl
      };
      localStorage.setItem("ownerProfile", JSON.stringify(updated));

      // Force a StorageEvent on the current window so same-window listeners trigger
      window.dispatchEvent(new Event("storage"));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save profile. Please check credentials.");
    }
  };

  return (
    <OwnerLayout>
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Owner Account Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your personal owner-level settings and credentials.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {(["Profile", "Password"] as const).map((tab) => (
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

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="space-y-6">
              {/* Profile Avatar Upload Widget */}
              <div className="flex items-center gap-5 pb-4 border-b border-slate-100">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-[#00184d] flex items-center justify-center text-white font-black text-2xl shadow-md overflow-hidden border border-slate-200">
                    {isUploading ? (
                      <Loader2 size={24} className="animate-spin text-white/70" />
                    ) : avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      `${profile.firstName?.[0] || "R"}${profile.lastName?.[0] || "P"}`.toUpperCase()
                    )}
                  </div>
                  <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors cursor-pointer">
                    <Camera size={13} className="text-slate-500" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">Profile Picture</p>
                  <p className="text-xs text-slate-400 mt-0.5">Upload a square image (JPG, PNG, max 2MB)</p>
                </div>
              </div>

              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2">
                <User size={15} /> Personal Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name", key: "lastName" },
                  { label: "Email Address", key: "email" },
                  { label: "Phone Number", key: "phone" }
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                    <input
                      value={profile[f.key as keyof typeof profile]}
                      onChange={(e) => setProfile(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Password" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2">
                <Lock size={15} /> Update Password
              </h2>
              {[
                { label: "Current Password", show: showCurrent, setShow: setShowCurrent },
                { label: "New Password", show: showNew, setShow: setShowNew },
                { label: "Confirm New Password", show: showConfirm, setShow: setShowConfirm }
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                  <div className="relative">
                    <input
                      type={f.show ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => f.setShow(!f.show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                saved ? "bg-emerald-500 text-white" : "bg-[#00184d] text-white"
              }`}
            >
              {saved ? <span className="flex items-center gap-1.5"><Check size={15} /> Saved!</span> : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
