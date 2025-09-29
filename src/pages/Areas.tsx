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
  Building,
  Users,
  CheckSquare
} from "lucide-react";
import { mockAreas, getUsersByArea, getTasksByArea } from "@/data/mockData";

const Areas = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAreas = mockAreas.filter(area => {
    return area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           area.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Áreas</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Administra las áreas y departamentos de la organización
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-all w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Área
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border shadow-elegant">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar áreas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAreas.map((area) => {
          const usersInArea = getUsersByArea(area.id);
          const tasksInArea = getTasksByArea(area.id);

          return (
            <Card key={area.id} className="bg-card border-border shadow-elegant hover:shadow-glow transition-all group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Building className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{area.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">ID: {area.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {area.description && (
                  <p className="text-sm text-muted-foreground">
                    {area.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <Users className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{usersInArea.length}</div>
                      <div className="text-xs text-muted-foreground">Usuarios</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <CheckSquare className="h-4 w-4 text-accent flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{tasksInArea.length}</div>
                      <div className="text-xs text-muted-foreground">Tareas</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Activa
                  </Badge>
                  {usersInArea.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {usersInArea.length} miembro{usersInArea.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Areas Table */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle>
            Resumen de Áreas ({filteredAreas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-[150px]">Área</TableHead>
                  <TableHead className="min-w-[200px] hidden sm:table-cell">Descripción</TableHead>
                  <TableHead className="min-w-[100px]">Usuarios</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Tareas</TableHead>
                  <TableHead className="min-w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredAreas.map((area) => {
                const usersInArea = getUsersByArea(area.id);
                const tasksInArea = getTasksByArea(area.id);

                return (
                  <TableRow key={area.id} className="border-border hover:bg-muted/50">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <Building className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{area.title}</div>
                          <div className="text-sm text-muted-foreground">ID: {area.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 hidden sm:table-cell">
                      <span className="text-sm">{area.description || "-"}</span>
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {usersInArea.length} usuario{usersInArea.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {tasksInArea.length} tarea{tasksInArea.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground">
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
    </div>
  );
};

export default Areas;