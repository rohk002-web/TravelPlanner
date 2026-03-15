const API_BASE = "http://localhost:8000";

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