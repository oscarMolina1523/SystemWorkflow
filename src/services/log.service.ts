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
    return data.map((item: any) => LogModel.fromJson(item));
  }

  async getLogByArea(id: string) {
    const response = await super.get(`${this.path}/area/${id}`);
    const data = response.data || []; // siempre aseguramos array
    return data.map((item: any) => LogModel.fromJson(item));
  }
}
