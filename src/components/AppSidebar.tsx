import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building,
  ShieldCheck,
  LogOut,
  Settings,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { getUserFromToken } from "@/utils/jwt";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tareas", url: "/tasks", icon: CheckSquare },
  { title: "Usuarios", url: "/users", icon: Users },
  { title: "Áreas", url: "/areas", icon: Building },
  { title: "Roles", url: "/roles", icon: ShieldCheck },
  { title: "Logs", url: "/logs", icon: Settings },
];

export function AppSidebar() {
  const { permissions } = useRolePermissions();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const user =getUserFromToken()

  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Borrar token
    localStorage.removeItem("authToken");

    // 2. Redirigir a login
    navigate("/", { replace: true });
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
      isActive
        ? "bg-gradient-primary text-primary-foreground shadow-glow font-medium"
        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  const filteredNavigationItems = navigationItems.filter((item) => {
    return permissions.includes(item.url)
  });

  return (
    <Sidebar
      className={`${
        collapsed ? "w-14" : "w-64"
      } border-r border-sidebar-border bg-sidebar`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                TaskFlow
              </h2>
              <p className="text-xs text-muted-foreground">{user.name} Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navegación Principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          className={`${getNavCls({ isActive: false })} w-full justify-start`}
           onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
