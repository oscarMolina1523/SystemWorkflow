// src/hooks/useTasks.ts
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Task from "@/models/task.model";
import Area from "@/models/area.model";
import { User } from "@/models/user.model";
import TaskService from "@/services/task.service";
import UserService from "@/services/user.service";
import AreaService from "@/services/area.service";
import DomainService from "@/services/domain.service";
import { getUserFromToken } from "@/utils/jwt";
import { API_BASE_URL } from "@/services/api";
import { Status } from "@/models/status.enum";

// Inicializamos servicios
const taskService = new TaskService();
const userService = new UserService();
const areaService = new AreaService();

export const useTasks = () => {
  const user = getUserFromToken();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [usersByArea, setUsersByArea] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: Status.PENDING,
    areaId: "",
    assignedTo: "",
    createdBy: user.id,
  });

  // fetch tasks dependiendo del dominio
  const fetchTasks = async (): Promise<Task[]> => {
    const hostname = DomainService.isMainDomain(window.location.hostname);
    return hostname
      ? await taskService.getTasks()
      : await taskService.getTaskByArea();
  };

  // cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, usersData, areasData] = await Promise.all([
          fetchTasks(),
          userService.getUsers(),
          areaService.getAreas(),
        ]);
        setTasks(tasksData);
        setUsers(usersData);
        setAreas(areasData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  

  // filtrar usuarios por área
  useEffect(() => {
    if (!formData.areaId) {
      setUsersByArea([]);
      setFormData({ ...formData, assignedTo: "" });
      return;
    }
    const filtered = users.filter((u) => u.areaId === formData.areaId);
    setUsersByArea(filtered);
    if (!filtered.find((u) => u.id === formData.assignedTo)) {
      setFormData({ ...formData, assignedTo: "" });
    }
  }, [formData.areaId, users]);

  // helpers
  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getAreaById = (id: string) => areas.find((a) => a.id === id);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesArea = areaFilter === "all" || task.areaId === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  // acciones
  const handleNewTask = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: Status.PENDING,
      areaId: "",
      assignedTo: "",
      createdBy: user.id,
    });
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      areaId: task.areaId,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
    });
    setShowModal(true);
  };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
      } else {
        await taskService.addTask(formData);
      }
      const tasksData = await fetchTasks();
      setTasks(tasksData);
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando tarea:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const ok = await taskService.deleteTask(id);
      if (ok) setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  return {
    loading,
    tasks: filteredTasks,
    setTasks,
    fetchTasks,
    users,
    areas,
    usersByArea,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    showModal,
    setShowModal,
    formData,
    setFormData,
    editingTask,
    handleNewTask,
    handleEditTask,
    handleSaveTask,
    handleDeleteTask,
    getUserById,
    getAreaById,
  };
};
