import React from "react";

type ItineraryInput = {
  destination: string;
  travel_style: string;
  no_of_persons: string;
  days: string;
  budget_min: string;
  budget_max: string;
};

type GenerateItineraryProps = {
  input: ItineraryInput;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => Promise<void>;
  onViewHistory: () => void;
  loading: boolean;
};

const GenerateItinerary: React.FC<GenerateItineraryProps> = ({ input, onChange, onSubmit,onViewHistory, loading }) => {
  return (
         <div className="mx-auto max-w-6xl relative">
       <div className="flex justify-end mb-4 sm:absolute sm:top-9 sm:right-4 sm:mb-0">
        <button
          onClick={onViewHistory}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition"
        >
          View Itinerary History
        </button>
      </div>
      <header className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">AI Travel Planner</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Generate your itinerary
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          Enter your preferences and generate a custom itinerary instantly.
        </p>
      </header>

      {/* Input Form */}
      <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="destination"
            placeholder="Destination (e.g., Bali)"
            value={input.destination}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/60 focus:bg-slate-950/40"
          />
          <select
            name="travel_style"
            value={input.travel_style}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/60 focus:bg-slate-950/40"
          >
            <option value="">Select travel style</option>
            <option value="romantic">Romantic</option>
            <option value="adventure">Adventure</option>
            <option value="family">Family</option>
            <option value="luxury">Luxury</option>
          </select>
          <input
            type="text"
            name="no_of_persons"
            placeholder="Number of persons"
            value={input.no_of_persons || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none transition focus:border-indigo-400/60 focus:bg-slate-950/80"
          />

          <input
            type="text"
            name="days"
            placeholder="Number of Days"
            value={input.days || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none transition focus:border-indigo-400/60 focus:bg-slate-950/80"
          />

          <input
            type="text"
            name="budget_min"
            placeholder="Min Budget"
            value={input.budget_min || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/60 focus:bg-slate-950/40"
          />

          <input
            type="text"
            name="budget_max"
            placeholder="Max Budget"
            value={input.budget_max || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/60 focus:bg-slate-950/40"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || !input.destination || !input.travel_style}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating..." : (
            <>
              Generate Itinerary
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerateItinerary;