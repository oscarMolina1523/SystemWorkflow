import Area from "@/models/area.model";
import HTTPService from "./http-service";

export default class AreaService extends HTTPService {
  private path: string;
  constructor() {
    super();
    this.path = "areas";
  }

  async getAreas() {
    const data = await super.get(this.path);
    return data.map((item: any) => Area.fromJson(item));
  }
}
