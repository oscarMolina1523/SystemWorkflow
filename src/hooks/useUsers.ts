import { useEffect, useState } from "react";
import { User } from "@/models/user.model";
import Role from "@/models/role.model";
import Area from "@/models/area.model";
import UserService from "@/services/user.service";
import RoleService from "@/services/role.service";
import AreaService from "@/services/area.service";
import { getUserFromToken } from "@/utils/jwt";
import DomainService from "@/services/domain.service";

// Inicializamos servicios
const userService = new UserService();
const roleService = new RoleService();
const areaService = new AreaService();

export const useUsers = () => {
  const user = getUserFromToken();

  const isAdmin = user.roleId === "2d5c7f8e-1b3a-4c9d-8f0a-7e6b5a4d3c2b";
  const isViewer = user.roleId === "d9e8f7g6-5h4i-3j2k-1l0m-9n8o7p6q5r4s";
  const userRole: "admin" | "viewer" | "user" = isAdmin
    ? "admin"
    : isViewer
    ? "viewer"
    : "user";

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    areaId: "",
  });

  // fetch roles + áreas
  useEffect(() => {
    const fetchRolesAreas = async () => {
      try {
        const [rolesRes, areasRes] = await Promise.all([
          roleService.getRoles(),
          areaService.getAreas(),
        ]);
        setRoles(rolesRes);
        setAreas(areasRes);
      } catch (error) {
        console.error("Error cargando roles o áreas:", error);
      }
    };
    fetchRolesAreas();
  }, []);

  const fetchUsers = async (): Promise<User[]> => {
    const hostname = DomainService.isMainDomain(window.location.hostname);
    return hostname
      ? await userService.getUsers()
      : await userService.getByAreaId(user.areaId);
  };

  // fetch users según rol
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data); // <--- aquí guardas los usuarios en el estado
      } catch (error) {
        console.error("Error cargando usuarios según rol:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user.roleId, user.areaId]);

  // filtros
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.roleId === roleFilter;
    const matchesArea = areaFilter === "all" || u.areaId === areaFilter;
    return matchesSearch && matchesRole && matchesArea;
  });

  // helpers
  const getRoleById = (id: string) => roles.find((r) => r.id === id);
  const getAreaById = (id: string) => areas.find((a) => a.id === id);

  // modal actions
  const handleNewUser = () => {
    if (isViewer) return; // viewer no crea
    setEditingUser(null);
    setFormData({ name: "", email: "", roleId: "", areaId: isAdmin ? "" : user.areaId, password: "" });
    setShowModal(true);
  };

  const handleEditUser = (u: User) => {
    if (isViewer) return; // viewer no edita
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      roleId: u.roleId,
      areaId: isAdmin ? u.areaId : user.areaId,
      password: u.password,
    });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData as User);
      } else {
        await userService.addUser(formData as User);
      }
      const userData = await userService.getUsers();
      setUsers(userData);
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (isViewer) return; // viewer no elimina
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  return {
    // states
    loading,
    filteredUsers,
    roles,
    areas,
    userRole,
    // filtros
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    areaFilter,
    setAreaFilter,
    // modal
    showModal,
    setShowModal,
    formData,
    setFormData,
    editingUser,
    // helpers
    getRoleById,
    getAreaById,
    // actions
    handleNewUser,
    handleEditUser,
    handleSaveUser,
    handleDeleteUser,
  };
};
