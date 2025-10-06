import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import LogModel from "@/models/log.model";
import Area from "@/models/area.model";
import { User } from "@/models/user.model";
import LogService from "@/services/log.service";
import AreaService from "@/services/area.service";
import UserService from "@/services/user.service";
import { Button } from "@/components/ui/button";

const logService = new LogService();
const areaService = new AreaService();
const userService = new UserService();

const LogsPage = () => {
  const [logs, setLogs] = useState<LogModel[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, usersRes] = await Promise.all([
          areaService.getAreas(),
          userService.getUsers(),
        ]);
        setAreas(areasRes);
        setUsers(usersRes);
      } catch (error) {
        console.error("Error cargando áreas o usuarios:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let data: LogModel[] = [];
        if (areaFilter === "all") {
          data = await logService.getLogs();
        } else {
          data = await logService.getLogByArea(areaFilter);
        }
        setLogs(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error cargando logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [areaFilter]);

  const filteredLogs = logs.filter(
    (log) =>
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name || id;
  const getAreaName = (id: string) =>
    areas.find((a) => a.id === id)?.title || id;

  // 🔹 calcular paginación
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Logs del Sistema</h1>
        <p className="text-muted-foreground text-sm">
          Revisa las acciones realizadas por los usuarios
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuario o acción..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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

      {/* Tabla de Logs */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle>
            {" "}
            Logs ({filteredLogs.length}) — Página {currentPage} de {totalPages}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-[150px]">Usuario</TableHead>
                  <TableHead className="min-w-[150px]">Acción</TableHead>
                  <TableHead className="min-w-[150px]">Área</TableHead>
                  <TableHead className="min-w-[150px] hidden sm:table-cell">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="p-4">
                      {getUserName(log.userId)}
                    </TableCell>
                    <TableCell className="p-4">{log.action}</TableCell>
                    <TableCell className="p-4">
                      {getAreaName(log.areaId)}
                    </TableCell>
                    <TableCell className="p-4 hidden sm:table-cell">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {/* Controles de paginación */}
        <div className="flex justify-between items-center p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LogsPage;
