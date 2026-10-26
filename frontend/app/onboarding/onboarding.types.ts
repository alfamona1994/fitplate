export interface OnboardingData {
  // Step 1: Basic profile
  age: number | null;
  gender: string | null;
  height: number | null; // cm
  weight: number | null; // kg
  bmi: number | null;

  // Step 2: Goals and training
  goal: string | null;
  experience: string | null;
  daysPerWeek: string | null;
  equipment: string | null;

  // Step 3: Diet preferences
  dietType: string | null;
  allergies: string[];
  mealsPerDay: string | null;
  budget: string | null;

  // Step 4: Lifestyle and health
  activityLevel: string | null;
  sleepHours: number | null;
  conditions: string[];
  medications: string[];   // ← add this line
  
}

export const initialData: OnboardingData = {
  age: null, gender: null, height: null, weight: null, bmi: null,
  goal: null, experience: null, daysPerWeek: null, equipment: null,
  dietType: null, allergies: [], mealsPerDay: null, budget: null,
  activityLevel: null, sleepHours: null, conditions: [], medications: [],
};

export interface StepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const num = (v: string) => (v === "" ? null : Number(v));

export function calcBmi(height: number | null, weight: number | null): number | null {
  if (!height || !weight) return null;
  const m = height / 100;
  return Number((weight / (m * m)).toFixed(1));
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "healthy range";
  if (bmi < 30) return "overweight";
  return "obese range";
}