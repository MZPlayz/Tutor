"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── constants ────────────────────────────────────────────────────────────────

const OTP_LEN = 6;
const E = [0.16, 1, 0.3, 1] as const;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  const { signInWithPhone, verifyOTP } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // rAF cursor glow
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el)
          el.style.background = `radial-gradient(680px circle at ${e.clientX}px ${e.clientY}px, rgba(232,83,26,0.08), transparent 65%)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (step === "otp") setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }, [step]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const otp = otpDigits.join("");

  const sendOTP = useCallback(async () => {
    setLoading(true);
    try {
      await signInWithPhone(phone);
      addToast("success", "Code sent!");
      return true;
    } catch (err: any) {
      addToast("error", err.message || "Failed to send OTP");
      return false;
    } finally {
      setLoading(false);
    }
  }, [phone, signInWithPhone, addToast]);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (phone.length !== 11) { addToast("error", "Enter a valid 11-digit phone number"); return; }
    const ok = await sendOTP();
    if (ok) { setStep("otp"); setCountdown(60); }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== OTP_LEN) { addToast("error", "Enter the full 6-digit code"); return; }
    setLoading(true);
    try {
      await verifyOTP(phone, otp);
      addToast("success", "Welcome back!");
      router.push("/");
    } catch (err: any) {
      addToast("error", err.message || "Invalid code. Try again.");
    }
    setLoading(false);
  }

  async function handleResend() {
    if (countdown > 0) return;
    setOtpDigits(Array(OTP_LEN).fill(""));
    const ok = await sendOTP();
    if (ok) setCountdown(60);
  }

  function handleOtpChange(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits]; next[i] = digit; setOtpDigits(next);
    if (digit && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otpDigits[i]) { const n = [...otpDigits]; n[i] = ""; setOtpDigits(n); }
      else if (i > 0) otpRefs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) { otpRefs.current[i - 1]?.focus(); }
    else if (e.key === "ArrowRight" && i < OTP_LEN - 1) { otpRefs.current[i + 1]?.focus(); }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    const next = Array(OTP_LEN).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtpDigits(next);
    otpRefs.current[Math.min(digits.length, OTP_LEN - 1)]?.focus();
  }

  return (
    <div className="min-h-screen bg-[#0c0b0a] relative overflow-hidden font-display">

      {/* ── Cursor glow ─────────────────────────────────────────── */}
      <div ref={cursorRef} className="pointer-events-none fixed inset-0 z-[1]" />

      {/* ── Noise grain ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />

      {/* ── Ambient glow blobs ──────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute -top-48 -left-32 w-[640px] h-[640px] rounded-full bg-[#E8531A]/[0.06] blur-[160px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-[30%] w-[480px] h-[480px] rounded-full bg-[#E8531A]/[0.04] blur-[140px]" />
      {/* Right panel glow — sits exactly behind the auth card */}
      <div aria-hidden className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[460px] h-[560px] bg-[#E8531A]/[0.07] blur-[120px] rounded-full" />

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="relative z-20 px-6 sm:px-10 lg:px-16 pt-6 flex items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8531A] rounded-[9px] flex items-center justify-center shadow-[0_0_18px_rgba(232,83,26,0.55)]">
            <span className="text-[13px] font-bold text-white leading-none">T</span>
          </div>
          <span className="font-bold text-[1rem] text-white tracking-[-0.025em]">Tutor</span>
        </div>
      </nav>

      {/* ── Main grid ───────────────────────────────────────────── */}
      <div className="relative z-10 min-h-[calc(100vh-72px)] grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px]">

        {/* ══ LEFT: Hero ══════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-col justify-center px-10 xl:px-16 py-12 relative">

          {/* Separator */}
          <div className="absolute right-0 inset-y-[8%] w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="max-w-[540px]"
          >
            {/* Eyebrow */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E } } }}
              className="flex items-center gap-2.5 mb-8"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-[#E8531A] flex-shrink-0 shadow-[0_0_8px_rgba(232,83,26,0.9)]" />
              <span className="text-[10.5px] font-semibold text-white/60 uppercase tracking-[0.22em]">
                Next-Gen Learning Platform
              </span>
            </motion.div>

            {/* Headline — Syne ExtraBold */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: E } } }}
              className="text-[clamp(2.8rem,4vw,4.6rem)] font-extrabold text-white leading-[0.93] tracking-[-0.045em] mb-7"
            >
              Learn Without
              <br />
              <em className="not-italic text-[#E8531A]">Limits.</em>
            </motion.h1>

            {/* Sub-copy — contrast-safe */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: E } } }}
              className="text-[1.05rem] font-normal text-white/65 leading-[1.68] mb-10 max-w-[380px]"
            >
              Connect with verified expert tutors, follow structured learning paths,
              and track every session — all in one place.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: E } } }}
              className="flex items-start gap-10 mb-14"
            >
              {[
                { value: "12k+", label: "Active Students" },
                { value: "850+", label: "Expert Tutors"   },
                { value: "4.9★", label: "Avg Rating"      },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-[1.65rem] font-extrabold text-white leading-none tracking-[-0.04em]">
                    {value}
                  </p>
                  <p className="text-[10.5px] font-medium text-white/52 mt-1.5 uppercase tracking-[0.12em]">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Floating session card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: E } } }}
              className="relative max-w-[340px]"
            >
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                className="absolute -top-3 right-2 z-10 rounded-[12px] bg-[#151210] border border-white/[0.1] px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              >
                <p className="text-[1.2rem] font-extrabold text-white leading-none tracking-[-0.025em]">
                  4.9 <span className="text-[#E8531A]">★</span>
                </p>
                <p className="text-[8.5px] font-semibold text-white/45 mt-[3px] uppercase tracking-[0.12em]">
                  Avg rating
                </p>
              </motion.div>

              {/* Session card */}
              <div className="rounded-[20px] bg-[#141210] border border-white/[0.1] p-5 shadow-[0_24px_56px_rgba(0,0,0,0.6)]">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-[11px] bg-[#E8531A]/20 border border-[#E8531A]/25 flex items-center justify-center text-[#E8531A] text-[12px] font-bold flex-shrink-0">
                    SK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-white/92 leading-tight tracking-[-0.01em]">
                      Advanced Mathematics
                    </p>
                    <p className="text-[11px] text-white/50 mt-[2px]">Sarah K. · Tutor</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 px-2 py-1 rounded-full bg-[#E8531A]/15 border border-[#E8531A]/25">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8531A] opacity-70" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E8531A]" />
                    </span>
                    <span className="text-[9.5px] font-semibold text-[#E8531A] uppercase tracking-[0.08em]">Live</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[11px] font-medium text-white/60">Chapter 5 — Quadratic Equations</p>
                    <span className="text-[11px] font-semibold text-white/55 tabular-nums">64%</span>
                  </div>
                  <div className="h-[3px] rounded-full bg-white/[0.07]">
                    <div className="h-full w-[64%] rounded-full bg-[#E8531A]" />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["Algebra", "Grade 10", "1h 20m left"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-[7px] bg-white/[0.05] border border-white/[0.09] text-[10.5px] font-medium text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ══ RIGHT: Auth panel ════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center px-5 py-12 sm:px-8 min-h-[calc(100vh-72px)]">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E }}
            className="lg:hidden flex items-center gap-2.5 mb-8"
          >
            <div className="w-9 h-9 bg-[#E8531A] rounded-[10px] flex items-center justify-center shadow-[0_0_20px_rgba(232,83,26,0.55)]">
              <span className="text-[14px] font-bold text-white">T</span>
            </div>
            <div>
              <p className="font-bold text-[1.05rem] text-white leading-none tracking-[-0.03em]">Tutor</p>
              <p className="text-[8.5px] text-white/45 mt-[3px] tracking-[0.15em] uppercase">Path Technologies</p>
            </div>
          </motion.div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.976 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: E }}
            className="w-full max-w-[22.5rem]"
          >
            <div className="relative rounded-[24px] bg-[#141210] border border-white/[0.1] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_40px_96px_rgba(0,0,0,0.75)] overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8531A]/35 to-transparent" />

              {/* Logo inside card */}
              <div className="flex items-center gap-2.5 px-7 pt-7 mb-7">
                <div className="w-8 h-8 bg-[#E8531A] rounded-[9px] flex items-center justify-center shadow-[0_0_14px_rgba(232,83,26,0.5)]">
                  <span className="text-[13px] font-bold text-white leading-none">T</span>
                </div>
                <div>
                  <p className="font-bold text-[0.9rem] text-white leading-none tracking-[-0.025em]">Tutor</p>
                  <p className="text-[7.5px] text-white/40 mt-[2px] tracking-[0.14em] uppercase">Path Technologies</p>
                </div>
              </div>

              <div className="px-7 pb-7">
                <AnimatePresence mode="wait" initial={false}>

                  {/* ── Phone step ── */}
                  {step === "phone" && (
                    <motion.form
                      key="phone"
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 14 }}
                      transition={{ duration: 0.26, ease: E }}
                      onSubmit={handleSendOTP}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="text-[1.45rem] font-bold text-white tracking-[-0.035em] leading-tight mb-1.5">
                          Welcome back
                        </h2>
                        <p className="text-[13px] text-white/58 leading-snug">
                          Sign in to continue learning
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-semibold text-white/45 uppercase tracking-[0.15em]">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          maxLength={11}
                          autoFocus
                          className="w-full px-4 py-[13px] bg-white/[0.05] border border-white/[0.1] rounded-[12px] text-white text-[15px] font-medium placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[#E8531A]/55 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(232,83,26,0.12)] caret-[#E8531A]"
                        />
                      </div>

                      <OTPButton
                        type="submit"
                        disabled={loading || phone.length !== 11}
                        loading={loading}
                      >
                        Send OTP <IconArrowRight size={16} strokeWidth={2.2} />
                      </OTPButton>

                      <p className="text-center text-[11.5px] text-white/38">
                        New here?{" "}
                        <span className="text-white/55">
                          Your account is created automatically
                        </span>
                      </p>
                    </motion.form>
                  )}

                  {/* ── OTP step ── */}
                  {step === "otp" && (
                    <motion.form
                      key="otp"
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.26, ease: E }}
                      onSubmit={handleVerifyOTP}
                      className="space-y-5"
                    >
                      <div>
                        <button
                          type="button"
                          onClick={() => { setStep("phone"); setOtpDigits(Array(OTP_LEN).fill("")); }}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/65 transition-colors mb-4"
                        >
                          <IconArrowLeft size={11} strokeWidth={2.2} /> Back
                        </button>
                        <h2 className="text-[1.45rem] font-bold text-white tracking-[-0.035em] leading-tight mb-1.5">
                          Check your phone
                        </h2>
                        <p className="text-[13px] text-white/58">
                          Code sent to{" "}
                          <span className="text-white/80 font-semibold tabular-nums">{phone}</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-semibold text-white/45 uppercase tracking-[0.15em]">
                          Verification code
                        </label>
                        <div className="flex gap-[7px]">
                          {Array.from({ length: OTP_LEN }).map((_, i) => (
                            <motion.input
                              key={i}
                              ref={(el) => { otpRefs.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={otpDigits[i]}
                              onChange={(e) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(i, e)}
                              onPaste={i === 0 ? handleOtpPaste : undefined}
                              animate={otpDigits[i] ? { scale: [1, 1.09, 1] } : { scale: 1 }}
                              transition={{ duration: 0.15 }}
                              className={[
                                "flex-1 h-[46px] text-center text-[1.05rem] font-bold font-mono text-white",
                                "rounded-[11px] outline-none transition-all duration-200 caret-transparent",
                                otpDigits[i]
                                  ? "border border-[#E8531A]/50 bg-[#E8531A]/[0.08] shadow-[0_0_0_1px_rgba(232,83,26,0.18)]"
                                  : "border border-white/[0.1] bg-white/[0.04]",
                                "focus:border-[#E8531A]/55 focus:bg-[#E8531A]/[0.07] focus:shadow-[0_0_0_2.5px_rgba(232,83,26,0.2)]",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-center text-[11.5px]">
                        {countdown > 0 ? (
                          <span className="text-white/38">
                            Resend in{" "}
                            <span className="text-[#E8531A] font-semibold tabular-nums">{countdown}s</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResend}
                            className="font-semibold text-[#E8531A] hover:opacity-80 transition-opacity"
                          >
                            Resend code
                          </button>
                        )}
                      </div>

                      <OTPButton
                        type="submit"
                        disabled={loading || otp.length !== OTP_LEN}
                        loading={loading}
                      >
                        Verify & Sign In <IconArrowRight size={16} strokeWidth={2.2} />
                      </OTPButton>
                    </motion.form>
                  )}

                </AnimatePresence>
              </div>
            </div>

            <p className="text-center text-[9.5px] text-white/28 tracking-[0.15em] uppercase mt-6">
              Path Technologies &copy; 2024
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── OTP CTA Button ───────────────────────────────────────────────────────────

function OTPButton({
  children, loading, disabled, type = "button",
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 0, scale: 0.982 }}
      transition={{ duration: 0.13, ease: "easeOut" }}
      className="relative w-full overflow-hidden group bg-[#E8531A] text-white font-bold text-[14px] py-[14px] rounded-[13px] shadow-[0_6px_28px_rgba(232,83,26,0.4)] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-shadow duration-250 hover:shadow-[0_10px_40px_rgba(232,83,26,0.55)]"
    >
      {/* Hover sweep */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/[0.14] to-transparent transition-transform duration-[560ms] ease-in-out pointer-events-none"
      />
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : children}
    </motion.button>
  );
}
