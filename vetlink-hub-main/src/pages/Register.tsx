import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Building2, User, Phone, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [userType, setUserType] = useState<"user" | "clinic">("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, registerClinic } = useAuth();

  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cpf: "",
  });

  const [clinicForm, setClinicForm] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    hours: "",
    password: "",
    confirmPassword: "",
  });

  const handleUserRegister = async () => {
    if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.password) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (userForm.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await registerUser({
        email: userForm.email,
        password: userForm.password,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        phone: userForm.phone || undefined,
        cpf: userForm.cpf || undefined,
      });
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClinicRegister = async () => {
    if (!clinicForm.name || !clinicForm.cnpj || !clinicForm.email || !clinicForm.password) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (clinicForm.password !== clinicForm.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (clinicForm.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await registerClinic({
        email: clinicForm.email,
        password: clinicForm.password,
        name: clinicForm.name,
        cnpj: clinicForm.cnpj.replace(/\D/g, ""),
        phone: clinicForm.phone || undefined,
        address: clinicForm.address || undefined,
        description: clinicForm.description || undefined,
        hours: clinicForm.hours || undefined,
        specialties: [],
      });
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta da clínica. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-soft to-vet-light">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <Heart className="w-8 h-8 text-vet-primary" />
            </div>
            <h1 className="text-3xl font-bold text-vet-dark mb-2">Junte-se ao VetFinder</h1>
            <p className="text-vet-muted">Crie sua conta e comece a cuidar melhor dos seus pets</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <Tabs value={userType} onValueChange={(value) => setUserType(value as "user" | "clinic")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Sou Tutor
                  </TabsTrigger>
                  <TabsTrigger value="clinic" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Sou Clínica
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user">
                  <CardTitle className="text-2xl text-center">Cadastro - Tutor</CardTitle>
                  <CardDescription className="text-center">
                    Crie sua conta para agendar consultas e cuidar dos seus pets
                  </CardDescription>
                </TabsContent>

                <TabsContent value="clinic">
                  <CardTitle className="text-2xl text-center">Cadastro - Clínica Veterinária</CardTitle>
                  <CardDescription className="text-center">
                    Cadastre sua clínica e comece a receber agendamentos
                  </CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  {error}
                </div>
              )}

              {userType === "user" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        placeholder="Seu nome"
                        className="h-12"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        placeholder="Seu sobrenome"
                        className="h-12"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="h-12"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="h-12"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF (opcional)</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="h-12"
                      value={userForm.cpf}
                      onChange={(e) => setUserForm({ ...userForm, cpf: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="h-12"
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Nome da Clínica</Label>
                    <Input
                      id="clinicName"
                      placeholder="Nome da sua clínica veterinária"
                      className="h-12"
                      value={clinicForm.name}
                      onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      className="h-12"
                      value={clinicForm.cnpj}
                      onChange={(e) => setClinicForm({ ...clinicForm, cnpj: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicEmail">E-mail da Clínica</Label>
                      <Input
                        id="clinicEmail"
                        type="email"
                        placeholder="contato@clinica.com"
                        className="h-12"
                        value={clinicForm.email}
                        onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicPhone">Telefone</Label>
                      <Input
                        id="clinicPhone"
                        type="tel"
                        placeholder="(11) 3333-3333"
                        className="h-12"
                        value={clinicForm.phone}
                        onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, bairro, cidade, CEP"
                      className="h-12"
                      value={clinicForm.address}
                      onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição da Clínica</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva os serviços oferecidos pela sua clínica..."
                      className="min-h-[100px]"
                      value={clinicForm.description}
                      onChange={(e) => setClinicForm({ ...clinicForm, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Horário de Funcionamento</Label>
                    <Input
                      id="hours"
                      placeholder="Segunda a Sexta: 8h às 18h"
                      className="h-12"
                      value={clinicForm.hours}
                      onChange={(e) => setClinicForm({ ...clinicForm, hours: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicPassword">Senha</Label>
                      <Input
                        id="clinicPassword"
                        type="password"
                        placeholder="••••••••"
                        className="h-12"
                        value={clinicForm.password}
                        onChange={(e) => setClinicForm({ ...clinicForm, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmClinicPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmClinicPassword"
                        type="password"
                        placeholder="••••••••"
                        className="h-12"
                        value={clinicForm.confirmPassword}
                        onChange={(e) => setClinicForm({ ...clinicForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded border-vet-primary mt-1"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  Eu concordo com os{" "}
                  <Link to="/termos" className="text-vet-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacidade" className="text-vet-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>

              <Button
                className="w-full h-12"
                variant="vet"
                onClick={userType === "user" ? handleUserRegister : handleClinicRegister}
                disabled={isLoading}
              >
                {isLoading
                  ? (userType === "user" ? "Criando conta..." : "Cadastrando clínica...")
                  : (userType === "user" ? "Criar Conta de Tutor" : "Cadastrar Clínica")
                }
              </Button>

              <div className="text-center">
                <span className="text-sm text-vet-muted">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="text-vet-primary hover:text-vet-secondary font-medium transition-colors"
                  >
                    Faça login aqui
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
