import React, { useState } from "react";
import GenerateItinerary from "../components/GenerateItinerary";
import ItineraryModal from "../components/ItineraryModal";

const ItineraryPage = () => {
  const [input, setInput] = useState({
    destination: "",
    travel_style: "",
    no_of_persons: "",
    days: "",
    budget_min: "",
    budget_max: "",
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      const response = await fetch("/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <GenerateItinerary
        input={input}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <ItineraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={itinerary}
      />
    </div>
  );
};

export default ItineraryPage;