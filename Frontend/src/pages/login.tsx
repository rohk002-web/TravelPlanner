import { useState } from "react";
import AuthSidePanel from "../components/AuthSidePanel";
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
      <div className="lg:col-span-7">
        <AuthSidePanel
          badge="AI Travel Planner"
          title="Welcome back."
          subtitle="Let’s finish your next itinerary."
          description="Log in to access saved plans, refine destinations, and generate day-by-day travel routes with AI."
          accent="indigo"
          features={[
            {
              title: "Smart schedules",
              description: "Auto-arranged days based on distance and time.",
            },
            {
              title: "Local picks",
              description: "Food, culture, and hidden gems tailored to you.",
            },
          ]}
        />
      </div>

      <section className="lg:col-span-5 lg:flex lg:items-center">
        <LoginUserForm onSubmit={handleLogin} loading={loading} message={message} />
      </section>
    </div>
  );
};

export default LoginPage;
