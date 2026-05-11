"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import DotField from "@/components/dot-field";
import {
  IconArrowLeft,
  IconMapPin,
  IconBook,
  IconStar,
  IconCheck,
  IconBriefcase,
  IconSchool,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

// ─── types ─────────────────────────────────────────────────────────────────────

interface Tutor {
  id: string;
  userId: string;
  bio: string | null;
  areaSlug: string;
  serviceMode: string;
  verificationStatus: string;
  gender: string | null;
  university: string | null;
  completedSessions: number;
  profileStrength: number;
  services: { subject: string; ratePerHour: number }[];
}

const E = [0.16, 1, 0.3, 1] as const;

// ─── util ──────────────────────────────────────────────────────────────────────

function areaLabel(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function tutorInitials(index: number) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXY";
  return letters[index % letters.length] + "T";
}

// ─── search content ────────────────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const area = searchParams.get("area") || "";
  const subject = searchParams.get("subject") || "";
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  // cursor glow
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el)
          el.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(240,83,35,0.055), transparent 68%)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!area || !supabase) return;
    async function fetchTutors() {
      if (!supabase) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("Provider")
        .select(`id, userId, bio, areaSlug, serviceMode, verificationStatus, gender, university, completedSessions, profileStrength, services (subject, ratePerHour)`)
        .eq("areaSlug", area)
        .eq("verificationStatus", "approved")
        .eq("isSuspended", false);

      if (!error && data) {
        const filtered = subject
          ? data.filter((t: any) =>
              t.services?.some((s: any) =>
                s.subject.toLowerCase().includes(subject.toLowerCase())
              )
            )
          : data;
        setTutors(filtered as Tutor[]);
      }
      setLoading(false);
    }
    fetchTutors();
  }, [area, subject, supabase]);

  return (
    <div className="min-h-screen bg-[#07050a] relative overflow-hidden">

      {/* ── Background ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={1.1}
          dotSpacing={24}
          bulgeStrength={95}
          glowRadius={210}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={600}
          cursorForce={0.13}
          bulgeOnly={true}
          gradientFrom="rgba(240, 83, 35, 0.58)"
          gradientTo="rgba(253, 227, 193, 0.09)"
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
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-28 w-[500px] h-[500px] rounded-full bg-[#f05323]/[0.045] blur-[140px]" />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="relative z-10 px-4 sm:px-6 pt-5 pb-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-colors flex-shrink-0"
        >
          <IconArrowLeft size={15} strokeWidth={2.2} className="text-white/50" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-white/80 tracking-[-0.01em] leading-none">
            Tutors in{" "}
            <span className="text-white">{areaLabel(area)}</span>
          </p>
          {subject && (
            <p className="text-[11px] text-white/30 mt-[3px]">
              Filtered by <span className="text-white/50">{subject}</span>
            </p>
          )}
        </div>

        {!loading && (
          <span className="flex-shrink-0 text-[11px] font-medium text-white/28 tabular-nums">
            {tutors.length} found
          </span>
        )}
      </header>

      {/* ── Filter chips ────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 mb-5 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#f05323]/[0.1] border border-[#f05323]/25">
          <IconMapPin size={10} strokeWidth={2.2} className="text-[#f05323]/70" />
          <span className="text-[11px] font-medium text-[#f05323]/80">{areaLabel(area)}</span>
        </div>
        {subject && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white/[0.04] border border-white/[0.07]">
            <IconBook size={10} strokeWidth={2.2} className="text-white/30" />
            <span className="text-[11px] font-medium text-white/45">{subject}</span>
          </div>
        )}
      </div>

      {/* ── Results ─────────────────────────────────────────── */}
      <main className="relative z-10 px-4 sm:px-6 pb-12 space-y-3">

        {loading ? (
          // Skeleton cards
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 0.06} />
          ))
        ) : tutors.length === 0 ? (
          // Empty state
          <EmptyState area={area} subject={subject} onBack={() => router.back()} />
        ) : (
          // Tutor cards
          tutors.map((tutor, i) => (
            <TutorCard key={tutor.id} tutor={tutor} index={i} />
          ))
        )}
      </main>
    </div>
  );
}

// ─── tutor card ────────────────────────────────────────────────────────────────

function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
  const initials = tutorInitials(index);
  const relevantServices = tutor.services?.slice(0, 3) || [];
  const minRate = tutor.services?.length
    ? Math.min(...tutor.services.map((s) => s.ratePerHour))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: E }}
      className="relative rounded-[18px] bg-[rgba(13,10,16,0.88)] backdrop-blur-[24px] border border-white/[0.065] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden p-4"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="flex gap-3.5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-[13px] bg-[#f05323]/[0.12] border border-[#f05323]/18 flex items-center justify-center text-[#f05323] text-sm font-bold">
            {initials}
          </div>
          {tutor.verificationStatus === "approved" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#07050a] flex items-center justify-center">
              <IconCheck size={8} strokeWidth={3} className="text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[13.5px] font-semibold text-white/88 leading-tight tracking-[-0.01em]">
                {tutor.gender === "female" ? "Female" : "Male"} Tutor
              </h3>
              {tutor.university && (
                <div className="flex items-center gap-1 mt-[3px]">
                  <IconSchool size={10} strokeWidth={2} className="text-white/25 flex-shrink-0" />
                  <p className="text-[11px] text-white/35 truncate">{tutor.university}</p>
                </div>
              )}
            </div>

            {/* Rate badge */}
            {minRate !== null && (
              <div className="flex-shrink-0 text-right">
                <p className="text-[13px] font-bold text-white/85 leading-none tracking-[-0.02em]">
                  ৳{minRate}
                  <span className="text-[10px] font-normal text-white/30">/hr</span>
                </p>
              </div>
            )}
          </div>

          {/* Sessions + mode */}
          <div className="flex items-center gap-3 mt-2 mb-3">
            {tutor.completedSessions > 0 && (
              <div className="flex items-center gap-1">
                <IconBriefcase size={10} strokeWidth={2} className="text-white/25" />
                <span className="text-[10.5px] text-white/32">{tutor.completedSessions} sessions</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <IconStar size={10} strokeWidth={2} className="text-[#f05323]/50" />
              <span className="text-[10.5px] text-white/32">
                {tutor.serviceMode === "online" ? "Online" : tutor.serviceMode === "offline" ? "In-person" : "Both"}
              </span>
            </div>
          </div>

          {/* Subject chips */}
          {relevantServices.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {relevantServices.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-[7px] bg-white/[0.04] border border-white/[0.07] text-[10.5px] text-white/40"
                >
                  {s.subject}
                  <span className="ml-1 text-white/25">৳{s.ratePerHour}</span>
                </span>
              ))}
              {(tutor.services?.length || 0) > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-[7px] bg-white/[0.03] border border-white/[0.05] text-[10.5px] text-white/25">
                  +{tutor.services.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05] flex items-center justify-between">
        {tutor.bio ? (
          <p className="text-[11px] text-white/28 leading-snug line-clamp-1 flex-1 mr-4">{tutor.bio}</p>
        ) : (
          <span />
        )}
        <button className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] bg-[#f05323] text-white text-[11.5px] font-semibold shadow-[0_4px_14px_rgba(240,83,35,0.3)] hover:shadow-[0_6px_20px_rgba(240,83,35,0.45)] hover:-translate-y-0.5 transition-all duration-150">
          Book Now
        </button>
      </div>
    </motion.div>
  );
}

// ─── skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-[18px] bg-[rgba(13,10,16,0.88)] border border-white/[0.055] p-4"
    >
      <div className="flex gap-3.5">
        <div className="w-12 h-12 rounded-[13px] bg-white/[0.05] animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-white/[0.05] rounded animate-pulse w-32" />
          <div className="h-3 bg-white/[0.04] rounded animate-pulse w-48" />
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-white/[0.04] rounded-[7px] animate-pulse w-16" />
            <div className="h-6 bg-white/[0.04] rounded-[7px] animate-pulse w-20" />
            <div className="h-6 bg-white/[0.04] rounded-[7px] animate-pulse w-14" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── empty state ───────────────────────────────────────────────────────────────

function EmptyState({
  area, subject, onBack,
}: { area: string; subject: string; onBack: () => void; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: E }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-[18px] bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-5">
        <IconSchool size={26} strokeWidth={1.5} className="text-white/20" />
      </div>
      <h3 className="text-[16px] font-semibold text-white/60 tracking-[-0.02em] mb-2">
        No tutors found
      </h3>
      <p className="text-[12.5px] text-white/28 leading-relaxed max-w-[220px]">
        No verified tutors in{" "}
        <span className="text-white/45">{areaLabel(area)}</span>
        {subject ? (
          <>
            {" "}for <span className="text-white/45">{subject}</span>
          </>
        ) : null}{" "}
        yet.
      </p>
      <button
        onClick={onBack}
        className="mt-7 flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-white/[0.05] border border-white/[0.08] text-[12.5px] font-medium text-white/45 hover:text-white/65 hover:bg-white/[0.07] transition-colors"
      >
        <IconArrowLeft size={13} strokeWidth={2} />
        Change area
      </button>
    </motion.div>
  );
}

// ─── export ────────────────────────────────────────────────────────────────────

const SkeletonFallback = (
  <div className="min-h-screen bg-[#07050a] flex items-center justify-center">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="w-10 h-10 bg-[#f05323] rounded-[11px] flex items-center justify-center"
    >
      <span className="text-[15px] font-bold text-white">T</span>
    </motion.div>
  </div>
);

export default function SearchPage() {
  return (
    <Suspense fallback={SkeletonFallback}>
      <SearchContent />
    </Suspense>
  );
}
