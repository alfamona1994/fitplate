import { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-[#10261C]/10 bg-white ${className}`}>{children}</div>;
}