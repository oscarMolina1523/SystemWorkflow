// Base model
export abstract class BaseModel {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

// Status enum
export enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Task model
export class Task extends BaseModel {
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
    this.description = description;
    this.status = status;
    this.areaId = areaId;
    this.createdBy = createdBy;
    this.assignedTo = assignedTo;
  }
}

// Area model
export class Area extends BaseModel {
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
}

// Role model
export class Role extends BaseModel {
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
}

// User model
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
}