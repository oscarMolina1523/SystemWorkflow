export default class DomainService {
  private static domainMap: Record<string, string> = {
    "evolutionsystem.sbs": "eedf2407cc75b66c",
    "www.evolutionsystem.sbs": "eedf2407cc75b66c",
    "jinotepe.": "5c8d2a1b-9e4f-4d6c-8a0b-1f2e3d4c5b6a",
    "nandaime.": "8a1b6a7e-4d5c-4f1a-9f23-3a8c5e6b7d41",
    "chontales.": "b90a4c28-568b-4b13-a4f6-82087a13c9e6",
    "chinandega.": "f3d9e0b1-2c8f-4a3d-8e7c-4a1b2c3d4e5f",
  };

  static getAreaId(hostname: string): string | null {
    if (hostname.startsWith("localhost")) {
      return this.domainMap["evolutionsystem.sbs"];
    }

    for (const key in this.domainMap) {
      if (hostname === key || hostname.startsWith(key)) {
        return this.domainMap[key];
      }
    }
    return null;
  }

  static getAreas() {
    // Solo devuelve las áreas (excluye el dominio principal)
    return Object.keys(this.domainMap).filter(
      (domain) => !["evolutionsystem.sbs", "www.evolutionsystem.sbs"].includes(domain)
    );
  }

  static isMainDomain(hostname: string): boolean {
    return (
      hostname === "evolutionsystem.sbs" ||
      hostname === "www.evolutionsystem.sbs" ||
      hostname.startsWith("localhost") ||
      hostname === "127.0.0.1"
    );
  }
}
