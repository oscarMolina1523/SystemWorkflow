import BaseModel from "./base.model";
import { Status } from "./status.enum";

export default class Task extends BaseModel {
  title: string;
  status: Status;
  areaId: string;
  createdBy: string;
  assignedTo: string;
  description?: string | undefined;

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
    this.description = description;
    this.status = status;
    this.areaId = areaId;
    this.createdBy = createdBy;
    this.assignedTo = assignedTo;
  }
}