"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  icon?: ReactNode;
}

export default function Button({ 
  children, 
  variant = "primary", 
  loading = false, 
  icon,
  className = "",
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 overflow-hidden";
  
  const variantClasses = {
    primary: "bg-[#f05323] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-[#fde3c1] text-[#f05323] hover:bg-[#f5d4a8]",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-[#f05323] hover:text-[#f05323]",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
      <span className={loading ? "invisible" : "visible"}>
        {icon}
        {children}
      </span>
    </button>
  );
}