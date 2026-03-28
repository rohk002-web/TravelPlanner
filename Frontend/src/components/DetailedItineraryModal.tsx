import React, { useEffect, useMemo } from "react";
import { Download , X } from "lucide-react";
import { downloadItinerary } from "../api/Api";

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

type DetailedItineraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

const normalizeDays = (days: unknown): NormalizedDay[] => {
  if (!days) return [];
  if (typeof days === "object" && !Array.isArray(days)) {
    return Object.entries(days)
      .map(([key, value]) => ({
        key,
        label: /^day\s*\d+/i.test(key) ? toTitleCase(key) : key,
        details: value as DayDetails,
      }))
      .sort((a, b) => {
        const aNum = Number(a.key.match(/\d+/)?.[0] ?? Infinity);
        const bNum = Number(b.key.match(/\d+/)?.[0] ?? Infinity);
        return aNum - bNum;
      })
      .map(({ label, details }) => ({ label, details }));
  }
  return [];
};

const SectionCard = ({ title, content }: { title: string; content?: string }) => {
  if (!content) return null;
  return (
    <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-pink-900/40 p-3 rounded-xl border border-white/20 backdrop-blur-sm hover:scale-[1.02] transition-transform shadow-lg shadow-purple-900/30">
      <div className="text-sm font-semibold text-purple-300 uppercase tracking-wide">{title}</div>
      <p className="mt-1 text-sm text-white whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
};

const DetailedItineraryModal: React.FC<DetailedItineraryModalProps> = ({ isOpen, onClose, data }) => {
  const itinerary = data?.itinerary_data ?? data;
  const itineraryId = data?.id;

  const handleDownload = async () => {
    if (!itineraryId) {
      console.error("No itinerary ID found for download");
      return;
    }
    try {
      await downloadItinerary(itineraryId);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const normalizedDays = useMemo(() => normalizeDays(itinerary?.days), [itinerary]);
  const place = itinerary?.place;
  const travelStyle = itinerary?.travel_style;
  const noOfPersons = itinerary?.no_of_persons;
  const totalEstimatedCost = itinerary?.total_estimated_cost_inr;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-gray-900/90 rounded-3xl shadow-2xl shadow-purple-900/50 border border-purple-700/30 max-h-[85vh] overflow-y-auto p-5 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-center items-start mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-400 tracking-tight">
              Your Itinerary
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-1">
              {place && toTitleCase(place)}
              {travelStyle ? ` • ${toTitleCase(travelStyle)}` : ""} • {noOfPersons}{" "}
              {noOfPersons === 1 ? "Person" : "People"}
            </p>

          </div>
          <div className="flex gap-3">
           <button className="absolute top-3 right-10 text-white hover:text-purple-400 transition-colors p-2"
            onClick={handleDownload}>
            <Download size={20} />
            </button>
              
              <button
                onClick={onClose}
                className="absolute top-3 right-0 text-white hover:text-purple-400 transition-colors p-2"
            >
                <X size={24} />
            </button>


        </div>
        
          </div>
        

        {/* Overview Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {place && (
            <div className="p-2 bg-purple-900/50 rounded-lg text-white font-semibold text-center text-sm">
              {toTitleCase(place)}
            </div>
          )}
          {travelStyle && (
            <div className="p-2 bg-purple-900/50 rounded-lg text-white font-semibold text-center text-sm">
              {toTitleCase(travelStyle)}
            </div>
          )}
          {noOfPersons && (
            <div className="p-2 bg-purple-900/50 rounded-lg text-white font-semibold text-center text-sm">
              {noOfPersons} {noOfPersons === 1 ? "Person" : "People"}
            </div>
          )}
          {totalEstimatedCost && (
            <div className="p-2 bg-purple-900/50 rounded-lg text-white font-semibold text-center text-sm">
              {totalEstimatedCost}
            </div>
          )}
        </div>

        {/* Days */}
        <div className="space-y-5">
          {normalizedDays.map((day) => (
            <section
              key={day.label}
              className="bg-gradient-to-r from-purple-900/70 via-indigo-900/60 to-pink-900/70 p-4 rounded-2xl border border-white/10 shadow-lg shadow-black/25"
            >
              <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3">{day.label}</h3>
              <div className="grid gap-3 lg:grid-cols-3">
                <SectionCard
                  title="Plan"
                  content={typeof day.details.plan === "string" ? day.details.plan : String(day.details.plan ?? "")}
                />
                <SectionCard
                  title="Hotel"
                  content={typeof day.details.hotel === "string" ? day.details.hotel : String(day.details.hotel ?? "")}
                />
                <SectionCard
                  title="Food"
                  content={typeof day.details.food === "string" ? day.details.food : String(day.details.food ?? "")}
                />
              </div>

              {/* Extra Fields */}
              {Object.keys(day.details ?? {}).some((k) => !["plan", "hotel", "food"].includes(k)) && (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {Object.entries(day.details)
                    .filter(([k]) => !["plan", "hotel", "food"].includes(k))
                    .map(([k, v]) => (
                      <SectionCard
                        key={k}
                        title={toTitleCase(k)}
                        content={typeof v === "string" ? v : String(v ?? "")}
                      />
                    ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer */}
        {totalEstimatedCost && (
          <div className="mt-5 p-3 bg-gradient-to-r from-purple-700/50 via-pink-700/40 to-indigo-700/50 rounded-xl text-white font-bold text-center text-base shadow-lg shadow-purple-900/40">
            Total Estimated Cost: {totalEstimatedCost}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedItineraryModal;