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

const Register = () => {
  const [userType, setUserType] = useState<"user" | "clinic">("user");

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
              {userType === "user" ? (
                // Formulário para Tutores
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        placeholder="Seu nome"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        placeholder="Seu sobrenome"
                        className="h-12"
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="h-12"
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Formulário para Clínicas
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Nome da Clínica</Label>
                    <Input
                      id="clinicName"
                      placeholder="Nome da sua clínica veterinária"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      className="h-12"
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicPhone">Telefone</Label>
                      <Input
                        id="clinicPhone"
                        type="tel"
                        placeholder="(11) 3333-3333"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, bairro, cidade, CEP"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição da Clínica</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva os serviços oferecidos pela sua clínica..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Horário de Funcionamento</Label>
                    <Input
                      id="hours"
                      placeholder="Segunda a Sexta: 8h às 18h"
                      className="h-12"
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmClinicPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmClinicPassword"
                        type="password"
                        placeholder="••••••••"
                        className="h-12"
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
                onClick={() => {
                  // Simulação de cadastro bem-sucedido
                  if (userType === "clinic") {
                    alert("Cadastro realizado com sucesso! Você será redirecionado para o dashboard.");
                    window.location.href = "/dashboard-clinica";
                  } else {
                    alert("Cadastro realizado com sucesso! Você será redirecionado para seus pets.");
                    window.location.href = "/meus-pets";
                  }
                }}
              >
                {userType === "user" ? "Criar Conta de Tutor" : "Cadastrar Clínica"}
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