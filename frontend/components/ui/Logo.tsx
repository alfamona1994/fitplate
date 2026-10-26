import Link from "next/link";

// Change the app name here and it updates everywhere.
const NAME_FIRST = "Fit";
const NAME_SECOND = "Plate";
export const APP_NAME = NAME_FIRST + NAME_SECOND;

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const tile = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
  const text = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };

  return (
    <Link href="/landing" className={`flex items-center space-x-3 ${className}`} aria-label={`${APP_NAME} home`}>
      <span className={`${tile[size]} flex items-center justify-center rounded-xl bg-[#1F6F4A] text-white`}>
        {/* dumbbell icon */}
        <svg className="h-3/5 w-3/5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="1" y="9" width="3" height="6" rx="1" />
          <rect x="4" y="7" width="3" height="10" rx="1" />
          <rect x="7" y="11" width="10" height="2" />
          <rect x="17" y="7" width="3" height="10" rx="1" />
          <rect x="20" y="9" width="3" height="6" rx="1" />
        </svg>
      </span>
      <span className={`font-poppins font-semibold tracking-tight ${text[size]}`}>
        <span className="text-[#10261C]">{NAME_FIRST}</span>
        <span className="text-[#1F6F4A]">{NAME_SECOND}</span>
      </span>
    </Link>
  );
}