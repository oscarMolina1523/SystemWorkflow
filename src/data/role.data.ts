import Role from "@/models/role.model";

export const seedRoles: Role[] = [
  new Role({
    id: "2d5c7f8e-1b3a-4c9d-8f0a-7e6b5a4d3c2b",
    name: "ADMIN",
    description: "Administrador general con acceso y permisos ilimitados.",
  }),
  new Role({
    id: "a3e9c8b7-4d5c-6e2f-1g8h-9i0j1k2l3m4n",
    name: "MANAGER",
    description: "Gerente de área con permisos para gestionar tareas y usuarios dentro de su área.",
  }),
  new Role({
    id: "b1c2d3e4-f5g6-7h8i-9j0k-1l2m3n4o5p6q",
    name: "PLANILLA",
    description: "Empleado con permisos para ver y actualizar el estado de sus tareas asignadas.",
  }),
  new Role({
    id: "c7d8e9f0-1g2h-3i4j-5k6l-7m8n9o0p1q2r",
    name: "SERVICIOS PROFESIONALES",
    description: "Empleado de control de calidad con permisos para ver y actualizar el estado de sus tareas asignadas.",
  }),
  new Role({
    id: "d9e8f7g6-5h4i-3j2k-1l0m-9n8o7p6q5r4s",
    name: "VIEWER",
    description: "Usuario con permisos de solo lectura para visualizar tareas.",
  }),
];
