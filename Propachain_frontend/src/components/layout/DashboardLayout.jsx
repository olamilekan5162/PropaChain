import { Outlet } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader showSearch={false} />

      <main className="flex-1">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}
