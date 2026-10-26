import OnboardingForm from "./onboardingForm";

// All onboarding steps live under /onboarding. The form keeps a step number (0 = Welcome,
// 1 = Basic profile, 2 = Goals, 3 = Diet, 4 = Lifestyle) and moves it up or down with Next/Back.
export default function OnboardingPage() {
  return <OnboardingForm />;
}