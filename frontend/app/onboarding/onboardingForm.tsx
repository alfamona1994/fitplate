"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { OnboardingData, initialData, calcBmi } from "./onboarding.types";
import Welcome from "./steps/Welcome";
import BasicProfile from "./steps/BasicProfile";
import Goals from "./steps/Goals";
import DietPreferences from "./steps/DietPreferences";
import Lifestyle from "./steps/Lifestyle";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [data, setData] = useState<OnboardingData>(initialData);
  const { token, isLoading } = useAuth();
  const router = useRouter();

  // Only logged-in users can onboard
  useEffect(() => {
    if (!isLoading && !token) router.replace("/login");
  }, [isLoading, token, router]);

  const updateData = (updates: Partial<OnboardingData>) => setData((prev) => ({ ...prev, ...updates }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const start = async () => {
    if (isStarting) return;
    setIsStarting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsStarting(false);
    next();
  };

  const finish = async () => {
    const profile = { ...data, bmi: calcBmi(data.height, data.weight) };

    // Keep a copy in the browser as a backup
    try {
      localStorage.setItem("fitplate_profile", JSON.stringify(profile));
    } catch {}

    // Save to the Flask backend
    try {
      await fetch(`${API}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
    } catch (error) {
      console.error("Could not save profile to the server:", error);
    }

    router.push("/user/dashboard");
  };

  if (isLoading || !token) return null;

  const props = { data, updateData, onBack: back };
  return (
    <>
      {step === 0 && <Welcome start={start} isStarting={isStarting} />}
      {step === 1 && <BasicProfile {...props} onNext={next} />}
      {step === 2 && <Goals {...props} onNext={next} />}
      {step === 3 && <DietPreferences {...props} onNext={next} />}
      {step === 4 && <Lifestyle {...props} onNext={finish} />}
    </>
  );
}