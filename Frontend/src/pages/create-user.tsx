import { useState } from "react";
import AuthSidePanel from "../components/AuthSidePanel";
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
      <div className="lg:col-span-7">
        <AuthSidePanel
          badge="Start planning"
          title="Create an account."
          subtitle="Get AI travel itineraries that feel handcrafted."
          description="Save trips, iterate faster, and generate beautiful day-by-day plans with food spots, attractions, and time-smart routing."
          accent="fuchsia"
          features={[
            {
              title: "Budget-aware",
              description: "Hostels to luxury—fit your spend perfectly.",
            },
            {
              title: "Interest-based",
              description: "Beaches, museums, cafés, nightlife, nature—your call.",
            },
          ]}
        />
      </div>

      <section className="lg:col-span-5 lg:flex lg:items-center">
        <CreateUserForm onSubmit={handleCreateUser} loading={loading} message={message} />
      </section>
    </div>
  );
};

export default CreateUserPage;
