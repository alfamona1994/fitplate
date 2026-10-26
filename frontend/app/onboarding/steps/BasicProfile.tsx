"use client";

import { Input } from "../../../components/ui/Input";
import StepShell from "../StepShell";
import { ChoiceGroup } from "../Choice";
import { StepProps, calcBmi, bmiCategory, num } from "../onboarding.types";

function Hint({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="-mt-3 text-sm text-[#9B1C1C]">
      {message}
    </p>
  );
}

const outside = (v: number | null, min: number, max: number) => v !== null && (v < min || v > max);

export default function BasicProfile({ data, updateData, onNext, onBack }: StepProps) {
  const bmi = calcBmi(data.height, data.weight);

  const ageError = outside(data.age, 10, 100) ? "Enter an age between 10 and 100." : "";
  const heightError = outside(data.height, 100, 250) ? "Height is in centimetres, between 100 and 250 (for example 170)." : "";
  const weightError = outside(data.weight, 30, 300) ? "Weight is in kilograms, between 30 and 300 (for example 70)." : "";

  const valid =
    !!data.gender && !!data.age && !!data.height && !!data.weight && !ageError && !heightError && !weightError;

  return (
    <StepShell step={1} title="Let's start with the basics" subtitle="We use these to estimate your daily calorie needs." canContinue={valid} onNext={onNext} onBack={onBack}>
      <ChoiceGroup label="Gender" options={["Male", "Female", "Other"]} value={data.gender} onChange={(gender) => updateData({ gender })} />

      <Input type="number" label="Age" min={10} max={100} value={data.age ?? ""} onChange={(e) => updateData({ age: num(e.target.value) })} />
      <Hint message={ageError} />

      <Input type="number" label="Height (cm)" min={100} max={250} value={data.height ?? ""} onChange={(e) => updateData({ height: num(e.target.value) })} />
      <Hint message={heightError} />

      <Input type="number" label="Weight (kg)" min={30} max={300} value={data.weight ?? ""} onChange={(e) => updateData({ weight: num(e.target.value) })} />
      <Hint message={weightError} />

      {valid && bmi && (
        <p className="rounded-lg bg-[#E8F1EA] p-3 text-sm">
          Your BMI is <strong>{bmi}</strong> ({bmiCategory(bmi)}).
        </p>
      )}
    </StepShell>
  );
}