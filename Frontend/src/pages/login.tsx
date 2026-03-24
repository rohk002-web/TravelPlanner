import { useState } from "react";
import AuthSidePanel from "../components/AuthSidePanel";
import LoginUserForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import  { toast } from "react-hot-toast";

type LoginUserInput = {
  email_id: string;
  password: string;
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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
        const payload = await res.json();
        if (payload?.token) {
          localStorage.setItem("token", payload.token);
        }
        if (payload?.user_id) {
          localStorage.setItem("user_id", payload.user_id);
        }
        toast.success(payload?.message || "Logged in successfully!");
        navigate("/itinerary");
        return;
      }

      const err = await res.json();
      toast.error(err.detail || "Invalid credentials");
    } catch {
      toast.error("Network error!");
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
