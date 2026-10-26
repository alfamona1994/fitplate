import { SafetyFlag } from "../dashboard.types";

export default function SafetyNotice({ flags }: { flags: SafetyFlag[] }) {
  return (
    <section aria-label="Safety notes" className="rounded-2xl bg-[#FFF1E5] p-6 text-[#7A3B00]">
      <h2 className="font-poppins text-lg font-semibold">Safety notes</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {flags.map((f) => (
          <li key={f.id}>
            <strong>{f.level === "consult" ? "Talk to a professional: " : "Tip: "}</strong>
            {f.message}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs">This is general wellness guidance, not medical advice.</p>
    </section>
  );
}