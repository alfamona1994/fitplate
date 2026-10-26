import { Card } from "@/components/ui/Card";
import { Meal, Targets } from "../dashboard.types";

export default function MealPlan({ meals, targets }: { meals: Meal[]; targets: Targets }) {
  return (
    <Card className="p-6">
      <h2 className="font-poppins text-xl font-semibold text-[#10261C]">Your meals today</h2>
      <p className="mt-1 text-sm text-[#5F7A6B]">
        Target: {targets.calories} kcal &middot; protein {targets.protein} g &middot; carbs {targets.carbs} g &middot; fat {targets.fat} g
      </p>
      <ul className="mt-4 divide-y divide-[#10261C]/10">
        {meals.map((m) => (
          <li key={m.slot} className="py-3">
            <p className="text-sm font-medium text-[#FF8A3D]">{m.slot} &middot; about {m.kcal} kcal</p>
            <p className="mt-1 text-[#10261C]">{m.name}</p>
            <p className="mt-1 text-sm text-[#5F7A6B]">Why: {m.why}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}