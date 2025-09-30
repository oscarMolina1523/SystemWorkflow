import BaseModel from "./base.model";
import { Status } from "./status.enum";

export default class Task extends BaseModel {
  title: string;
  status: Status;
  areaId: string;
  createdBy: string;
  assignedTo: string;
  description?: string;

  constructor({
    id,
    title,
    status,
    areaId,
    createdBy,
    assignedTo,
    description,
  }: {
    id: string;
    title: string;
    status: Status;
    areaId: string;
    createdBy: string;
    assignedTo: string;
    description?: string;
  }) {
    super(id);
    this.title = title;
    this.status = status;
    this.areaId = areaId;
    this.createdBy = createdBy;
    this.assignedTo = assignedTo;
    this.description = description;
  }

  // Construye Task a partir de un JSON del backend
  static fromJson(json: any): Task {
    const id = String(json["id"] || "");
    const title = String(json["title"] || "");
    const status = (json["status"] as Status) || Status.PENDING; // default en caso de que falte
    const areaId = String(json["areaId"] || "");
    const createdBy = String(json["createdBy"] || "");
    const assignedTo = String(json["assignedTo"] || "");
    const description = json["description"] ? String(json["description"]) : undefined;

    return new Task({
      id,
      title,
      status,
      areaId,
      createdBy,
      assignedTo,
      description,
    });
  }

  // Construye Task desde un modelo ya transformado en frontend
  static fromJsonModel(json: any): Task {
    const id = String(json["id"] || "");
    const title = String(json["title"] || "");
    const status = (json["status"] as Status) || Status.PENDING;
    const areaId = String(json["areaId"] || "");
    const createdBy = String(json["createdBy"] || "");
    const assignedTo = String(json["assignedTo"] || "");
    const description = json["description"] ? String(json["description"]) : undefined;

    return new Task({
      id,
      title,
      status,
      areaId,
      createdBy,
      assignedTo,
      description,
    });
  }

  // Convierte Task en objeto plano para enviar al backend
  toJsonDTO() {
    return {
      title: this.title,
      status: this.status,
      areaId: this.areaId,
      createdBy: this.createdBy,
      assignedTo: this.assignedTo,
      description: this.description,
    };
  }
}
