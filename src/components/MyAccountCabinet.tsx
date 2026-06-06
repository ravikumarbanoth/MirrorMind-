import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Mail, 
  Globe, 
  Fingerprint, 
  CheckCircle, 
  Clock, 
  User, 
  Key, 
  RefreshCw, 
  HelpCircle, 
  Trophy, 
  Send,
  Loader2,
  Smartphone
} from "lucide-react";
import { StudentDNAProfile } from "../types";

interface MyAccountCabinetProps {
  student: StudentDNAProfile;
  sessionUser: { userId: string; email: string; avatarUrl: string } | null;
  sessionProfile: {
    profileId: string;
    userId: string;
    fullName: string;
    college: string;
    course: string;
    branch: string;
    semester: string;
    careerGoal: string;
    currentIdentity: string;
    futureIdentity: string;
    mirrorMindId: string;
    twinCreatedDate: string;
  } | null;
  token: string | null;
  loadDatabase: (token?: string | null) => Promise<void>;
  onOpenAuth: () => void;
}

export default function MyAccountCabinet({
  student,
  sessionUser,
  sessionProfile,
  token,
  loadDatabase,
  onOpenAuth
}: MyAccountCabinetProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states for password changes / verification
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showPassModal, setShowPassModal] = useState(false);

  // Forgot password parameters
  const [simulatedInbox, setSimulatedInbox] = useState<any>(null);

  // Handles simulated forgot password link triggers
  const handleSimulatedForgotPassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const emailToUse = sessionUser?.email || student.email;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Verification email generated! Check simulated Secure Inbox below.");
      setSimulatedInbox(data.emailSyncBody);
    } catch (err: any) {
      setError(err.message || "Failed to trigger recovery loop");
    } finally {
      setLoading(false);
    }
  };

  // Submits a password update via the recovery URL
  const [resetPassField, setResetPassField] = useState("");
  const [resetConfirmField, setResetConfirmField] = useState("");
  const [resetting, setResetting] = useState(false);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedInbox) return;
    if (resetPassField !== resetConfirmField) {
      setError("Reset passwords do not match.");
      return;
    }

    setResetting(true);
    setError(null);
    setSuccess(null);

    // Parse token from simulated url
    // Custom reset URL: `/auth/reset?email=...&token=...`
    const url = new URL(simulatedInbox.resetUrl, "http://localhost:3000");
    const emailParam = url.searchParams.get("email");
    const tokenParam = url.searchParams.get("token");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam,
          token: tokenParam,
          newPassword: resetPassField
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(data.message);
      setSimulatedInbox(null);
      setResetPassField("");
      setResetConfirmField("");
    } catch (err: any) {
      setError(err.message || "Could not apply password changes");
    } finally {
      setResetting(false);
    }
  };

  // Render values
  const totalStreaks = student.digital.streakDays;
  const hoursSpent = student.digital.learningActivityHours;
  const mirrorId = sessionProfile ? sessionProfile.mirrorMindId : "MM-2026-000101";
  const createdDate = sessionProfile 
    ? new Date(sessionProfile.twinCreatedDate).toLocaleDateString() 
    : new Date(Date.now() - 112 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="space-y-8 animate-fadeIn" id="account-cabinet-container">
      
      {/* SECTION BANNER HERO */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-indigo-950">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150 pointer-events-none">
          <Brain className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-blue-500/20 font-mono">
            V5 MULTI-USER SYNC STATE
          </span>
          <h2 className="text-2xl font-bold font-display mt-3 leading-tight tracking-tight">
            Permanent Student Identity & Digital Twin Vault
          </h2>
          <p className="text-indigo-200 mt-2 text-xs leading-relaxed font-light">
            Each student on MirrorMind receives a structured cryptographic sandbox.
            Your Digital Twin holds your 5-dimensional DNA milestones, lifetime goals, behavioral integrity scores, 
            and customized Socratic memories synced seamlessly across devices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE PHYSICAL STUDENT IDENTITY MM CARD (PART 3) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">
            Student Identity Card
          </h3>

          {/* DYNAMIC METALLIC MM PASSPORT CARD */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between aspect-[1.6/1] bg-cover bg-center">
            
            {/* Gloss Holographic overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-teal-500/15 pointer-events-none"></div>
            
            {/* Top Row: Brand & Holographic Chip */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-indigo-400 font-mono">MIRRORMIND PASSPORT</p>
                <p className="text-[8px] text-slate-500 uppercase font-mono tracking-widest">Active Neural Link v5.24</p>
              </div>
              <div className="w-10 h-7 bg-gradient-to-br from-amber-400/90 via-amber-300 to-yellow-600 rounded-md border border-amber-300/40 opacity-90 shadow-sm relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1px] p-[2px] opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-black"></div>
                  ))}
                </div>
                <Fingerprint className="w-5 h-5 text-amber-950/40" />
              </div>
            </div>

            {/* Middle Row: Student Details */}
            <div className="flex gap-4 items-center my-4">
              <img 
                src={student.avatarUrl} 
                alt={student.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0 bg-slate-900"
              />
              <div className="overflow-hidden">
                <p className="text-base font-bold font-display truncate leading-none text-slate-100">{student.name}</p>
                <p className="text-[10px] opacity-75 font-mono text-indigo-300 mt-1 truncate">{student.department}</p>
                <p className="text-[9px] opacity-50 font-mono tracking-wide mt-0.5 uppercase truncate">
                  {sessionProfile ? sessionProfile.college : "MirrorMind Sandbox"}
                </p>
              </div>
            </div>

            {/* Bottom Row: MM-ID & Dates */}
            <div className="flex justify-between items-end border-t border-slate-800/80 pt-3">
              <div>
                <span className="text-[8px] text-slate-500 block font-mono">MIRRORMIND ID</span>
                <span className="text-xs font-bold font-mono text-emerald-400 tracking-widest">{mirrorId}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-slate-500 block font-mono">TWIN INITIALIZATION</span>
                <span className="text-[10px] font-bold font-mono text-indigo-300">{createdDate}</span>
              </div>
            </div>
          </div>

          {/* DIGITAL TWIN METRICS BOARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">Twin Sync Telemetry</h4>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                <p className="text-[10px] uppercase font-bold text-slate-400 font-mono leading-none">Synergy Stretch</p>
                <p className="text-2xl font-bold font-display text-indigo-900 mt-2">{totalStreaks} Days</p>
                <p className="text-[10px] text-slate-500 mt-1 font-light">Active daily rituals completed</p>
              </div>
              <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50">
                <p className="text-[10px] uppercase font-bold text-slate-400 font-mono leading-none">Dialog Engagement</p>
                <p className="text-2xl font-bold font-display text-teal-900 mt-2">{hoursSpent} Hours</p>
                <p className="text-[10px] text-slate-500 mt-1 font-light">Socratic sessions analyzed</p>
              </div>
            </div>

            {/* QUICK HIGHLIGHT ACTION BAR */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-slate-700">Digital Relationship Score</span>
              </div>
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Tier: High Resonance
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED CONTROLS, ACCREDITATION & COGNITIVE SECURITY (PART 8) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">
            Identity Security & Cryptography Controls
          </h3>

          {/* STATUS NOTIFICATIONS */}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-bold">Security Operation Complete</p>
                <p className="opacity-90">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center gap-2.5 animate-fadeIn">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
              <span>{error}</span>
            </div>
          )}

          {/* GATEKEEPER OPTIONS: GUEST VS REGISTERED */}
          {!sessionUser ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-150 rounded-2xl text-xs text-amber-900 leading-relaxed font-light">
                <span className="font-bold block text-sm text-amber-800 mb-1">🚨 Guest Mode Warning</span>
                Your current Digital Twin is cached inside a standard workspace memory graph. 
                If you clear your browser cache, switch laptops, or view from a mobile device, your Twin will be completely reset.
              </div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Lock in Your Permanent Identity</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Creating an email-hologram account hashes your credentials with enterprise **Salted Scrypt**. This enables cross-device synchronization and allows you to login instantly from any smartphone or dashboard.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onOpenAuth}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xs hover:bg-blue-700 transition shadow-md shadow-blue-100 flex items-center justify-center gap-1.5"
                  >
                    <User className="w-4 h-4" />
                    Register Permanent Identity
                  </button>
                  <button
                    onClick={onOpenAuth}
                    className="bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Active Session Verification Token</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Secure cryptography parameters verified with modern scrypt</p>
                </div>
                <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>

              {/* SECURITY SPECS DATA LIST */}
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-400 uppercase text-[10px]/none font-black tracking-wider">Account Authentication Mode</span>
                  <span className="text-slate-800 font-bold uppercase">{sessionUser.email.endsWith("@google.com") || sessionUser.email.endsWith("@gmail.com") ? "Google OAuth Sync" : "Salted Password (Scrypt)"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-400 uppercase text-[10px]/none font-black tracking-wider">Registered Email Identity</span>
                  <span className="text-slate-800 font-bold">{sessionUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-400 uppercase text-[10px]/none font-black tracking-wider">Cryptographic User ID</span>
                  <span className="text-slate-600 truncate max-w-[170px] bg-slate-200/60 px-1 py-0.5 rounded text-[11px] font-bold">{sessionUser.userId}</span>
                </div>
                <div className="flex justify-between items-center py-1 font-mono">
                  <span className="text-slate-400 uppercase text-[10px]/none font-black tracking-wider">Cross-Device Synchronization</span>
                  <span className="text-emerald-600 font-bold">Enabled & Secured ○</span>
                </div>
              </div>

              {/* SECURITY ACTION BUTTONS */}
              <div className="pt-2 space-y-3">
                <h5 className="font-bold text-slate-700 text-xs">Sandbox Accountability Controls</h5>
                <p className="text-[11px] text-slate-500">
                  Update credentials or simulate password changes using MirrorMind Simulated Inbox service. No raw password characters are cached.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleSimulatedForgotPassword}
                    disabled={loading}
                    className="bg-slate-100 text-slate-700 font-bold py-2 px-3.5 rounded-xl text-xs hover:bg-slate-200 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    Simulate Forgot Password Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATED INBOX DEVISE ROUTER PANEL */}
          {simulatedInbox && (
            <div className="bg-teal-900 text-teal-100 rounded-3xl p-6 border border-teal-800 shadow-xl space-y-4 animate-slideIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-teal-300 animate-pulse" />
                  <span className="text-xs font-black tracking-widest uppercase text-teal-300 font-mono">Simulated MirrorMind Secure Inbox</span>
                </div>
                <span className="text-[9px] font-mono bg-teal-850 px-2 py-0.5 rounded font-black text-teal-400">ENVELOPE DECRYPTED</span>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-850 font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner">
                {simulatedInbox.body}
              </div>

              {/* SECURE POPUP RESET FORM PANEL */}
              <form onSubmit={handleResetSubmit} className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-150 space-y-4 shadow-md">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <Key className="w-4 h-4 text-blue-600" />
                  Enter New Hashed Password
                </h5>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Your token code is active. Proceed with registering your updated scrypt parameters.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-mono">New Password</label>
                    <input
                      type="password"
                      required
                      value={resetPassField}
                      onChange={e => setResetPassField(e.target.value)}
                      placeholder="At least 6 chars with number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-mono">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={resetConfirmField}
                      onChange={e => setResetConfirmField(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={resetting}
                    className="bg-blue-600 text-white font-bold py-2 px-5 rounded-xl text-xs hover:bg-blue-700 transition flex items-center gap-1 disabled:opacity-50"
                  >
                    {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Updated Password
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
