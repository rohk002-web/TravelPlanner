const API_BASE = import.meta.env.VITE_API_BASE;;

export async function createUser(data: { email_id: string; password: string; name: string }) {
  const res = await fetch(`${API_BASE}/create-users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function loginUser(data: { email_id: string; password: string }) {
  const res = await fetch(`${API_BASE}/login-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function generateTravelPlan(data: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/travel-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function saveItinerary(data: any) {
  const token = localStorage.getItem("token"); 

  const res = await fetch(`${API_BASE}/save-itinerary`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify({ itinerary_data: data }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getItineraryHistory() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/get-itinerary`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getItineraryById(itinerary_id: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/get-itinerary-id/${itinerary_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await res.json();
  return res.json(); 
}

export async function handleDeleteItinerary(itinerary_id: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/delete-itinerary/${itinerary_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export const downloadItinerary = async (itineraryId: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/download-itinerary/${itineraryId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/pdf',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download itinerary');
  }

  // Handle the file download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `itinerary-${itineraryId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  return response;
};