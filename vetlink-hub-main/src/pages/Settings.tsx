import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Lock, User, Palette, Globe, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    appointments: true,
    promotions: false,
  });

  const [preferences, setPreferences] = useState({
    language: "pt-BR",
    theme: "light",
    timezone: "America/Sao_Paulo",
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-vet-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                Conta
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Palette className="h-4 w-4 mr-2" />
                Preferências
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="h-4 w-4 mr-2" />
                Privacidade
              </TabsTrigger>
            </TabsList>

            {/* Aba Conta */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="joao@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" defaultValue="000.000.000-00" disabled />
                  </div>
                  <Separator />
                  <Button onClick={handleSave} variant="vet">Salvar Alterações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Excluir Conta</CardTitle>
                  <CardDescription>
                    Esta ação é permanente e não pode ser desfeita
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Excluir Minha Conta</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Notificações */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Escolha como você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notif" className="text-base">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Notificações por Email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações por email
                      </p>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notif" className="text-base">
                        SMS
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba mensagens de texto
                      </p>
                    </div>
                    <Switch
                      id="sms-notif"
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notif" className="text-base">
                        Notificações Push
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações no navegador
                      </p>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="appointments-notif" className="text-base">
                        Lembretes de Consultas
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba lembretes de consultas agendadas
                      </p>
                    </div>
                    <Switch
                      id="appointments-notif"
                      checked={notifications.appointments}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, appointments: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions-notif" className="text-base">
                        Promoções e Novidades
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba ofertas especiais e novidades
                      </p>
                    </div>
                    <Switch
                      id="promotions-notif"
                      checked={notifications.promotions}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, promotions: checked })
                      }
                    />
                  </div>

                  <Separator />
                  <Button onClick={handleSave} variant="vet">Salvar Preferências</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Segurança */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Mantenha sua conta segura com uma senha forte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button onClick={handleSave} variant="vet">Alterar Senha</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Autenticação em Dois Fatores</CardTitle>
                  <CardDescription>
                    Adicione uma camada extra de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Ativar 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Requer código adicional ao fazer login
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessões Ativas</CardTitle>
                  <CardDescription>
                    Gerencie dispositivos conectados à sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Chrome - Windows</p>
                        <p className="text-sm text-muted-foreground">São Paulo, Brasil • Ativo agora</p>
                      </div>
                      <Button variant="outline" size="sm">Encerrar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Preferências */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências do Sistema</CardTitle>
                  <CardDescription>
                    Personalize sua experiência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      <Globe className="inline h-4 w-4 mr-2" />
                      Idioma
                    </Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, language: value })
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">
                      <Palette className="inline h-4 w-4 mr-2" />
                      Tema
                    </Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, theme: value })
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, timezone: value })
                      }
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">
                          Brasília (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/Manaus">
                          Manaus (GMT-4)
                        </SelectItem>
                        <SelectItem value="America/Fortaleza">
                          Fortaleza (GMT-3)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />
                  <Button onClick={handleSave} variant="vet">Salvar Preferências</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Privacidade */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Privacidade</CardTitle>
                  <CardDescription>
                    Controle quem pode ver suas informações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Perfil Público</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros usuários vejam seu perfil
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mostrar Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Exibir email no perfil público
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Histórico de Consultas</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que clínicas vejam histórico completo
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-base">Dados Coletados</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gerenciar dados que coletamos sobre você
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Baixar Dados
                      </Button>
                      <Button variant="outline" size="sm">
                        Solicitar Exclusão
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
