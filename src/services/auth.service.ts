import Token from "@/models/token.model";
import HTTPService from "./http-service";

export default class AuthService extends HTTPService {
  async signIn(email: string, password: string, areaId: string) {
    const body = { email: email, password: password, areaId:areaId };
    const json = await this.post("auth/login", body);
    console.log("Token plano recibido en AuthService.signIn:", json);
    return Token.fromJson(json.token);
  }

  async signUp(username: string, newemail: string, newpassword: string, areaId: string) {
    if (!username || !newpassword || !newemail || !areaId) {
      throw new Error("Username, email and password are required");
    }

    const body = { name: username, email: newemail, password: newpassword, areaId: areaId};
    const json = await this.post("auth/register", body);
    console.log("Token recibido en AuthService.signup:", json.token);
    return Token.fromJson(json);
  }
}