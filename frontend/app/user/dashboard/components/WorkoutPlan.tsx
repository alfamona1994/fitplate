import { Card } from "@/components/ui/Card";
import { Session } from "../dashboard.types";

export default function WorkoutPlan({ sessions, progression }: { sessions: Session[]; progression: string[] }) {
  return (
    <Card className="p-6">
      <h2 className="font-poppins text-xl font-semibold text-[#10261C]">Your weekly workouts</h2>
      <ul className="mt-4 divide-y divide-[#10261C]/10">
        {sessions.map((s) => (
          <li key={s.day} className="py-3">
            <p className="text-sm font-medium text-[#1F6F4A]">{s.day} &middot; {s.title}</p>
            <p className="mt-1 text-[#10261C]">{s.details}</p>
            <p className="mt-1 text-sm text-[#5F7A6B]">Effort: {s.intensity}</p>
            <p className="text-sm text-[#5F7A6B]">Why: {s.why}</p>
          </li>
        ))}
      </ul>
      <h3 className="mt-5 font-poppins text-base font-semibold text-[#10261C]">How it progresses</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#3D5A4B]">
        {progression.map((r) => <li key={r}>{r}</li>)}
      </ul>
    </Card>
  );
}