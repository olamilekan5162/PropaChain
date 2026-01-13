import { Outlet } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MobileHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}
