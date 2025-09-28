import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye
} from "lucide-react";
import { mockTasks, mockUsers, mockAreas, getUserById, getAreaById } from "@/data/mockData";
import { Status } from "@/types/models";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesArea = areaFilter === "all" || task.areaId === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.COMPLETED:
        return "bg-success text-success-foreground";
      case Status.IN_PROGRESS:
        return "bg-primary text-primary-foreground";
      case Status.PENDING:
        return "bg-warning text-warning-foreground";
      case Status.CANCELLED:
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case Status.COMPLETED:
        return "Completada";
      case Status.IN_PROGRESS:
        return "En Progreso";
      case Status.PENDING:
        return "Pendiente";
      case Status.CANCELLED:
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Tareas</h1>
          <p className="text-muted-foreground">
            Administra y supervisa todas las tareas del sistema
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-all">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value={Status.COMPLETED}>Completada</SelectItem>
                <SelectItem value={Status.CANCELLED}>Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {mockAreas.map((area) => (
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
          <CardTitle>
            Tareas ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Creado por</TableHead>
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
                    <TableCell>
                      <span className="text-sm">{area?.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{assignedUser?.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{createdByUser?.name}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
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

export default Tasks;