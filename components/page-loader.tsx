"use client";

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fef8f1] to-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-[#f05323] rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-[#fde3c1]">T</span>
          </div>
          <div className="absolute inset-0 rounded-2xl animate-ping bg-[#f05323]/30" />
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-[#f05323] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-[#f05323] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-[#f05323] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}