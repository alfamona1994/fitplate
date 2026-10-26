export interface Metric { label: string; value: string; }
export interface Session { day: string; title: string; details: string; intensity: string; why: string; }
export interface Meal { slot: string; name: string; kcal: number; why: string; }
export interface Targets { calories: number; protein: number; carbs: number; fat: number; }
export interface SafetyFlag { id: string; level: "consult" | "info"; message: string; }

export interface Plan {
  targets: Targets;
  sessions: Session[];
  progression: string[];
  meals: Meal[];
  flags: SafetyFlag[];
}