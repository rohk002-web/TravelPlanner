import React, { useState } from "react";
import GenerateItinerary from "../components/GenerateItinerary";
import ItineraryModal from "../components/ItineraryModal";
import ItineraryHistory from "../components/ItineraryHistory";
import { saveItinerary } from "../api/Api";
import toast from 'react-hot-toast';
import DetailedItineraryModal from "../components/DetailedItineraryModal";



const ItineraryPage = () => {

  const [input, setInput] = useState({
    destination: "",
    travel_style: "",
    no_of_persons: "",
    days: "",
    budget_min: "",
    budget_max: "",
  });

const handleSave = async (data: any) => {
  try {
    const response = await saveItinerary(data); 
    toast.success(response.message);
      setTimeout(() => {
      setModalOpen(false);
    }, 1000);
    
  } catch (err) {
    console.error(err);
    toast.error("Failed to save itinerary");
  }

};

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: ["no_of_persons", "days", "budget_min", "budget_max"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("/travel-plan", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(input),
    });
      const data = await response.json();
      setItinerary(data.itinerary);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary.");
    }
    setLoading(false);
  };

  return (
    <div>
    <div>
      <GenerateItinerary
        input={input}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onViewHistory={() => setHistoryOpen(true)}
        loading={loading}
      />

      <ItineraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        data={itinerary}
      />

      <ItineraryHistory
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
      />

      <DetailedItineraryModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      data={itinerary?.itinerary_data ?? itinerary}
    />
    </div>
    </div>
  );
};

export default ItineraryPage;