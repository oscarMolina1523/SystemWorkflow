import { useState } from "react";
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
  Code
} from "lucide-react";
import { mockRoles, mockUsers } from "@/data/mockData";

const Roles = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = mockRoles.filter(role => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
        return ["Crear", "Editar", "Eliminar", "Ver Todo", "Gestionar Usuarios", "Configuración"];
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

  const getUsersWithRole = (roleId: string) => {
    return mockUsers.filter(user => user.roleId === roleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Roles</h1>
          <p className="text-muted-foreground">
            Administra roles y permisos del sistema
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-all">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role) => {
          const usersWithRole = getUsersWithRole(role.id);
          const permissions = getRolePermissions(role.name);

          return (
            <Card key={role.id} className="bg-card border-border shadow-elegant hover:shadow-glow transition-all group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      {getRoleIcon(role.name)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">ID: {role.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
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

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">{usersWithRole.length} usuarios</div>
                    <div className="text-xs text-muted-foreground">
                      {usersWithRole.map(u => u.name).join(", ") || "Sin usuarios asignados"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Permisos:</div>
                  <div className="flex flex-wrap gap-1">
                    {permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Badge className={getRoleColor(role.name)}>
                  {role.name}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Roles Table */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle>
            Resumen de Roles ({filteredRoles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Rol</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => {
                const usersWithRole = getUsersWithRole(role.id);
                const permissions = getRolePermissions(role.name);

                return (
                  <TableRow key={role.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                          {getRoleIcon(role.name)}
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {role.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{role.description || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {usersWithRole.length} usuario{usersWithRole.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;