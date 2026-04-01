import clsx from "clsx";
import { NavLink, Outlet } from "react-router-dom";
import { env } from "@/lib/env";

const navigationItems = [
  { to: "/", label: "Home", end: true },
  { to: "/result", label: "Results" },
  { to: "/saved", label: "Saved" },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-brand-700">
              MVP Starter
            </p>
            <h1 className="text-lg font-semibold">{env.appName}</h1>
          </div>
          <nav className="flex gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-brand-700 text-white" : "text-stone-600 hover:bg-stone-100",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
