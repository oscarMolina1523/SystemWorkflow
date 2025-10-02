import BaseModel from "./base.model";
import { Log } from "./log.enum";

export default class LogModel extends BaseModel {
  userId: string; // quién hizo la acción
  action: Log; //accion realizada
  areaId: string; // área asociada
  timestamp: Date; // fecha y hora exacta

  constructor({
    id,
    userId,
    action,
    areaId,
    timestamp,
  }: {
    id: string;
    userId: string;
    action: Log;
    areaId: string;
    timestamp: Date;
  }) {
    super(id);
    this.userId = userId;
    this.action = action;
    this.areaId = areaId;
    this.timestamp = timestamp;
  }

  // Convierte un JSON crudo a instancia de LogModel
  static fromJson(json: any): LogModel {
    const id = String(json["id"] || "");
    const userId = String(json["userId"] || "");
    const action = json["action"] as Log;
    const areaId = String(json["areaId"] || "");
    const timestamp = new Date(json["timestamp"] || Date.now());

    return new LogModel({ id, userId, action, areaId, timestamp });
  }

  // Igual que fromJson, pero permite transformaciones específicas del frontend si se necesitan
  static fromJsonModel(json: any): LogModel {
    const id = String(json["id"] || "");
    const userId = String(json["userId"] || "");
    const action = json["action"] as Log;
    const areaId = String(json["areaId"] || "");
    const timestamp = new Date(json["timestamp"] || Date.now());

    return new LogModel({ id, userId, action, areaId, timestamp });
  }

  // DTO → Objeto listo para enviar al backend
  toJsonDTO() {
    return {
      userId: this.userId,
      action: this.action,
      areaId: this.areaId,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
