import { cookies, headers } from "next/headers";
import { detectLang, getT, type Lang } from "@/lib/i18n";

export default async function ChangelogPage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const lang = (cookieStore.get("orbit_lang")?.value as Lang) || detectLang(headersList.get("accept-language"));
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <a href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</a>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.changelog_title}</h1>
      <p className="text-white/30 mb-12">{t.changelog_desc}</p>

      <div className="space-y-10">
        {[
          { version: "v0.5", date: "2026-05-13", changes: [
            "Landing page & documentation website with i18n (zh/en)",
            "Mouse long-press delete with animated trash bubble",
            "Ctrl+Z undo for deleted tasks and focus blocks",
            "Week view liquid glass focus block redesign",
            "Orbit Plan task property with methodology glow",
            "Click-to-enter methodology from focus arcs and cards",
          ]},
          { version: "v0.4", date: "2026-05-10", changes: [
            "Week & month view navigation",
            "Focus block creation via click-twice on clock",
            "Method picker popup after focus creation",
            "Focus block arc overlap-aware ring assignment",
            "Liquid glass card reveal animations",
          ]},
          { version: "v0.3", date: "2026-04-28", changes: [
            "Orbit Mode with focus block system",
            "Six methodology panels (GTD, Pomodoro, Pareto, Moffatt, Howell, SWOT)",
            "24-hour radial clock with comet trails",
          ]},
          { version: "v0.2", date: "2026-04-20", changes: [
            "Inline task creation on the clock face",
            "Schedule card distribution with overlap avoidance",
            "Connector arrow system for clock-to-card connections",
            "Progress bar and inline time editing",
          ]},
          { version: "v0.1", date: "2026-04-15", changes: [
            "Initial release with Canvas 2D orbital clock",
            "Task CRUD with localStorage persistence",
            "Keyboard shortcuts and day navigation",
            "Constructivist cosmic visual theme",
          ]},
        ].map((v) => (
          <div key={v.version}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-sm font-semibold text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{v.version}</span>
              <span className="text-xs text-white/15">{v.date}</span>
            </div>
            <ul className="space-y-1.5">
              {v.changes.map((c) => (
                <li key={c} className="text-sm text-white/30 flex items-start gap-2">
                  <span className="text-white/10 mt-0.5">&bull;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
