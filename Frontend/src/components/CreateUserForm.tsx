import React, { useState } from "react";

interface CreateUserInput {
  email_id: string;
  password: string;
  name: string;
}

type CreateUserFormProps = {
  onSubmit: (data: CreateUserInput) => Promise<boolean>;
  loading: boolean;
  message: string | null;
};

const CreateUserForm = ({ onSubmit, loading, message }: CreateUserFormProps) => {
  const [formData, setFormData] = useState<CreateUserInput>({
    email_id: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = await onSubmit(formData);
    if (ok) {
      setFormData({ email_id: "", password: "", name: "" });
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-fuchsia-500/10 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Create your account</h2>
            <p className="mt-1 text-sm text-slate-200">Start generating personalized itineraries instantly.</p>
          </div>
          <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-sm font-semibold text-white sm:flex">
            AI
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-fuchsia-400/60 focus:bg-slate-950/40 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-200">Email</span>
            <input
              type="email"
              name="email_id"
              value={formData.email_id}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-fuchsia-400/60 focus:bg-slate-950/40 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-200">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={4}
              placeholder="••••••••"
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-fuchsia-400/60 focus:bg-slate-950/40 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create User"}
          </button>

          {message && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-100">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;