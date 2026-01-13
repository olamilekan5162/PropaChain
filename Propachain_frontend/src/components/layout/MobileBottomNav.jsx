import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/marketplace", icon: Search, label: "Search" },
    { path: "/app/upload", icon: PlusCircle, label: "Sell" },
    { path: "/app/transactions", icon: MessageSquare, label: "Chats" },
    { path: "/app/profile", icon: User, label: "Account" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? "text-teal-700" : "text-gray-600"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 flex-shrink-0 ${
                  active ? "fill-teal-700" : ""
                }`}
              />
              <span className="text-[10px] font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
