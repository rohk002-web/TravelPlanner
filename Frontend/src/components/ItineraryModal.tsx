import React, { useEffect, useMemo } from "react";

type ItineraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

type DayDetails = {
  plan?: string;
  hotel?: string;
  food?: string;
  [key: string]: unknown;
};

type NormalizedDay = {
  label: string;
  details: DayDetails;
};

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

const normalizeDays = (days: unknown): NormalizedDay[] => {
  if (!days) return [];

  if (Array.isArray(days)) {
    return days
      .map((d, idx) => ({
        label: `Day ${idx + 1}`,
        details: (d ?? {}) as DayDetails,
      }))
      .filter((d) => d.details && typeof d.details === "object");
  }

  if (typeof days === "object") {
    const entries = Object.entries(days as Record<string, unknown>);
    const dayEntries = entries
      .map(([key, value]) => {
        const raw = String(key);
        const label = /^day\s*\d+$/i.test(raw)
          ? toTitleCase(raw)
          : /^\d+$/.test(raw)
            ? `Day ${raw}`
            : toTitleCase(raw);

        return {
          key: raw,
          label,
          details: (value ?? {}) as DayDetails,
        };
      })
      .filter((d) => d.details && typeof d.details === "object");

    dayEntries.sort((a, b) => {
      const ax = a.key.match(/\d+/)?.[0];
      const bx = b.key.match(/\d+/)?.[0];
      const an = ax ? Number(ax) : Number.POSITIVE_INFINITY;
      const bn = bx ? Number(bx) : Number.POSITIVE_INFINITY;
      if (an !== bn) return an - bn;
      return a.label.localeCompare(b.label);
    });

    return dayEntries.map(({ label, details }) => ({ label, details }));
  }

  return [];
};

const InfoChip = ({ label, value }: { label: string; value: React.ReactNode }) => {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-white">{value}</div>
    </div>
  );
};

const SectionCard = ({ title, content }: { title: string; content?: string }) => {
  if (!content) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">{title}</div>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-100">
        {content}
      </p>
    </div>
  );
};

const ItineraryModal: React.FC<ItineraryModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const normalizedDays = useMemo(() => normalizeDays(data?.days), [data]);
  const place = data?.place ?? data?.destination;
  const travelStyle = data?.travel_style;
  const noOfPersons = data?.no_of_persons;
  const dayCount = data?.days_count ?? data?.days_total ?? data?.days;
  const totalEstimatedCost = data?.total_estimated_cost_inr ?? data?.total_estimated_cost;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-gradient-to-br from-slate-950/80 via-emerald-950/35 to-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex h-[82vh] w-full max-w-4xl flex-col rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-emerald-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Your itinerary</h2>
            <p className="mt-1 text-sm text-slate-300">
              {place ? toTitleCase(String(place)) : "Trip"}
              {travelStyle ? ` • ${toTitleCase(String(travelStyle))}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoChip label="Destination" value={place ? toTitleCase(String(place)) : undefined} />
          <InfoChip label="Travel style" value={travelStyle ? toTitleCase(String(travelStyle)) : undefined} />
          <InfoChip label="People" value={typeof noOfPersons === "number" ? noOfPersons : undefined} />
          <InfoChip label="Days" value={typeof dayCount === "number" ? dayCount : normalizedDays.length || undefined} />
          <InfoChip
            label="Budget"
            value={
              typeof data?.budget_min === "number" || typeof data?.budget_max === "number"
                ? `${data?.budget_min ?? "—"} - ${data?.budget_max ?? "—"}` : undefined
            }
          />
        </div>

        <div className="tp-scrollbar mt-4 min-h-0 flex-1 overflow-auto rounded-2xl border border-white/10 bg-slate-900 p-4">
          {!data ? (
            <div className="text-sm text-slate-200">No itinerary data.</div>
          ) : normalizedDays.length > 0 ? (
            <div className="space-y-4">
              {normalizedDays.map((day) => (
                <section key={day.label} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{day.label}</h3>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <SectionCard title="Plan" content={typeof day.details.plan === "string" ? day.details.plan : undefined} />
                    <SectionCard title="Hotel" content={typeof day.details.hotel === "string" ? day.details.hotel : undefined} />
                    <SectionCard title="Food" content={typeof day.details.food === "string" ? day.details.food : undefined} />
                  </div>

                  {Object.keys(day.details ?? {}).some((k) => !["plan", "hotel", "food"].includes(k)) ? (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {Object.entries(day.details ?? {})
                        .filter(([k, v]) => !["plan", "hotel", "food"].includes(k) && typeof v === "string" && v.trim())
                        .map(([k, v]) => (
                          <SectionCard key={k} title={toTitleCase(k)} content={String(v)} />
                        ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              <div className="text-sm font-semibold text-white">Itinerary</div>
              <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-100">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {totalEstimatedCost ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Total estimated cost
            </div>
            <div className="mt-1 text-base font-semibold text-white">{String(totalEstimatedCost)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ItineraryModal;