"use client";

import { InputHTMLAttributes, ReactNode, useId } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  rightElement?: ReactNode;
};

export function Input({ label, rightElement, className = "", ...props }: Props) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#10261C]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...props}
          className={`w-full rounded-lg border border-[#10261C]/25 bg-white px-3 py-2.5 text-[#10261C] placeholder:text-[#7A9185] focus:border-[#1F6F4A] focus:outline-none focus:ring-2 focus:ring-[#1F6F4A]/30 ${rightElement ? "pr-16" : ""} ${className}`}
        />
        {rightElement && <div className="absolute inset-y-0 right-3 flex items-center">{rightElement}</div>}
      </div>
    </div>
  );
}