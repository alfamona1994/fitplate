import { Card } from "@/components/ui/Card";

export default function GreetingCard({ name, goal }: { name: string; goal: string }) {
  return (
    <Card className="p-8">
      <h1 className="font-poppins text-3xl font-semibold">Hello, {name.split(" ")[0]}</h1>
      <p className="mt-2 text-[#B9D4C3]">
        Here is your personalised plan for your goal: <strong className="text-white">{goal.toLowerCase()}</strong>.
      </p>
    </Card>
  );
}

