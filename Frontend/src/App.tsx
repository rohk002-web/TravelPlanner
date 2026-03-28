import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./pages/login";
import CreateUserPage from "./pages/create-user";
import ItineraryPage from "./pages/Itinerary";
import { Toaster } from "react-hot-toast"; 
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const hideLogout = location.pathname === "/login" || location.pathname === "/create-user";
  const showLogout = Boolean(token) && !hideLogout;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.success("Logged out successfully", { duration: 2000 });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/40 backdrop-blur">
        <div className="flex max-w-6xl items-center justify-between px-4 py-4">
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20">
        AI
      </span>
      <span className="text-base sm:text-lg">Travel Planner</span>
    </Link>

    {/* Logout button */}
    {showLogout && (
      <button
        onClick={handleLogout}
        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700"
      >
        <LogOut size={18} />
        Logout
      </button>
    )}
  </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pb-14 sm:pt-20">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/Itinerary" element={<ItineraryPage />} />
          <Route
            path="*"
            element={
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                <section className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    AI-powered itineraries in seconds
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                    Plan smarter trips with an
                    <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent ml-20"> AI Travel Planner</span>
                  </h1>

                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200">
                    Tell us your budget, days, interests, and travel style. Get a beautiful day-by-day itinerary with
                    must-see spots, food recommendations, and time-smart routes.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/create-user"
                      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
                    >
                      I already have an account
                    </Link>
                  </div>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold">Personalized</p>
                      <p className="mt-1 text-xs text-slate-200">Interests, pace, and budget tuned to you.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold">Optimized</p>
                      <p className="mt-1 text-xs text-slate-200">Less backtracking, more experiences.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold">Beautiful</p>
                      <p className="mt-1 text-xs text-slate-200">Clean, shareable, day-by-day plans.</p>
                    </div>
                  </div>
                </section>

                <aside className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl shadow-indigo-500/10">
                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
                    <div className="relative">
                      <p className="text-sm font-semibold text-slate-100">Example itinerary</p>
                      <p className="mt-1 text-xs text-slate-200">3 days • Goa • beaches + food + culture</p>

                      <div className="mt-5 space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                          <p className="text-xs font-semibold text-slate-100">Day 1</p>
                          <p className="mt-1 text-xs text-slate-200">Sunrise beach walk, café brunch, fort sunset.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                          <p className="text-xs font-semibold text-slate-100">Day 2</p>
                          <p className="mt-1 text-xs text-slate-200">Water sports, local market, seafood dinner.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                          <p className="text-xs font-semibold text-slate-100">Day 3</p>
                          <p className="mt-1 text-xs text-slate-200">Temple visit, hidden spots, departure plan.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppLayout />
    </Router>
  );
};

export default App;