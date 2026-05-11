"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/auth-context";
import DotField from "@/components/dot-field";
import {
  IconSearch,
  IconMapPin,
  IconBook,
  IconLogout,
  IconCalendar,
  IconWallet,
  IconChevronDown,
  IconUser,
  IconCheck,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── data ─────────────────────────────────────────────────────────────────────

const AREAS = [
  { slug: "tanbazar",  name: "Tanbazar"  },
  { slug: "chasara",   name: "Chasara"   },
  { slug: "fatullah",  name: "Fatullah"  },
  { slug: "dumni",     name: "Dumni"     },
  { slug: "bhulta",   name: "Bhulta"    },
  { slug: "gangchara", name: "Gangchara" },
  { slug: "gouripur",  name: "Gouripur"  },
  { slug: "kashipur",  name: "Kashipur"  },
];

const SUBJECTS = ["Physics", "Chemistry", "Math", "English", "Biology", "ICT", "Bangla", "Higher Math"];

const STATS = [
  { value: "500+", label: "Tutors"     },
  { value: "8",    label: "Areas"      },
  { value: "4.9★", label: "Rating"     },
  { value: "100%", label: "Verified"   },
];

const E = [0.16, 1, 0.3, 1] as const;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // rAF cursor glow
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el)
          el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(240,83,35,0.06), transparent 68%)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [menuOpen]);

  async function handleSignOut() {
    await signOut();
    router.push("/auth/login");
  }

  function handleSearch() {
    if (!selectedArea) return;
    const params = new URLSearchParams({ area: selectedArea });
    if (selectedSubject) params.set("subject", selectedSubject);
    router.push(`/search?${params}`);
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#07050a] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-11 h-11 bg-[#f05323] rounded-[12px] flex items-center justify-center shadow-[0_0_28px_rgba(240,83,35,0.5)]"
        >
          <span className="text-[18px] font-bold text-white">T</span>
        </motion.div>
      </div>
    );
  }

  const initials = userData?.name
    ? userData.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-[#07050a] relative overflow-hidden">

      {/* ── Background ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={1.1}
          dotSpacing={24}
          bulgeStrength={100}
          glowRadius={220}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={620}
          cursorForce={0.14}
          bulgeOnly={true}
          gradientFrom="rgba(240, 83, 35, 0.6)"
          gradientTo="rgba(253, 227, 193, 0.1)"
          glowColor="#07050a"
        />
      </div>
      <div ref={cursorRef} className="pointer-events-none fixed inset-0 z-[1]" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -top-48 -left-32 w-[600px] h-[600px] rounded-full bg-[#f05323]/[0.05] blur-[150px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#f05323]/[0.04] blur-[140px]" />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="relative z-20 px-4 sm:px-6 pt-5 pb-4 flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#f05323] rounded-[9px] flex items-center justify-center shadow-[0_0_16px_rgba(240,83,35,0.45)]">
            <span className="text-[13px] font-bold text-white">T</span>
          </div>
          <span className="font-bold text-[1rem] text-white/80 tracking-[-0.025em]">Tutor</span>
        </div>

        {/* User menu */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[10px] bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#f05323]/20 border border-[#f05323]/25 flex items-center justify-center text-[10px] font-bold text-[#f05323]">
              {initials}
            </div>
            <span className="text-[12.5px] font-medium text-white/60 max-w-[80px] truncate">
              {userData?.name || "Account"}
            </span>
            <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <IconChevronDown size={13} className="text-white/30" strokeWidth={2} />
            </motion.div>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: E }}
                className="absolute right-0 mt-2 w-44 rounded-[14px] bg-[rgba(14,11,18,0.97)] backdrop-blur-2xl border border-white/[0.07] shadow-[0_20px_56px_rgba(0,0,0,0.6)] overflow-hidden z-30"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <div className="p-1.5 space-y-0.5">
                  <MenuItem icon={<IconWallet size={13} strokeWidth={2} />} label="My Wallet" />
                  <MenuItem icon={<IconCalendar size={13} strokeWidth={2} />} label="My Bookings" />
                  <MenuItem icon={<IconUser size={13} strokeWidth={2} />} label="Profile" />
                </div>
                <div className="h-px bg-white/[0.05] mx-2" />
                <div className="p-1.5">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[9px] text-[12px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/[0.07] transition-colors"
                  >
                    <IconLogout size={13} strokeWidth={2} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="relative z-10 px-4 sm:px-6 pb-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: E }}
          className="mt-8 mb-8"
        >
          <p className="text-[10px] font-semibold text-white/28 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#f05323] shadow-[0_0_6px_rgba(240,83,35,0.9)]" />
            Narayanganj · Bangladesh
          </p>
          <h1 className="text-[1.9rem] sm:text-[2.2rem] font-bold text-white leading-[1.05] tracking-[-0.035em]">
            Find Your Perfect
            <br />
            <em className="not-italic text-[#f05323]">Tutor.</em>
          </h1>
          <p className="text-[13.5px] text-white/32 mt-2.5 leading-snug">
            Search from verified, expert tutors in your area.
          </p>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: E }}
          className="relative rounded-[22px] bg-[rgba(13,10,16,0.88)] backdrop-blur-[28px] border border-white/[0.065] shadow-[0_24px_72px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden p-5 space-y-6"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f05323]/20 to-transparent" />

          {/* Subject */}
          <div>
            <label className="flex items-center gap-1.5 text-[9.5px] font-semibold text-white/28 uppercase tracking-[0.14em] mb-3">
              <IconBook size={11} strokeWidth={2.2} className="text-[#f05323]/60" />
              Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(selectedSubject === s ? "" : s)}
                  className={[
                    "px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all duration-180",
                    selectedSubject === s
                      ? "bg-[#f05323] text-white shadow-[0_4px_16px_rgba(240,83,35,0.35)]"
                      : "bg-white/[0.04] border border-white/[0.07] text-white/45 hover:text-white/70 hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="flex items-center gap-1.5 text-[9.5px] font-semibold text-white/28 uppercase tracking-[0.14em] mb-3">
              <IconMapPin size={11} strokeWidth={2.2} className="text-[#f05323]/60" />
              Area
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AREAS.map((a) => {
                const active = selectedArea === a.slug;
                return (
                  <button
                    key={a.slug}
                    onClick={() => setSelectedArea(active ? "" : a.slug)}
                    className={[
                      "flex items-center justify-between px-3.5 py-2.5 rounded-[11px] text-[12.5px] font-medium transition-all duration-180 text-left",
                      active
                        ? "bg-[#f05323]/[0.12] border border-[#f05323]/35 text-white shadow-[0_0_0_1px_rgba(240,83,35,0.12)]"
                        : "bg-white/[0.03] border border-white/[0.07] text-white/45 hover:text-white/65 hover:bg-white/[0.055]",
                    ].join(" ")}
                  >
                    {a.name}
                    {active && <IconCheck size={12} strokeWidth={2.5} className="text-[#f05323] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search button */}
          <SearchButton disabled={!selectedArea} onClick={handleSearch} />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: E }}
          className="grid grid-cols-4 gap-3 mt-4"
        >
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-[14px] bg-white/[0.03] border border-white/[0.06] px-2 py-3 text-center"
            >
              <p className="text-[1.05rem] font-bold text-white tracking-[-0.025em] leading-none">{value}</p>
              <p className="text-[9.5px] text-white/28 mt-1 uppercase tracking-[0.08em]">{label}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

// ─── sub-components ────────────────────────────────────────────────────────────

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-[9px] text-[12px] font-medium text-white/45 hover:text-white/75 hover:bg-white/[0.05] transition-colors">
      <span className="text-white/30">{icon}</span>
      {label}
    </button>
  );
}

function SearchButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -1.5 }}
      whileTap={disabled ? {} : { y: 0, scale: 0.982 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      className="relative w-full overflow-hidden group bg-[#f05323] text-white font-semibold text-[14px] py-[14px] rounded-[13px] shadow-[0_6px_28px_rgba(240,83,35,0.35)] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(240,83,35,0.5)]"
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-[580ms] ease-in-out pointer-events-none"
      />
      <IconSearch size={16} strokeWidth={2.2} />
      Search Tutors
    </motion.button>
  );
}
