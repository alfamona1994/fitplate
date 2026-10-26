"use client";

import StepShell from "../StepShell";
import { ChoiceGroup } from "../Choice";
import { StepProps } from "../onboarding.types";

export default function Goals({ data, updateData, onNext, onBack }: StepProps) {
  const valid = !!(data.goal && data.experience && data.daysPerWeek && data.equipment);
  return (
    <StepShell step={2} title="What do you want to achieve?" subtitle="Your goal shapes both your workouts and your meals." canContinue={valid} onNext={onNext} onBack={onBack}>
      <ChoiceGroup label="Main goal" options={["Lose weight", "Build muscle", "Stay fit", "Improve endurance"]} value={data.goal} onChange={(goal) => updateData({ goal })} />
      <ChoiceGroup label="Exercise experience" options={["Beginner", "Intermediate", "Advanced"]} value={data.experience} onChange={(experience) => updateData({ experience })} />
      <ChoiceGroup label="How many days a week can you train?" options={["1–2 days", "3–4 days", "5+ days"]} value={data.daysPerWeek} onChange={(daysPerWeek) => updateData({ daysPerWeek })} />
      <ChoiceGroup label="What equipment do you have?" options={["No equipment", "Home basics", "Full gym"]} value={data.equipment} onChange={(equipment) => updateData({ equipment })} />
    </StepShell>
  );
}