"use client";

import { ReactNode } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import ProgressIndicator from "./ProgressIndicator";

interface Props {
  step: number;
  title: string;
  subtitle: string;
  canContinue: boolean;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  children: ReactNode;
}

export default function StepShell({ step, title, subtitle, canContinue, onNext, onBack, nextLabel = "Continue →", children }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F6F1] p-6 font-inter text-[#10261C]">
      <Card className="w-full max-w-xl space-y-6 p-8">
        <ProgressIndicator currentStep={step} totalSteps={4} />
        <div>
          <h2 className="font-poppins text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-[#3D5A4B]">{subtitle}</p>
        </div>
        <div className="space-y-5">{children}</div>
        <div className="flex gap-3 pt-2">
          {onBack && <Button variant="outline" size="lg" className="w-full" onClick={onBack}>Back</Button>}
          <Button size="lg" className="w-full" disabled={!canContinue} onClick={onNext}>{nextLabel}</Button>
        </div>
        {!canContinue && <p className="text-center text-xs text-[#5F7A6B]">Please answer every question to continue.</p>}
      </Card>
    </main>
  );
}