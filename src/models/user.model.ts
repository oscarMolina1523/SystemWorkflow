import BaseModel from "./base.model";

export class User extends BaseModel {
  name: string;
  email: string;
  password: string;
  areaId: string;
  roleId: string;

  constructor({
    id,
    name,
    email,
    password,
    areaId,
    roleId,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
    areaId: string;
    roleId: string;
  }) {
    super(id);
    this.name = name;
    this.email = email;
    this.password = password;
    this.areaId = areaId;
    this.roleId = roleId;
  }

  // Construye User a partir de un JSON del backend
  static fromJson(json: any): User {
    const id = String(json["id"] || "");
    const name = String(json["name"] || "");
    const email = String(json["email"] || "");
    const password = String(json["password"] || "");
    const areaId = String(json["areaId"] || "");
    const roleId = String(json["roleId"] || "");

    return new User({
      id,
      name,
      email,
      password,
      areaId,
      roleId,
    });
  }

  // Construye User desde un modelo ya transformado en frontend
  static fromJsonModel(json: any): User {
    const id = String(json["id"] || "");
    const name = String(json["name"] || "");
    const email = String(json["email"] || "");
    const password = String(json["password"] || "");
    const areaId = String(json["areaId"] || "");
    const roleId = String(json["roleId"] || "");

    return new User({
      id,
      name,
      email,
      password,
      areaId,
      roleId,
    });
  }

  // Convierte User en objeto plano para enviar al backend
  toJsonDTO() {
    return {
      name: this.name,
      email: this.email,
      areaId: this.areaId,
      roleId: this.roleId,
    };
  }
}
