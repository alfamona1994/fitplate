import { Card } from "@/components/ui/Card";
import type { ReactNode } from "react";

type Metric = {
  label: string;
  value: ReactNode;
};

export default function HealthSnapshot({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label} className="p-4">
          <p className="text-xs text-[#5F7A6B]">{m.label}</p>
          <p className="mt-1 font-poppins text-xl font-semibold text-[#10261C]">{m.value}</p>
        </Card>
      ))}
    </div>
  );
}