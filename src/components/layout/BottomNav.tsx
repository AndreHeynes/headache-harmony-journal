
import { PlusCircle, BarChart2, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: "logo", label: "Home", href: "/dashboard" },
  { icon: PlusCircle, label: "Log", href: "/log" },
  { icon: BarChart2, label: "Reports", href: "/analysis" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-card/90 backdrop-blur-sm border-t border-border">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-xs ${
              location.pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon === "logo" ? (
              <img src="/lovable-uploads/78336bbf-2702-4d43-abaa-d5f6e646d8b4.png" className="h-5 w-5 mb-1 rounded-full" alt="Home" />
            ) : (
              <item.icon className="h-5 w-5 mb-1" />
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
