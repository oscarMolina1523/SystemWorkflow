import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Filter,
  Edit,
  Trash2,
  UserCheck,
  Mail
} from "lucide-react";
//import { mockUsers, mockRoles, mockAreas, getRoleById, getAreaById } from "@/data/mockData";
import {User} from "@/models/user.model";
import Role from "@/models/role.model";
import Area from "@/models/area.model";
import UserService from "@/services/user.service";
import RoleService from "@/services/role.service";
import AreaService from "@/services/area.service";


const userService = new UserService();
const roleService = new RoleService();
const areaService = new AreaService();

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    areaId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes, areasRes] = await Promise.all([
          userService.getUsers(),
          roleService.getRoles(),
          areaService.getAreas(),
        ]);
        setUsers(usersRes);
        setRoles(rolesRes);
        setAreas(areasRes);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roleId === roleFilter;
    const matchesArea = areaFilter === "all" || user.areaId === areaFilter;
    
    return matchesSearch && matchesRole && matchesArea;
  });

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

  const getRoleById = (id: string) => roles.find(r => r.id === id);
  const getAreaById = (id: string) => areas.find(a => a.id === id);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Modal handlers
  const handleNewUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", roleId: "", areaId: "", password: "" });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      roleId: user.roleId, 
      areaId: user.areaId ,
      password: user.password
    });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const updated = await userService.updateUser(editingUser.id, formData as User);
        
      } else {
        const created = await userService.addUser(formData as User);
        
      }
      const userData = await userService.getUsers();
      setUsers(userData);
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  if (loading) return <p className="text-center">Cargando usuarios...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <Button onClick={handleNewUser} className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-all w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle>
            Usuarios ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-[150px]">Usuario</TableHead>
                  <TableHead className="min-w-[200px] hidden sm:table-cell">Email</TableHead>
                  <TableHead className="min-w-[100px]">Rol</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Área</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Estado</TableHead>
                  <TableHead className="min-w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const role = getRoleById(user.roleId);
                const area = getAreaById(user.areaId);

                return (
                  <TableRow key={user.id} className="border-border hover:bg-muted/50">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge className={getRoleColor(role?.name || "")}>
                        {role?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 hidden md:table-cell">
                      <span className="text-sm">{area?.title}</span>
                    </TableCell>
                    <TableCell className="p-4 hidden lg:table-cell">
                      <Badge className="bg-success text-success-foreground">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDeleteUser(user.id)}>
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
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <div className="space-y-3">
              <Input
                placeholder="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Select
                value={formData.roleId}
                onValueChange={(val) => setFormData({ ...formData, roleId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.areaId}
                onValueChange={(val) => setFormData({ ...formData, areaId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>
                {editingUser ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;