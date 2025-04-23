
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  CreditCard, 
  ArrowLeftRight, 
  Users, 
  Settings
} from "lucide-react";

interface SidebarNavProps {
  className?: string;
  closeSidebar?: () => void;
}

const SidebarNav = ({ className, closeSidebar = () => {} }: SidebarNavProps) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const userLinks = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
  
  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];
  
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-sidebar-accent-foreground",
              location.pathname === link.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "transparent text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
            onClick={closeSidebar}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-sidebar fixed left-0 top-0 z-30">
      <div className="p-6">
        <h2 className="text-xl font-bold text-sidebar-foreground">BankEase</h2>
        <div className="text-sm text-sidebar-foreground/80 mt-1">
          {user?.role === "admin" ? "Admin Portal" : "Banking Portal"}
        </div>
      </div>
      <div className="px-3 py-2">
        <h3 className="mb-2 px-4 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          Navigation
        </h3>
        <SidebarNav />
      </div>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-medium text-sidebar-foreground truncate max-w-[120px]">
              {user?.name}
            </div>
            <div className="text-xs text-sidebar-foreground/70">
              {user?.role === "admin" ? "Administrator" : `Acct: ${user?.accountNumber}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
