import { useState } from "react";
import LoginUserForm from "../components/LoginForm";

type LoginUserInput = {
  email_id: string;
  password: string;
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (data: LoginUserInput) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/login-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage("Login successful!");
        return;
      }

      const err = await res.json();
      setMessage(err.detail || "Invalid credentials");
    } catch {
      setMessage("Network error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 lg:col-span-7">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">AI Travel Planner</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome back.
            <span className="block text-slate-200">Let’s finish your next itinerary.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">
            Log in to access saved plans, refine destinations, and generate day-by-day travel routes with AI.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-white">Smart schedules</p>
              <p className="mt-1 text-xs text-slate-200">Auto-arranged days based on distance and time.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-white">Local picks</p>
              <p className="mt-1 text-xs text-slate-200">Food, culture, and hidden gems tailored to you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:col-span-5 lg:flex lg:items-center">
        <LoginUserForm onSubmit={handleLogin} loading={loading} message={message} />
      </section>
    </div>
  );
};

export default LoginPage;
