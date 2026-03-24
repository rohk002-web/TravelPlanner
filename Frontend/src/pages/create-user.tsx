import { useState } from "react";
import AuthSidePanel from "../components/AuthSidePanel";
import CreateUserForm from "../components/CreateUserForm";
import{toast} from "react-hot-toast";
import { createUser } from "../api/Api";

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
    const created = await createUser(data);

    toast.success(`User ${created.name} created successfully!`);
    return true;
  } catch (err: any) {
    toast.error(err.detail || "Something went wrong!");
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
