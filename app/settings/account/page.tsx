"use client";

import { useState, useEffect } from "react";
import { User, Lock, Check, Eye, EyeOff, AlertCircle, Camera, Loader2, Shield } from "lucide-react";
import { getMeProfile, updateMeProfile, uploadMeAvatar } from "@/utils/api/auth";
import { getDecodedToken } from "@/utils/permissions";

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState<"Profile" | "Password">("Profile");
  const [saved, setSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Staff Member",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage & backend on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("staffProfile");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const nameParts = parsed.name ? parsed.name.split(" ") : [];
          setProfile({
            firstName: parsed.firstName || nameParts[0] || "",
            lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            role: parsed.roles?.[0] || "Staff Member",
          });
          setAvatarUrl(parsed.avatarUrl || null);
        } catch (_) {}
      }

      // Fetch fresh profile from backend
      getMeProfile()
        .then((p: any) => {
          const nameParts = p.name ? p.name.split(" ") : [];
          const decoded = getDecodedToken();
          const roles = decoded?.roles ?? [];

          const loaded = {
            firstName: p.firstName || nameParts[0] || "",
            lastName: p.lastName || nameParts.slice(1).join(" ") || "",
            email: p.email || "",
            phone: p.phone || "",
            role: roles[0] || "Staff Member",
          };
          setProfile(loaded);
          setAvatarUrl(p.avatarUrl || null);

          const updatedLocal = {
            ...p,
            ...loaded,
            name: `${loaded.firstName} ${loaded.lastName}`.trim(),
          };
          localStorage.setItem("staffProfile", JSON.stringify(updatedLocal));
          window.dispatchEvent(new Event("storage"));
        })
        .catch(() => {});
    }
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const updatedBackend = await uploadMeAvatar(file);
      setAvatarUrl(updatedBackend.avatarUrl || null);

      // Write updated profile to localStorage
      const cached = localStorage.getItem("staffProfile");
      const current = cached ? JSON.parse(cached) : {};
      const updated = {
        ...current,
        avatarUrl: updatedBackend.avatarUrl,
      };
      localStorage.setItem("staffProfile", JSON.stringify(updated));

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
      });

      // Write updated profile to localStorage
      const cached = localStorage.getItem("staffProfile");
      const current = cached ? JSON.parse(cached) : {};
      const updated = {
        ...current,
        firstName: updatedBackend.firstName || profile.firstName,
        lastName: updatedBackend.lastName || profile.lastName,
        name: `${updatedBackend.firstName || profile.firstName} ${updatedBackend.lastName || profile.lastName}`.trim(),
        avatarUrl: updatedBackend.avatarUrl || avatarUrl,
      };
      localStorage.setItem("staffProfile", JSON.stringify(updated));

      // Force a StorageEvent on current window
      window.dispatchEvent(new Event("storage"));

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save profile.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Page Title & Desc */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 text-sm">Configure your personal settings and credentials.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["Profile", "Password"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "border border-slate-950 text-slate-950 bg-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === "Profile" && (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-black text-2xl shadow-sm overflow-hidden border border-slate-200/50">
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin text-slate-400" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    `${profile.firstName?.[0] || "U"}${profile.lastName?.[0] || ""}`.toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow hover:bg-slate-50 transition-colors cursor-pointer">
                  <Camera size={12} className="text-slate-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800 text-base">Profile Picture</p>
                <p className="text-xs text-slate-400">Upload a square image (JPG, PNG, max 2MB)</p>
              </div>
            </div>

            {/* Fields Section */}
            <div className="space-y-4">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2">
                <User size={15} /> Personal Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">First Name</label>
                  <input
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Last Name</label>
                  <input
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
                  <input
                    value={profile.email}
                    disabled
                    title="Email cannot be changed"
                    className="w-full border border-slate-100 bg-slate-50 text-slate-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Phone Number</label>
                  <input
                    value={profile.phone || "Not Provided"}
                    disabled
                    title="Phone number cannot be changed"
                    className="w-full border border-slate-100 bg-slate-50 text-slate-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Role</label>
                  <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-100">
                    <Shield size={12} /> {profile.role}
                  </div>
                </div>
              </div>
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

        {/* Action Button inside Card aligned right */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow transition-all ${
              saved ? "bg-emerald-500 text-white" : "bg-[#00184d] hover:bg-[#002470] text-white"
            }`}
          >
            {saved ? <span className="flex items-center gap-1.5"><Check size={15} /> Saved!</span> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
