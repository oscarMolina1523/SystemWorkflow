import {jwtDecode} from "jwt-decode";

export interface DecodedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  areaId: string;
  roleId: string;
}

export function getUserFromToken(): DecodedUser | null {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedUser>(token);
    return decoded;
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
}
