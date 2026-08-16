"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
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
        localStorage.removeItem("staffProfile");
        router.push("/owner");
      } else {
        const res = await userLogin(businessId, email, password);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("staffProfile", JSON.stringify(res.user));
        router.push("/hr");
      }
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background-color: #f9fafb;
          display: flex;
          flex-direction: column;
        }

        .login-body {
          flex: 1;
          display: flex;
          align-items: stretch;
        }

        /* LEFT PANEL */
        .login-left {
          display: none;
          flex-direction: column;
          justify-content: center;
          padding: 10rem;
          background-color: #111827;
          color: #fff;
          width: 42%;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) { .login-left { display: flex; } }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top left, rgba(59,130,246,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at bottom right, rgba(99,102,241,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 3.5rem;
        }
        .brand-icon {
          width: 36px;
          height: 36px;
          background: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .brand-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .brand-headline {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.5px;
          margin-bottom: 1rem;
          color: #fff;
        }
        .brand-headline span { color: #60a5fa; }
        .brand-sub {
          font-size: 0.875rem;
          color: #9ca3af;
          line-height: 1.6;
          max-width: 320px;
          margin-bottom: 3rem;
        }

        .contact-block {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 2rem;
        }
        .contact-block-title {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #4b5563;
          margin-bottom: 1rem;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
          color: #9ca3af;
          font-size: 0.78rem;
          line-height: 1.5;
        }
        .contact-item svg { flex-shrink: 0; margin-top: 2px; color: #3b82f6; }

        /* RIGHT PANEL */
        .login-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10rem 1.5rem;
          background-color: #f9fafb;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
          justify-content: center;
        }
        @media (min-width: 900px) { .mobile-brand { display: none; } }
        .mobile-brand-icon {
          width: 36px;
          height: 36px;
          background: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }
        .mobile-brand-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
        }

        .form-heading {
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.4px;
          margin-bottom: 0.3rem;
        }
        .form-subheading {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 1.75rem;
        }

        .tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f3f4f6;
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 1.5rem;
          gap: 3px;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.55rem;
          border-radius: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          color: #6b7280;
          background: transparent;
          font-family: 'Inter', sans-serif;
        }
        .tab-btn.active {
          background: #fff;
          color: #111827;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .tab-btn:not(.active):hover { color: #374151; }

        .field-group { margin-bottom: 1rem; }
        .field-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 0.4rem;
        }
        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }
        .forgot-link {
          font-size: 0.7rem;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }

        .field-input {
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.82rem;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .field-input::placeholder { color: #9ca3af; }
        .field-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .field-input:disabled { background: #f9fafb; cursor: not-allowed; }

        .password-wrap { position: relative; }
        .password-wrap .field-input { padding-right: 2.5rem; }
        .eye-btn {
          position: absolute;
          right: 0.7rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #374151; }

        .error-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          margin-bottom: 1rem;
          color: #b91c1c;
          font-size: 0.76rem;
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.7rem 1rem;
          background: #111827;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.18s, transform 0.15s;
          margin-top: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) { background: #1f2937; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        .login-footer {
          text-align: center;
          padding: 1rem;
          font-size: 0.72rem;
          color: #9ca3af;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          font-family: 'Inter', sans-serif;
        }
        .login-footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        .login-footer a:hover { text-decoration: underline; }

        .mobile-contact {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          width: 100%;
          max-width: 400px;
        }
        @media (min-width: 900px) { .mobile-contact { display: none; } }
        .mobile-contact .contact-block-title { color: #9ca3af; }
        .mobile-contact .contact-item { color: #6b7280; }
        .mobile-contact .contact-item svg { color: #3b82f6; }
      `}</style>

      <div className="login-root">
        <div className="login-body">

          {/* LEFT PANEL */}
          <aside className="login-left">
            <div className="brand-logo-wrap">
              <div className="brand-icon">eB</div>
              <span className="brand-name">e-Biz</span>
            </div>

            <h1 className="brand-headline">
              Manage your all business<br />
              in <span>one platform</span>.
            </h1>
            <p className="brand-sub">
              Streamline operations, track finances, manage HR and more —
              all from a single, unified dashboard.
            </p>

            <div className="contact-block">
              <p className="contact-block-title">Support — Webzad Solutions</p>
              <div className="contact-item">
                <MapPin size={13} />
                <span>412, Windflow Avenue, Dalugama,<br />Kelaniya, Sri Lanka</span>
              </div>
              <div className="contact-item">
                <Phone size={13} />
                <span>+94 74 080 7711</span>
              </div>
              <div className="contact-item">
                <Mail size={13} />
                <span>support@ebiz.com</span>
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <main className="login-right">
            {/* Mobile branding */}
            <div className="mobile-brand">
              <div className="mobile-brand-icon">eB</div>
              <span className="mobile-brand-name">e-Biz</span>
            </div>

            <div className="form-container">
              <h2 className="form-heading">Welcome back</h2>
              <p className="form-subheading">Sign in to your e-Biz account</p>

              {/* Tabs */}
              <div className="tabs" role="tablist">
                <button
                  role="tab"
                  aria-selected={loginType === "owner"}
                  className={`tab-btn${loginType === "owner" ? " active" : ""}`}
                  onClick={() => { setLoginType("owner"); setError(null); }}
                >
                  <User size={12} /> Owner Portal
                </button>
                <button
                  role="tab"
                  aria-selected={loginType === "staff"}
                  className={`tab-btn${loginType === "staff" ? " active" : ""}`}
                  onClick={() => { setLoginType("staff"); setError(null); }}
                >
                  <Building2 size={12} /> Staff Login
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="error-box" role="alert">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                {loginType === "staff" && (
                  <div className="field-group">
                    <label className="field-label" htmlFor="businessId">Business ID (Optional)</label>
                    <input
                      id="businessId"
                      type="text"
                      className="field-input"
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                      placeholder="Optional unless email is shared"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="field-group">
                  <label className="field-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="field-group">
                  <div className="field-row">
                    <label className="field-label" htmlFor="password">Password</label>
                    {loginType === "owner" && (
                      <Link href="/forgot-password" className="forgot-link">Forgot?</Link>
                    )}
                  </div>
                  <div className="password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="field-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 size={14} className="spin" /> Verifying…</>
                  ) : (
                    <>Sign In <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </div>

            {/* Mobile contact */}
            <div className="mobile-contact">
              <p className="contact-block-title">Support — Webzad Solutions</p>
              <div className="contact-item"><MapPin size={13} /><span>412, Windflow Avenue, Dalugama, Kelaniya, Sri Lanka</span></div>
              <div className="contact-item"><Phone size={13} /><span>+94 74 080 7711</span></div>
              <div className="contact-item"><Mail size={13} /><span>support@ebiz.com</span></div>
            </div>
          </main>
        </div>

        {/* FOOTER */}
        <footer className="login-footer">
          © {new Date().getFullYear()}&nbsp;
          <a href="https://webzad.net" target="_blank" rel="noopener noreferrer">Webzad Solutions</a>
          &nbsp;· e-Biz ERP · All rights reserved
        </footer>
      </div>
    </>
  );
}
