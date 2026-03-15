import { useState } from "react";
import CreateUserForm from "../components/CreateUserForm";

type CreateUserInput = {
  email_id: string;
  password: string;
  name: string;
};

const CreateUserPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateUser = async (data: CreateUserInput) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/create-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const created = await res.json();
        setMessage(`User ${created.name} created successfully!`);
        return true;
      }

      const err = await res.json();
      setMessage(err.detail || "Something went wrong!");
      return false;
    } catch {
      setMessage("Network error!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 lg:col-span-7">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">Start planning</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Create an account.
            <span className="block text-slate-200">Get AI travel itineraries that feel handcrafted.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">
            Save trips, iterate faster, and generate beautiful day-by-day plans with food spots, attractions, and
            time-smart routing.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-white">Budget-aware</p>
              <p className="mt-1 text-xs text-slate-200">Hostels to luxury—fit your spend perfectly.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-white">Interest-based</p>
              <p className="mt-1 text-xs text-slate-200">Beaches, museums, cafés, nightlife, nature—your call.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:col-span-5 lg:flex lg:items-center">
        <CreateUserForm onSubmit={handleCreateUser} loading={loading} message={message} />
      </section>
    </div>
  );
};

export default CreateUserPage;
