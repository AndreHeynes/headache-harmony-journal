
import { Home, PlusCircle, BookOpen, BarChart2, User } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", href: "/", active: true },
  { icon: PlusCircle, label: "Log", href: "/log" },
  { icon: BookOpen, label: "Journal", href: "/journal" },
  { icon: BarChart2, label: "Reports", href: "/reports" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-charcoal/80 backdrop-blur-sm border-t border-white/5">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-xs ${
              item.active ? "text-primary" : "text-white/60 hover:text-white/80"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
