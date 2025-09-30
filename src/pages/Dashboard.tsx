import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckSquare,
  Users,
  Building,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import TaskService from "@/services/task.service";
import UserService from "@/services/user.service";
import AreaService from "@/services/area.service";
import { Status } from "@/models/status.enum";
import { useEffect, useState } from "react";
import Task from "@/models/task.model";
import { User } from "@/models/user.model";
import Area from "@/models/area.model";

const Dashboard = () => {
  const taskService = new TaskService();
  const userService = new UserService();
  const areaService = new AreaService();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

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
      }
    };

    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === Status.DONE
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === Status.IN_PROGRESS
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === Status.IN_PROGRESS
  ).length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getAreaById = (id: string) => areas.find((a) => a.id === id);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return "bg-success text-success-foreground";
      case Status.IN_PROGRESS:
        return "bg-primary text-primary-foreground";
      case Status.IN_PROGRESS:
        return "bg-warning text-warning-foreground";
      case Status.REJECTED:
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return "Completada";
      case Status.IN_PROGRESS:
        return "En Progreso";
      case Status.REJECTED:
        return "Cancelada";
      case Status.PENDING:
        return "Pendiente";
      case Status.PENDING_VALIDATION:
        return "Pendiente de Validación";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Resumen general del sistema de administración de tareas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-primary border-0 shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground">
              Total Tareas
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-primary-foreground">
              {totalTasks}
            </div>
            <p className="text-xs text-primary-foreground/80">
              +2 desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent border-0 shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent-foreground">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-accent-foreground">
              {users.length}
            </div>
            <p className="text-xs text-accent-foreground/80">
              100% conectados hoy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Áreas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {areas.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Departamentos activos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tasa de finalización
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completadas</span>
                <span>
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold text-success">
                  {completedTasks}
                </div>
                <div className="text-xs text-muted-foreground">Completadas</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold text-primary">
                  {inProgressTasks}
                </div>
                <div className="text-xs text-muted-foreground">En Progreso</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold text-warning">
                  {pendingTasks}
                </div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Tareas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {tasks.slice(0, 4).map((task) => {
                const assignedUser = getUserById(task.assignedTo);
                const area = getAreaById(task.areaId);

                return (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors space-y-2 sm:space-y-0"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">{assignedUser?.name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate hidden sm:inline">
                          {area?.title}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(task.status)} text-xs`}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
