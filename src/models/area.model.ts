import BaseModel from "./base.model";

export default class Area extends BaseModel {
  title: string;
  description?: string | undefined;

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
}