"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Car, Loader2, AlertCircle, Building2, User } from "lucide-react";
import { ownerLogin, userLogin } from "@/utils/api/auth";

export default function LoginPage() {
  const router = useRouter();

  const [loginType, setLoginType] = useState<"owner" | "staff">("owner");
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [businessId, setBusinessId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (loginType === "owner") {
        const { accessToken, refreshToken } = await ownerLogin(email, password);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        // Clear staff specific data just in case
        localStorage.removeItem("staffProfile");
        router.push("/owner");
      } else {
        const res = await userLogin(businessId, email, password);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("staffProfile", JSON.stringify(res.user));
        // Redirect to main staff dashboard
        router.push("/hr");
      }
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00184d] via-[#001030] to-[#00184d] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mb-3 shadow-xl">
            <Car size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Perera Auto Service</h1>
          <p className="text-white/50 text-xs mt-1">ERP Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => { setLoginType("owner"); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                loginType === "owner"
                  ? "bg-white text-[#00184d] shadow"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <User size={13} />
              Owner Portal
            </button>
            <button
              onClick={() => { setLoginType("staff"); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                loginType === "staff"
                  ? "bg-white text-[#00184d] shadow"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 size={13} />
              Staff Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-base font-bold text-white">
              {loginType === "owner" ? "Owner Sign In" : "Staff Member Login"}
            </h2>

            {error && (
              <div className="flex items-center gap-2.5 bg-rose-500/20 border border-rose-400/30 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-rose-300 shrink-0" />
                <p className="text-rose-200 text-xs">{error}</p>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Business ID (only for staff) */}
              {loginType === "staff" && (
                <div>
                  <label className="text-[10px] font-bold text-white/70 block mb-1 uppercase tracking-wider">Business ID (Optional)</label>
                  <input
                    type="text"
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    placeholder="Optional unless email is shared"
                    disabled={isLoading}
                    className="w-full bg-white/15 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                  />
                </div>
              )}


              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-white/70 block mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                  className="w-full bg-white/15 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Password</label>
                  {loginType === "owner" && (
                    <Link href="/forgot-password" className="text-[10px] text-blue-300 hover:underline">
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full bg-white/15 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 pr-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#00184d] font-bold py-2.5 rounded-xl text-xs hover:bg-blue-50 transition-all shadow-lg mt-3 group disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-[10px] mt-6">
          Powered by ERP System v1.0 · © 2026 Perera Auto Service
        </p>
      </div>
    </div>
  );
}
