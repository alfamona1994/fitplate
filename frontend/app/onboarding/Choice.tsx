"use client";

const base = "rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D]";
const on = "border-[#1F6F4A] bg-[#1F6F4A] text-white";
const off = "border-[#10261C]/25 bg-white hover:border-[#1F6F4A]";

export function ChoiceGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string | null; onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)} className={`${base} ${value === o ? on : off}`}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// Pick several. Choosing "None" clears the rest, and choosing anything else removes "None".
export function MultiChoiceGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (o: string) => {
    if (o === "None") return onChange(value.includes("None") ? [] : ["None"]);
    const rest = value.filter((v) => v !== "None");
    onChange(rest.includes(o) ? rest.filter((v) => v !== o) : [...rest, o]);
  };
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value.includes(o)} onClick={() => toggle(o)} className={`${base} ${value.includes(o) ? on : off}`}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}