import * as React from "react";

export function Button({ className = "", variant = "primary", size = "md", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg" }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9B676] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-[#4C1769] text-white hover:bg-[#3A1150] shadow-lg shadow-purple-900/20",
    secondary: "bg-[#C9B676] text-[#4C1769] hover:bg-[#A8935A] shadow",
    outline: "border-2 border-[#4C1769] text-[#4C1769] hover:bg-[#4C1769] hover:text-white",
    ghost: "text-[#4C1769] hover:bg-purple-50",
  };
  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-base",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
