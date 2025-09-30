import BaseModel from "./base.model";

export default class Role extends BaseModel {
  name: string; // ADMIN, MANAGER, DEVELOPER, VIEWER
  description?: string;

  constructor({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description?: string;
  }) {
    super(id);
    this.name = name;
    this.description = description;
  }

  // Se usa cuando recibes un JSON crudo desde el backend (API o DB)
  static fromJson(json: any): Role {
    const id = String(json["id"] || "");
    const name = String(json["name"] || "");
    const description = json["description"] ? String(json["description"]) : undefined;

    return new Role({ id, name, description });
  }

  // Se usa cuando en el frontend manejas los datos con otros nombres de campos,
  // pero igual necesitas crear un Role con consistencia
  static fromJsonModel(json: any): Role {
    const id = String(json["id"] || "");
    const name = String(json["name"] || "");
    const description = json["description"] ? String(json["description"]) : undefined;

    return new Role({ id, name, description });
  }

  // Convierte el modelo en DTO (lo que mandas al backend con los nombres correctos de campos)
  toJsonDTO() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}
