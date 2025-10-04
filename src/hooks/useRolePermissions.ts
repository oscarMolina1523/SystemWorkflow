import { getUserFromToken } from "@/utils/jwt";
import { useMemo } from "react";

// Tabla de permisos por rol (puede estar en DB en un futuro)
const rolePermissions: Record<string, string[]> = {
  "2d5c7f8e-1b3a-4c9d-8f0a-7e6b5a4d3c2b": ["/dashboard", "/tasks", "/users", "/areas", "/roles", "/logs"], // ADMIN
  "a3e9c8b7-4d5c-6e2f-1g8h-9i0j1k2l3m4n": ["/dashboard", "/tasks", "/users"], // MANAGER
  "b1c2d3e4-f5g6-7h8i-9j0k-1l2m3n4o5p6q": ["/dashboard", "/tasks"], // PLANILLA
  "c7d8e9f0-1g2h-3i4j-5k6l-7m8n9o0p1q2r": ["/dashboard", "/tasks"], // SERVICIOS PROFESIONALES
  "d9e8f7g6-5h4i-3j2k-1l0m-9n8o7p6q5r4s": ["/dashboard", "/tasks"], // VIEWER
};

export function useRolePermissions() {
  const user = getUserFromToken();

  const permissions = useMemo(() => {
    if (!user?.roleId) return [];
    //le pasas el id 
    return rolePermissions[user.roleId] || [];
  }, [user]);

  return { user, permissions };
}
