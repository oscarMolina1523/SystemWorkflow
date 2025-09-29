import Role from "@/models/role.model";
import HTTPService from "./http-service";

export default class RoleService extends HTTPService {
  private path: string;
  constructor() {
    super();
    this.path = "roles";
  }

  async getRoles() {
    const data = await super.get(this.path);
    return data.map((item: any) => Role.fromJson(item));
  }

  async getById(id: string) {
    const item = await super.get(`${this.path}/${id}`);
    if (!item) return null;

    return Role.fromJson(item);
  }

  async addRole(role: Role) {
    // El body que se enviará al backend
    const body = Role.fromJsonModel(role).toJsonDTO();
    // Devuelve null o el rol creado
    const result = await super.post(this.path, body);
    if (!result) return null;
    // Retorna el rol creado
    return Role.fromJson(result);
  }

  async updateRole(id: string, role: Role) {
    const body = Role.fromJsonModel(role).toJsonDTO();
    const json = await super.put(`${this.path}/${id}`, body);
    if (!json) return null;

    return Role.fromJson(json);
  }

  async deleteRole(id: string) {
    await super.delete(`${this.path}/${id}`);
  }
}
