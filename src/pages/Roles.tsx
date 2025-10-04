import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  Users,
  Crown,
  Eye,
  Settings,
  Code,
} from "lucide-react";
//import { mockRoles, mockUsers } from "@/data/mockData";

import RoleService from "@/services/role.service";
import UserService from "@/services/user.service";
import Role from "@/models/role.model";
import { User } from "@/models/user.model";

const roleService = new RoleService();
const userService = new UserService();

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, usersData] = await Promise.all([
          roleService.getRoles(),
          userService.getUsers(),
        ]);
        setRoles(rolesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error cargando roles y usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return <Crown className="h-5 w-5 text-destructive" />;
      case "MANAGER":
        return <Settings className="h-5 w-5 text-primary" />;
      case "DEVELOPER":
        return <Code className="h-5 w-5 text-accent" />;
      case "VIEWER":
        return <Eye className="h-5 w-5 text-muted-foreground" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return "bg-destructive text-destructive-foreground";
      case "MANAGER":
        return "bg-primary text-primary-foreground";
      case "DEVELOPER":
        return "bg-accent text-accent-foreground";
      case "VIEWER":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getRolePermissions = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return [
          "Crear",
          "Editar",
          "Eliminar",
          "Ver Todo",
          "Gestionar Usuarios",
          "Configuración",
        ];
      case "MANAGER":
        return ["Crear", "Editar", "Ver Todo", "Gestionar Tareas"];
      case "DEVELOPER":
        return ["Crear", "Editar", "Ver Asignadas"];
      case "VIEWER":
        return ["Ver Asignadas"];
      default:
        return [];
    }
  };

  const getUsersWithRole = (roleId: string) =>
    users.filter((u) => u.roleId === roleId);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers
  const handleNewRole = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description || "" });
    setShowModal(true);
  };

  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        const updated = await roleService.updateRole(editingRole.id, formData as Role);
        
      } else {
        const created = await roleService.addRole(formData as Role);
        
      }
      const roleData = await roleService.getRoles();
      setRoles(roleData);
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando rol:", error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id);
      setRoles(roles.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error eliminando rol:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="w-12 h-12 text-blue-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Gestión de Roles
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Administra roles y permisos del sistema
          </p>
        </div>
        <Button onClick={handleNewRole} className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-all w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border shadow-elegant">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar roles..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredRoles.map((role) => {
          const usersWithRole = getUsersWithRole(role.id);
          const permissions = getRolePermissions(role.name);

          return (
            <Card
              key={role.id}
              className="bg-card border-border shadow-elegant hover:shadow-glow transition-all group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      {getRoleIcon(role.name)}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate">
                        {role.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {role.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditRole(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {role.description && (
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                )}

                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Users className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {usersWithRole.length} usuarios
                    </div>
                    <div className="text-xs text-muted-foreground break-words">
                      {usersWithRole.map((u) => u.name).join(", ") ||
                        "Sin usuarios asignados"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Permisos:</div>
                  <div className="flex flex-wrap gap-1">
                    {permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Badge className={getRoleColor(role.name)}>{role.name}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Roles Table */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Resumen de Roles ({filteredRoles.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-[150px]">Rol</TableHead>
                  <TableHead className="min-w-[200px] hidden sm:table-cell">
                    Descripción
                  </TableHead>
                  <TableHead className="min-w-[100px]">Usuarios</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell">
                    Permisos
                  </TableHead>
                  <TableHead className="min-w-[100px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => {
                  const usersWithRole = getUsersWithRole(role.id);
                  const permissions = getRolePermissions(role.name);

                  return (
                    <TableRow
                      key={role.id}
                      className="border-border hover:bg-muted/50"
                    >
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                            {getRoleIcon(role.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {role.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {role.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 hidden sm:table-cell">
                        <span className="text-sm">
                          {role.description || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {usersWithRole.length} usuario
                          {usersWithRole.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {permissions.slice(0, 3).map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                          {permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right p-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border-border rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingRole ? "Editar Rol" : "Nuevo Rol"}
            </h2>
            <div className="space-y-3">
              <Input
                placeholder="Nombre del rol"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRole}>
                {editingRole ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
