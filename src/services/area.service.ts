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

  async getById(id: string) {
    const item = await super.get(`${this.path}/${id}`);
    if (!item) return null;

    return Area.fromJson(item);
  }

  async addArea(area: Area) {
    //el body que se va mandar se construye
    const body = Area.fromJsonModel(area).toJsonDTO();
    //devuelte null o la area creada
    const result = await super.post(`${this.path}`, body);
    if (!result) return null;
    //retorna la area creada es decir el resultado
    return Area.fromJson(result);
  }

  async updateArea(id: string, area: Area) {
    const body = Area.fromJsonModel(area).toJsonDTO();
    const json = await super.put(`${this.path}/${id}`, body);
    if (!json) return null;

    return Area.fromJson(json);
  }

  async deleteArea(id: string) {
    await super.delete(`${this.path}/${id}`);
  }
}
