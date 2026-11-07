import { Info } from "lucide-react";

interface LimitationsListProps {
  limitations: string[] | null | undefined;
  title?: string;
  emptyMessage?: string;
}

export function LimitationsList({
  limitations,
  title = "Analysis limitations",
  emptyMessage = "No limitations were reported.",
}: LimitationsListProps) {
  const values = Array.isArray(limitations)
    ? limitations.filter(
        (limitation): limitation is string =>
          typeof limitation === "string" && limitation.trim().length > 0,
      )
    : [];

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-center gap-2">
        <Info aria-hidden="true" className="h-4 w-4 text-amber-600" />
        <h3 className="text-xs md:text-sm font-semibold tracking-[0.08em] text-amber-950 uppercase">
          {title}
        </h3>
      </div>
      {values.length === 0 ? (
        <p className="mt-2 text-sm md:text-base leading-6 text-amber-900/70">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {values.map((limitation, index) => (
            <li
              key={`${limitation}-${index}`}
              className="flex gap-2 text-sm md:text-base leading-6 text-amber-950/85"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber-500"
              />
              <span>{limitation}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
