import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare, Mail, Lock, User } from "lucide-react";
import AuthService from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import DomainService from "@/services/domain.service";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { mockData } from "@/data/mockData";

const authService = new AuthService();

const Login = () => {
  const areaIdRef = useRef<string | null>(null);
  const [allowRegister, setAllowRegister] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  // const [selectedAreaId, setSelectedAreaId] = useState("");
  // const [selectedRoleId, setSelectedRoleId] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Verificar si estamos en el cliente y acceder a la URL
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const areaId = DomainService.getAreaId(hostname);
      areaIdRef.current = areaId;

      if (
        hostname === "evolutionsystem.sbs" ||
        hostname === "www.evolutionsystem.sbs"
      ) {
        setAllowRegister(false);
        setIsLogin(true); // Forzar vista de login
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const areaId = areaIdRef.current || "0";

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!email || !password) {
      console.error("El email y la contraseña son obligatorios.");
      return;
    }

    try {
      if (isLogin) {
        const token = await authService.signIn(email, password, areaId);
        localStorage.setItem("authToken", token.token);
        navigate("/dashboard");
      } else {
        const name = nameRef.current?.value || "";
        const confirmPassword = confirmPasswordRef.current?.value || "";

        if (!name || password !== confirmPassword) {
          console.error(
            "Nombre es obligatorio y las contraseñas no coinciden."
          );
          return;
        }

        const token = await authService.signUp(name, email, password, areaId);
        localStorage.setItem("authToken", token.token);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(
        "Error en login/registro:",
        error.response?.data || error.message || error
      );
      alert(
        error.response?.data?.message || error.message || "Error desconocido"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              WorkFlow System
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? "Ingresa para acceder al panel" : "Crea tu cuenta"}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex mb-6 bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Iniciar Sesión
            </button>
            {allowRegister && (
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Registrarse
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && allowRegister && (
              <div className="space-y-2">
                <Label htmlFor="nameRef">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nameRef"
                    type="text"
                    placeholder="Juan Pérez"
                    className="pl-9"
                    ref={nameRef}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="emailRef">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emailRef"
                  type="email"
                  placeholder="juan@empresa.com"
                  className="pl-9"
                  ref={emailRef}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordRef">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passwordRef"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  ref={passwordRef}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPasswordRef">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPasswordRef"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      ref={confirmPasswordRef}
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="area">Área</Label>
                  <Select value={selectedAreaId} onValueChange={setSelectedAreaId} required={!isLogin}>
                    <SelectTrigger className="pl-9">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockData.areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId} required={!isLogin}>
                    <SelectTrigger className="pl-9">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockData.roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.nameRef}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary shadow-glow hover:shadow-elegant transition-all"
            >
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
