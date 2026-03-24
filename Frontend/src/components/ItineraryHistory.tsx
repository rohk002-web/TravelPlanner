import React, { useEffect, useState } from "react";
import { getItineraryHistory, getItineraryById } from "../api/Api";
import DetailedItineraryModal from "./DetailedItineraryModal";
import { Trash, X } from "lucide-react";
import { handleDeleteItinerary } from "../api/Api";

type ItineraryData = {
  place: string;
  travel_style: string;
  days: number;
  budget_min: number;
  budget_max: number;
};

type ItineraryItem = {
  id: string;
  itinerary_data: ItineraryData;
};

type ItineraryHistoryProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ItineraryHistory: React.FC<ItineraryHistoryProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch history whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const deleteItinerary = async (id: string) => {
  try {
    await handleDeleteItinerary(id); // Call the API to delete
    // Update local state to remove the deleted item
    setHistory((prev) => prev.filter((item) => item.id !== id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete itinerary.");
  }
};

  // Fetch itinerary history from backend
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getItineraryHistory(); 
      setHistory(data.itineraries || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch itinerary history.");
    }
    setLoading(false);
  };

  // Fetch single itinerary by ID and open modal
  const viewItinerary = async (id: string) => {
    try {
      const data = await getItineraryById(id); // uses API_BASE + JWT
      setSelectedItinerary(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch itinerary.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-slate-900 text-white p-6 rounded-xl max-w-3xl w-full">
        <h2 className="text-xl font-bold mb-4">Itinerary History</h2>
        <button
          className="absolute top-4 right-4 text-white text-xl font-bold"
          onClick={onClose}
        >
          <X size={21} />
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No itineraries found.</p>
        ) : (
<ul className="space-y-2 max-h-96 overflow-y-auto">
  {history.map((item) => (
    <li
      key={item.id}
      className="relative cursor-pointer rounded-lg border border-white/20 p-3 hover:bg-slate-800 transition"
      onClick={() => viewItinerary(item.id)}
    >
      {/* Trash icon for deletion */}
      <Trash
        size={16}
        className="absolute right-3 top-3 text-red-500 hover:text-red-700"
        onClick={(e) => {
          e.stopPropagation(); 
           deleteItinerary(item.id);
        }}
      />

      {/* Itinerary info */}
      <p className="font-semibold">
        {item.itinerary_data?.place || "Unknown place"} (
        {item.itinerary_data?.travel_style || "N/A"})
      </p>
    </li>
  ))}
</ul>
        )}

        {/* Single itinerary modal */}
        <DetailedItineraryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data={selectedItinerary}
        />
      </div>
    </div>
  );
};

export default ItineraryHistory;