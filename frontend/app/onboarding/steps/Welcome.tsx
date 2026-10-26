"use client";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { APP_NAME } from "../../../components/ui/Logo";

export default function Welcome({ start, isStarting }: { start: () => void; isStarting: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F6F1] p-6 font-inter text-[#10261C]">
      <Card className="w-full max-w-xl space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="font-poppins text-3xl font-semibold">Welcome to {APP_NAME}</h1>
          <p className="text-[#3D5A4B]">Let&apos;s build an exercise and meal plan that fits you.</p>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-[#3D5A4B]">
          <p>The next four steps ask about your body, goals, food preferences and health. There are no right or wrong answers, only honest ones.</p>
          <p>Your answers let our AI:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Estimate how much energy your body needs</li>
            <li>Choose workouts that match your level and equipment</li>
            <li>Suggest meals that fit your diet, allergies and budget</li>
            <li>Avoid advice that could be unsafe for your health conditions</li>
          </ul>
        </div>

        <div className="rounded-lg bg-[#E8F1EA] p-4 text-sm">
          About <strong>3 minutes</strong> &middot; <strong>4 short steps</strong>
        </div>

        <Button size="lg" className="w-full" onClick={start} disabled={isStarting}>
          {isStarting ? "Getting things ready..." : "Let's begin →"}
        </Button>

        <p className="text-center text-xs text-[#5F7A6B]">
          Your information stays private and is used only to personalise your plan. {APP_NAME} gives general wellness guidance, not medical advice.
        </p>
      </Card>
    </main>
  );
}