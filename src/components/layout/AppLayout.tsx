import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
