import Task from "@/models/task.model";
import HTTPService from "./http-service";

export default class TaskService extends HTTPService {
  private path: string;
  constructor() {
    super();
    this.path = "tasks";
  }

  async getTasks() {
    const response = await super.get(this.path);
    const data = response.data || []; // <-- usa response.data
    return data.map((item: any) => Task.fromJson(item));
  }

  async getById(id: string) {
    const item = await super.get(`${this.path}/${id}`);
    if (!item) return null;

    return Task.fromJson(item);
  }

  async getTaskByArea() {
    const response = await super.get(`${this.path}/area`);
    const data = response.data || []; // siempre aseguramos array
    return data.map((item: any) => Task.fromJson(item));
  }

  async getTaskByUserId() {
    const response = await super.get(`${this.path}/user`);
    const data = response.data || []; // siempre aseguramos array
    return data.map((item: any) => Task.fromJson(item));
  }

  async getTasksPendingValidation() {
    const item = await super.get(`${this.path}`);
    if (!item) return null;

    return Task.fromJson(item);
  }

  async addTask(task: Partial<Task>) {
    // construye el body que se enviará al backend
    const body = Task.fromJsonModel(task).toJsonDTO();
    // envía la petición al backend
    const result = await super.post(this.path, body);
    if (!result) return null;
    // retorna la tarea creada
    return Task.fromJson(result);
  }

  async updateTask(id: string, task: Partial<Task>) {
    const body = Task.fromJsonModel(task).toJsonDTO();
    const json = await super.put(`${this.path}/${id}`, body);
    if (!json) return null;

    return Task.fromJson(json);
  }

  async deleteTask(id: string): Promise<boolean> {
    await super.delete(`${this.path}/${id}`);
    return true;
  }
}
