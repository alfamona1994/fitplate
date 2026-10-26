import Link from "next/link";
import { Logo, APP_NAME } from "../../components/ui/Logo";

const points = [
  {
    title: "Exercise and meals in one plan",
    text: "Most apps cover training or nutrition, not both. FitPlate builds one plan so what you eat supports how you train.",
  },
  {
    title: "Plans that change as you do",
    text: "Log your weight, workouts and meals. Recommendations adjust to your progress instead of staying fixed.",
  },
  {
    title: "Every suggestion comes with a reason",
    text: "You see why a meal or workout was chosen. If your profile suggests a health condition, we tell you to speak to a professional.",
  },
];

const sample = [
  { time: "Morning", item: "30 min brisk walk", why: "Low activity level, goal: lose weight" },
  { time: "Lunch", item: "Beans, plantain and vegetable stew", why: "High fibre, fits your vegetarian preference" },
  { time: "Evening", item: "20 min bodyweight circuit", why: "Builds strength without equipment" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F2F6F1] text-[#10261C] font-inter">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="hidden items-center gap-8 text-[#3D5A4B] md:flex">
          <a href="#how" className="hover:text-[#1F6F4A]">How it works</a>
          <a href="#safety" className="hover:text-[#1F6F4A]">Safety</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-3 py-2 text-sm font-medium text-[#1F6F4A] hover:underline">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#1F6F4A] px-4 py-2 text-sm font-medium text-white hover:bg-[#175a3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D] focus-visible:ring-offset-2"
          >
            Create account
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-poppins text-4xl font-semibold leading-tight sm:text-5xl">
            Your exercise and meal plan, built around you and updated as you progress.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#3D5A4B]">
            Tell us your body measurements, goal, food preferences and activity level. {APP_NAME} uses artificial
            intelligence to suggest workouts and meals that fit your life.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-[#FF8A3D] px-6 py-3 font-medium text-[#10261C] hover:bg-[#f37a28] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10261C] focus-visible:ring-offset-2"
            >
              Get my plan
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-[#10261C]/30 px-6 py-3 font-medium hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F4A]"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-[#10261C] p-6 text-white sm:p-8" aria-label="Example daily plan">
          <p className="text-sm text-[#B9D4C3]">Example plan for one day</p>
          <ul className="mt-4 divide-y divide-white/15">
            {sample.map((s) => (
              <li key={s.item} className="py-4">
                <p className="text-sm text-[#FF8A3D]">{s.time}</p>
                <p className="mt-1 font-poppins text-lg font-medium">{s.item}</p>
                <p className="mt-1 text-sm text-[#B9D4C3]">Why: {s.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-poppins text-3xl font-semibold">How {APP_NAME} helps</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {points.map((p) => (
              <div key={p.title} className="border-t-2 border-[#1F6F4A] pt-5">
                <h3 className="font-poppins text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-[#3D5A4B]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="safety" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-poppins text-3xl font-semibold">A wellness aid, not a doctor</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#3D5A4B]">
            {APP_NAME} gives general exercise and nutrition guidance. It does not diagnose conditions or replace
            medical advice. If you have diabetes, heart disease, high blood pressure or an injury, check with a
            healthcare professional before following any plan.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-[#1F6F4A] px-6 py-3 font-medium text-white hover:bg-[#175a3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D] focus-visible:ring-offset-2"
          >
            Create your free account
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#10261C]/15 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <Logo />
          <p className="text-sm text-[#3D5A4B]">
            &copy; 2026 {APP_NAME}. Built as an M.Sc. research project, University of Jos.
          </p>
        </div>
      </footer>
    </main>
  );
}