import { Task, User, Role, Area, Status } from "@/types/models";

// Mock Roles
export const mockRoles: Role[] = [
  new Role({ id: "1", name: "ADMIN", description: "Administrador del sistema" }),
  new Role({ id: "2", name: "MANAGER", description: "Gerente de área" }),
  new Role({ id: "3", name: "DEVELOPER", description: "Desarrollador" }),
  new Role({ id: "4", name: "VIEWER", description: "Solo lectura" }),
];

// Mock Areas
export const mockAreas: Area[] = [
  new Area({ id: "1", title: "Desarrollo", description: "Área de desarrollo de software" }),
  new Area({ id: "2", title: "Marketing", description: "Área de marketing y ventas" }),
  new Area({ id: "3", title: "Recursos Humanos", description: "Gestión de personal" }),
  new Area({ id: "4", title: "Finanzas", description: "Control financiero" }),
];

// Mock Users
export const mockUsers: User[] = [
  new User({
    id: "1",
    name: "Juan Pérez",
    email: "juan@empresa.com",
    password: "password123",
    areaId: "1",
    roleId: "1"
  }),
  new User({
    id: "2", 
    name: "María García",
    email: "maria@empresa.com",
    password: "password123",
    areaId: "2",
    roleId: "2"
  }),
  new User({
    id: "3",
    name: "Carlos López", 
    email: "carlos@empresa.com",
    password: "password123",
    areaId: "1",
    roleId: "3"
  }),
  new User({
    id: "4",
    name: "Ana Martínez",
    email: "ana@empresa.com", 
    password: "password123",
    areaId: "3",
    roleId: "4"
  }),
];

// Mock Tasks
export const mockTasks: Task[] = [
  new Task({
    id: "1",
    title: "Implementar autenticación",
    description: "Desarrollar sistema de login y registro",
    status: Status.IN_PROGRESS,
    areaId: "1",
    createdBy: "1",
    assignedTo: "3"
  }),
  new Task({
    id: "2",
    title: "Campaña de marketing Q4",
    description: "Planificar y ejecutar campaña del último trimestre",
    status: Status.PENDING,
    areaId: "2", 
    createdBy: "2",
    assignedTo: "2"
  }),
  new Task({
    id: "3",
    title: "Actualizar base de datos",
    description: "Migrar esquema de base de datos a nueva versión",
    status: Status.COMPLETED,
    areaId: "1",
    createdBy: "1", 
    assignedTo: "3"
  }),
  new Task({
    id: "4",
    title: "Revisión de presupuesto",
    description: "Analizar gastos del trimestre actual",
    status: Status.IN_PROGRESS,
    areaId: "4",
    createdBy: "1",
    assignedTo: "4"
  }),
  new Task({
    id: "5",
    title: "Capacitación de personal",
    description: "Organizar sesiones de formación para nuevos empleados",
    status: Status.PENDING,
    areaId: "3",
    createdBy: "4",
    assignedTo: "4"
  }),
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getRoleById = (id: string): Role | undefined => {
  return mockRoles.find(role => role.id === id);
};

export const getAreaById = (id: string): Area | undefined => {
  return mockAreas.find(area => area.id === id);
};

export const getUsersByArea = (areaId: string): User[] => {
  return mockUsers.filter(user => user.areaId === areaId);
};

export const getTasksByArea = (areaId: string): Task[] => {
  return mockTasks.filter(task => task.areaId === areaId);
};

export const getTasksByUser = (userId: string): Task[] => {
  return mockTasks.filter(task => task.assignedTo === userId || task.createdBy === userId);
};