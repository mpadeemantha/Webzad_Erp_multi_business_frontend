"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Car, ArrowRight, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { forgotPassword } from "@/utils/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00184d] via-[#001030] to-[#00184d] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Sign In
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mb-4 shadow-xl">
            <Car size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-white/50 text-sm mt-1">We'll send a reset link to your email</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2.5 bg-rose-500/20 border border-rose-400/30 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="text-rose-300 shrink-0" />
                  <p className="text-rose-200 text-xs">{error}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1.5">Your Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@carservice.lk"
                    required
                    disabled={isLoading}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#00184d] font-bold py-3 rounded-xl text-sm hover:bg-blue-50 transition-all shadow-lg mt-2 group disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Email Sent!</h3>
                <p className="text-white/50 text-sm mt-1">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                  Check your inbox and follow the instructions.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Powered by ERP System v1.0 · © 2026 Perera Auto Service
        </p>
      </div>
    </div>
  );
}
