"use client";

import { Input } from "../../../components/ui/Input";
import StepShell from "../StepShell";
import { ChoiceGroup, MultiChoiceGroup } from "../Choice";
import { StepProps, num } from "../onboarding.types";

export default function Lifestyle({ data, updateData, onNext, onBack }: StepProps) {
  const hasCondition = data.conditions.length > 0 && !data.conditions.includes("None");
  const valid = !!(data.activityLevel && data.sleepHours && data.sleepHours >= 3 && data.sleepHours <= 12 && data.conditions.length > 0);

  return (
    <StepShell step={4} title="Your lifestyle and health" subtitle="This keeps your plan safe as well as effective." canContinue={valid} onNext={onNext} onBack={onBack} nextLabel="Finish →">
      <ChoiceGroup label="Daily activity level (outside exercise)" options={["Low", "Moderate", "High"]} value={data.activityLevel} onChange={(activityLevel) => updateData({ activityLevel })} />
      <Input type="number" label="Average sleep (hours per night)" min={3} max={12} value={data.sleepHours ?? ""} onChange={(e) => updateData({ sleepHours: num(e.target.value) })} />
      <MultiChoiceGroup label="Do you have any of these?" options={["Diabetes", "High blood pressure", "Heart condition", "Asthma", "Joint or injury problem", "None"]} value={data.conditions} onChange={(conditions) => updateData({ conditions })} />
      {hasCondition && (
        <p role="note" className="rounded-lg bg-[#FFF1E5] p-3 text-sm text-[#7A3B00]">
          We&apos;ll keep your plan gentle, and we recommend checking with a doctor before starting any new exercise or diet.
        </p>
      )}
    </StepShell>
  );
}