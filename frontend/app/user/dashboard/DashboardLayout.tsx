"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { OnboardingData, bmiCategory } from "../../onboarding/onboarding.types";
import { Plan } from "./dashboard.types";
import GreetingCard from "./components/GreetingCard";
import HealthSnapshot from "./components/HealthSnapshot";
import WorkoutPlan from "./components/WorkoutPlan";
import MealPlan from "./components/MealPlan";
import SafetyNotice from "./components/SafetyNotice";
import Assistant from "./components/Assistant";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function DashboardLayout() {
  const { token, isLoading, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("there");
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!token) { router.replace("/login"); return; }
    (async () => {
      let p: OnboardingData | null = null;
      try {
        const res = await fetch(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { const d = await res.json(); if (d.name) setName(d.name); p = d.profile; }
      } catch {}
      if (!p) { try { p = JSON.parse(localStorage.getItem("fitplate_profile") ?? "null"); } catch {} }
      if (!p) { router.replace("/onboarding"); return; }
      try {
        const res = await fetch(`${API}/plan`, { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        if (!res.ok) { setError(d.message ?? "Could not load your plan."); return; }
        setPlan(d);
      } catch {
        setError("Could not reach the server. Make sure the backend is running.");
        return;
      }
      setProfile(p);
    })();
  }, [isLoading, token, router]);

  if (!profile || !plan) return <main className="flex min-h-screen items-center justify-center bg-[#F2F6F1] text-[#3D5A4B]">{error || "Preparing your plan..."}</main>;

  const metrics = [
    { label: "BMI", value: profile.bmi ? `${profile.bmi} (${bmiCategory(profile.bmi)})` : "-" },
    { label: "Daily calories", value: `${plan.targets.calories} kcal` },
    { label: "Daily protein", value: `${plan.targets.protein} g` },
    { label: "Training days", value: profile.daysPerWeek ?? "-" },
  ];

  return (
    <main className="min-h-screen bg-[#F2F6F1] font-inter text-[#10261C]">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <header className="flex items-center justify-between">
          <Logo />
          <Button variant="outline" onClick={() => { logout(); router.push("/landing"); }}>Sign out</Button>
        </header>
        <GreetingCard name={name} goal={profile.goal ?? "Stay fit"} />
        <HealthSnapshot metrics={metrics} />
        {plan.flags.length > 0 && <SafetyNotice flags={plan.flags} />}
        <div className="grid gap-6 lg:grid-cols-2">
          <WorkoutPlan sessions={plan.sessions} progression={plan.progression} />
          <MealPlan meals={plan.meals} targets={plan.targets} />
        </div>
      </div>
      <Assistant />
    </main>
  );
}