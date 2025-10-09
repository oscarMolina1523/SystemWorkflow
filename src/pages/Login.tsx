import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare, Mail, Lock, User } from "lucide-react";
import AuthService from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import DomainService from "@/services/domain.service";

const authService = new AuthService();

const Login = () => {
  const { areaId, isMainDomain } = DomainService.getDomainInfo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowRegister, setAllowRegister] = useState(!isMainDomain);
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    //const areaId = areaIdRef.current || "0";

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("El email y la contraseña son obligatorios.");
      setLoading(false);
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
          setError("Nombre es obligatorio y las contraseñas no coinciden.");
          return;
        }

        const token = await authService.signUp(name, email, password, areaId);
        localStorage.setItem("authToken", token.token);
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(
        `Error en login/registro:
        Los credenciales no son validos en esta sucursal`
      );
    } finally {
      setLoading(false); // <-- desactivamos loading
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="w-12 h-12 text-blue-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

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
            {error && <span className="text-red-600">{error}</span>}
          </div>
        </CardHeader>

        <CardContent>
          {!isMainDomain && (
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
          )}

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
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary shadow-glow hover:shadow-elegant transition-all"
              disabled={loading}
            >
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </form>
          <br/>
          {isMainDomain && (
            <div>
              <span>Credenciales para demo</span>
              <p>email: test@gmail.com</p>
              <p>password: 123456789</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
