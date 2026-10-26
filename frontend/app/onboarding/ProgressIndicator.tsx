"use client";

export default function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const pct = (currentStep / totalSteps) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-[#3D5A4B]">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#DCE8DD]">
        <div className="h-full bg-[#1F6F4A] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}