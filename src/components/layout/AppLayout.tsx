import { Outlet } from "react-router-dom";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <main className="min-h-screen">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
