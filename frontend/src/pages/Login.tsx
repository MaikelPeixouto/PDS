import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Login = () => {
  const [userType, setUserType] = useState<"user" | "clinic">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const authType = userType === "user" ? "tutor" : "clinic";
      await login(email, password, authType);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-soft to-vet-light">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <Heart className="w-8 h-8 text-vet-primary" />
            </div>
            <h1 className="text-3xl font-bold text-vet-dark mb-2">Bem-vindo de volta!</h1>
            <p className="text-vet-muted">Entre na sua conta para continuar</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <Tabs value={userType} onValueChange={(value) => setUserType(value as "user" | "clinic")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Tutor
                  </TabsTrigger>
                  <TabsTrigger value="clinic" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Clínica
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user">
                  <CardTitle className="text-2xl text-center">Login - Tutor</CardTitle>
                  <CardDescription className="text-center">
                    Acesse sua conta para cuidar dos seus pets
                  </CardDescription>
                </TabsContent>

                <TabsContent value="clinic">
                  <CardTitle className="text-2xl text-center">Login - Clínica</CardTitle>
                  <CardDescription className="text-center">
                    Acesse o painel da sua clínica veterinária
                  </CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-vet-primary"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Lembrar-me
                  </Label>
                </div>
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-vet-primary hover:text-vet-secondary transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  {error}
                </div>
              )}

              <Button
                className="w-full h-12"
                variant="vet"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center">
                <span className="text-sm text-vet-muted">
                  Não tem uma conta?{" "}
                  <Link
                    to="/registro"
                    className="text-vet-primary hover:text-vet-secondary font-medium transition-colors"
                  >
                    Cadastre-se aqui
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-vet-muted">
            Ao fazer login, você concorda com nossos{" "}
            <Link to="/termos" className="text-vet-primary hover:underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link to="/privacidade" className="text-vet-primary hover:underline">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
