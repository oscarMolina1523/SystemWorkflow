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
}