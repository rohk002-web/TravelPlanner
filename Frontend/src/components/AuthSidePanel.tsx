type AuthSidePanelFeature = {
  title: string;
  description: string;
};

type AuthSidePanelProps = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  accent?: "indigo" | "fuchsia";
  features: AuthSidePanelFeature[];
};

const AuthSidePanel = ({
  badge,
  title,
  subtitle,
  description,
  accent = "indigo",
  features,
}: AuthSidePanelProps) => {
  const orb1 = accent === "fuchsia" ? "bg-fuchsia-500/25" : "bg-indigo-500/25";
  const orb2 = accent === "fuchsia" ? "bg-indigo-500/20" : "bg-fuchsia-500/20";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
      <div className={`absolute -right-24 -top-24 h-64 w-64 rounded-full ${orb1} blur-3xl`} />
      <div className={`absolute -bottom-24 -left-24 h-64 w-64 rounded-full ${orb2} blur-3xl`} />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">{badge}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
          <span className="block text-slate-200">{subtitle}</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">{description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-semibold text-white">{f.title}</p>
              <p className="mt-1 text-xs text-slate-200">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthSidePanel;
