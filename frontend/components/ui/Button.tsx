import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline";
  size?: "md" | "lg";
};

const variants = {
  primary: "bg-[#1F6F4A] text-white hover:bg-[#175a3b]",
  accent: "bg-[#FF8A3D] text-[#10261C] hover:bg-[#f37a28]",
  outline: "border border-[#10261C]/30 text-[#10261C] hover:bg-white",
};
const sizes = { md: "px-4 py-2 text-sm", lg: "px-6 py-3" };

export function Button({ variant = "primary", size = "md", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}