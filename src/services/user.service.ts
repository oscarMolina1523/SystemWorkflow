import { User } from "@/models/user.model";
import HTTPService from "./http-service";

export default class UserService extends HTTPService {
  private path: string;
  constructor() {
    super();
    this.path = "users";
  }

  async getUsers() {
    const response = await super.get(this.path);
    const usersArray = response.data || [];
    return usersArray.map((item: any) => User.fromJson(item));
  }

  async getById(id: string) {
    const item = await super.get(`${this.path}/${id}`);
    if (!item) return null;

    return User.fromJson(item);
  }

  async getByEmail(email: string) {
    const item = await super.get(`${this.path}/email/${email}`);
    if (!item) return null;

    return User.fromJson(item);
  }

  async addUser(user: User) {
    // construye el body que se enviará al backend
    const body = User.fromJsonModel(user).toJsonDTO();
    // envía la petición
    const result = await super.post(this.path, body);
    if (!result) return null;
    // retorna el usuario creado
    return User.fromJson(result);
  }

  async updateUser(id: string, user: User) {
    const body = User.fromJsonModel(user).toJsonDTO();
    const json = await super.put(`${this.path}/${id}`, body);
    if (!json) return null;

    return User.fromJson(json);
  }

  async deleteUser(id: string) {
    await super.delete(`${this.path}/${id}`);
  }
}
