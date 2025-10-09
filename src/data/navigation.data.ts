import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building,
  ShieldCheck,
  Settings,
} from "lucide-react";

export const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tareas", url: "/tasks", icon: CheckSquare },
  { title: "Usuarios", url: "/users", icon: Users },
  { title: "Áreas", url: "/areas", icon: Building },
  { title: "Roles", url: "/roles", icon: ShieldCheck },
  { title: "Logs", url: "/logs", icon: Settings },
];