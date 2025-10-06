import LogModel from "@/models/log.model";
import HTTPService from "./http-service";

export default class LogService extends HTTPService {
  private path: string;
  constructor() {
    super();
    this.path = "logs";
  }

  async getLogs() {
    const response = await super.get(this.path);
    const data = response.data || [];
    return data
      .map((item: any) => {
        const log = LogModel.fromJson(item);

        // Si el userId coincide, reemplazar por nombre
        if (log.userId === "d976b2d4b8494815") {
          log.userId = "Admin General";
        }

        return log;
      })
      .sort(
        (a: LogModel, b: LogModel) =>
          b.timestamp.getTime() - a.timestamp.getTime()
      ); // de más reciente a más viejo
  }

  async getLogByArea(id: string) {
    const response = await super.get(`${this.path}/area/${id}`);
    const data = response.data || [];
    return data
      .map((item: any) => LogModel.fromJson(item))
      .sort(
        (a: LogModel, b: LogModel) =>
          b.timestamp.getTime() - a.timestamp.getTime()
      );
  }
}
