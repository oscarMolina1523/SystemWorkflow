import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { Status } from "@/models/status.enum";
import Task from "@/models/task.model";

import Area from "@/models/area.model";
import TaskService from "@/services/task.service";
import UserService from "@/services/user.service";
import AreaService from "@/services/area.service";
import { User } from "@/models/user.model";

// Inicializamos servicios
const taskService = new TaskService();
const userService = new UserService();
const areaService = new AreaService();

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
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
    createdBy: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, usersData, areasData] = await Promise.all([
          taskService.getTasks(),
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

  // helpers
  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getAreaById = (id: string) => areas.find((a) => a.id === id);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesArea = areaFilter === "all" || task.areaId === areaFilter;

    return matchesSearch && matchesStatus && matchesArea;
  });

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return "bg-green-500 text-white";
      case Status.IN_PROGRESS:
        return "bg-blue-500 text-white";
      case Status.PENDING:
        return "bg-yellow-500 text-white";
      case Status.REJECTED:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return "Completada";
      case Status.IN_PROGRESS:
        return "En Progreso";
      case Status.PENDING:
        return "Pendiente";
      case Status.REJECTED:
        return "Cancelada";
      default:
        return status;
    }
  };

  // Abrir modal crear
  const handleNewTask = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: Status.PENDING,
      areaId: "",
      assignedTo: "",
      createdBy: "",
    });
    setShowModal(true);
  };

  // Abrir modal editar
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

  // Guardar (crear o editar)
  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, Task.fromJson(formData));
        if (updated) {
          setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        }
      } else {
        const created = await taskService.addTask(Task.fromJson(formData));
        if (created) {
          setTasks([...tasks, created]);
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando tarea:", error);
    }
  };

  // Eliminar
  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  if (loading) {
    return <p className="text-center">Cargando datos...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Tareas</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Administra y supervisa todas las tareas del sistema
          </p>
        </div>
        <Button onClick={handleNewTask} className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-all w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
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
                placeholder="Buscar tareas..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value={Status.PENDING}>Pendiente</SelectItem>
                <SelectItem value={Status.IN_PROGRESS}>En Progreso</SelectItem>
                <SelectItem value={Status.DONE}>Completada</SelectItem>
                <SelectItem value={Status.REJECTED}>Cancelada</SelectItem>
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

      {/* Tasks Table */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Tareas ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden sm:table-cell">Área</TableHead>
                  <TableHead className="hidden md:table-cell">Asignado a</TableHead>
                  <TableHead className="hidden lg:table-cell">Creado por</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const assignedUser = getUserById(task.assignedTo);
                  const createdByUser = getUserById(task.createdBy);
                  const area = getAreaById(task.areaId);

                  return (
                    <TableRow key={task.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{area?.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{task.createdBy}</TableCell>
                      <TableCell className="hidden lg:table-cell">{task.assignedTo}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditTask(task)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteTask(task.id)}
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? "Editar Tarea" : "Nueva Tarea"}
            </h2>
            <div className="space-y-3">
              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Input
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as Status })}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.PENDING}>Pendiente</SelectItem>
                  <SelectItem value={Status.IN_PROGRESS}>En Progreso</SelectItem>
                  <SelectItem value={Status.DONE}>Completada</SelectItem>
                  <SelectItem value={Status.REJECTED}>Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.areaId} onValueChange={(val) => setFormData({ ...formData, areaId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.assignedTo} onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Asignado a" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.createdBy} onValueChange={(val) => setFormData({ ...formData, createdBy: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Creado por" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={handleSaveTask}>{editingTask ? "Actualizar" : "Crear"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
