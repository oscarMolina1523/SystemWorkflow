import BaseModel from "./base.model";

export default class Area extends BaseModel {
  title: string;
  description?: string;

  constructor({
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description?: string;
  }) {
    super(id);
    this.title = title;
    this.description = description;
  }

  // Se llama directamente desde la clase sin instanciarla antes.
  // Útil cuando traes datos crudos desde el backend (API o DB).
  static fromJson(json: any): Area {
    const id = String(json["id"] || "");
    const title = String(json["title"] || "");
    const description = json["description"] ? String(json["description"]) : undefined;

    return new Area({ id, title, description });
  }

  // Similar, pero pensado si en el frontend el nombre de los campos 
  // es diferente o necesitas transformarlos antes de crear el modelo.
  static fromJsonModel(json: any): Area {
    const id = String(json["id"] || "");
    const title = String(json["title"] || "");
    const description = json["description"] ? String(json["description"]) : undefined;

    return new Area({ id, title, description });
  }

  // DTO → Objeto que viaja hacia el backend con los nombres correctos de los campos.
  toJsonDTO() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
    };
  }
}
