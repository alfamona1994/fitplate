"use client";

import StepShell from "../StepShell";
import { ChoiceGroup, MultiChoiceGroup } from "../Choice";
import { StepProps } from "../onboarding.types";

export default function DietPreferences({ data, updateData, onNext, onBack }: StepProps) {
  const valid = !!(data.dietType && data.mealsPerDay && data.budget && data.allergies.length > 0);
  return (
    <StepShell step={3} title="Your food preferences" subtitle="So we only suggest meals you can and want to eat." canContinue={valid} onNext={onNext} onBack={onBack}>
      <ChoiceGroup label="Diet type" options={["No restriction", "Vegetarian", "Vegan", "Halal"]} value={data.dietType} onChange={(dietType) => updateData({ dietType })} />
      <MultiChoiceGroup label="Allergies or foods to avoid" options={["Nuts", "Dairy", "Eggs", "Gluten", "Seafood", "None"]} value={data.allergies} onChange={(allergies) => updateData({ allergies })} />
      <ChoiceGroup label="Meals per day" options={["2", "3", "4+"]} value={data.mealsPerDay} onChange={(mealsPerDay) => updateData({ mealsPerDay })} />
      <ChoiceGroup label="Food budget" options={["Low", "Medium", "High"]} value={data.budget} onChange={(budget) => updateData({ budget })} />
    </StepShell>
  );
}