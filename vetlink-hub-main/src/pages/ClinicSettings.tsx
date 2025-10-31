import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RolePermissionsModal } from "@/components/modals/RolePermissionsModal";
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Shield,
  Bell,
  Users,
  Upload,
  Save,
  Lock
} from "lucide-react";

const ClinicSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  // Define roles with permissions and members
  const rolesData = {
    "Administrador": {
      name: "Administrador",
      description: "Acesso total ao sistema",
      permissions: [
        { id: "manage_users", label: "Gerenciar Usuários", description: "Adicionar, editar e remover usuários do sistema" },
        { id: "manage_settings", label: "Gerenciar Configurações", description: "Alterar configurações da clínica" },
        { id: "view_reports", label: "Visualizar Relatórios", description: "Acesso a todos os relatórios financeiros e operacionais" },
        { id: "manage_appointments", label: "Gerenciar Agendamentos", description: "Criar, editar e cancelar agendamentos" },
        { id: "manage_medical_records", label: "Gerenciar Prontuários", description: "Acesso completo aos prontuários" },
        { id: "manage_billing", label: "Gerenciar Faturamento", description: "Controle total sobre pagamentos e cobranças" },
      ],
      members: [
        { id: 1, name: "Carlos Silva", email: "carlos@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 2, name: "Patricia Oliveira", email: "patricia@petcare.com.br", avatar: "/placeholder.svg" },
      ]
    },
    "Veterinário": {
      name: "Veterinário",
      description: "Acesso a consultas e prontuários",
      permissions: [
        { id: "view_appointments", label: "Visualizar Agendamentos", description: "Ver a agenda de consultas" },
        { id: "manage_consultations", label: "Gerenciar Consultas", description: "Realizar e documentar consultas" },
        { id: "manage_medical_records", label: "Gerenciar Prontuários", description: "Criar e editar prontuários médicos" },
        { id: "prescribe_medications", label: "Prescrever Medicamentos", description: "Criar receitas e prescrições" },
        { id: "request_exams", label: "Solicitar Exames", description: "Requisitar exames laboratoriais" },
        { id: "view_medical_history", label: "Histórico Médico", description: "Acessar histórico completo dos pacientes" },
      ],
      members: [
        { id: 3, name: "Dra. Maria Oliveira", email: "maria@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 4, name: "Dr. João Santos", email: "joao@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 5, name: "Dra. Ana Costa", email: "ana@petcare.com.br", avatar: "/placeholder.svg" },
      ]
    },
    "Recepcionista": {
      name: "Recepcionista",
      description: "Acesso a agendamentos",
      permissions: [
        { id: "manage_appointments", label: "Gerenciar Agendamentos", description: "Criar, editar e cancelar agendamentos" },
        { id: "view_schedule", label: "Visualizar Agenda", description: "Ver agenda completa da clínica" },
        { id: "register_clients", label: "Cadastrar Clientes", description: "Adicionar novos clientes e pets" },
        { id: "confirm_appointments", label: "Confirmar Consultas", description: "Confirmar presença dos clientes" },
        { id: "basic_billing", label: "Faturamento Básico", description: "Registrar pagamentos de consultas" },
      ],
      members: [
        { id: 6, name: "Fernanda Lima", email: "fernanda@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 7, name: "Roberto Alves", email: "roberto@petcare.com.br", avatar: "/placeholder.svg" },
      ]
    },
    "Assistente": {
      name: "Assistente",
      description: "Acesso limitado",
      permissions: [
        { id: "view_appointments", label: "Visualizar Agendamentos", description: "Ver agendamentos do dia" },
        { id: "assist_consultations", label: "Auxiliar Consultas", description: "Apoiar veterinários durante consultas" },
        { id: "manage_supplies", label: "Gerenciar Suprimentos", description: "Controlar estoque de materiais" },
        { id: "basic_patient_care", label: "Cuidados Básicos", description: "Realizar cuidados básicos com os animais" },
      ],
      members: [
        { id: 8, name: "Julia Martins", email: "julia@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 9, name: "Pedro Santos", email: "pedro@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 10, name: "Carla Rodrigues", email: "carla@petcare.com.br", avatar: "/placeholder.svg" },
        { id: 11, name: "Lucas Ferreira", email: "lucas@petcare.com.br", avatar: "/placeholder.svg" },
      ]
    }
  };

  const handleOpenRoleModal = (roleName: string) => {
    setSelectedRole(rolesData[roleName as keyof typeof rolesData]);
    setShowRoleModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard-clinica")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie as configurações da sua clínica
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="hours">Horários</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-5 w-5 text-vet-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Informações da Clínica
                </h2>
              </div>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-vet-primary text-white text-2xl">
                      PC
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="vet" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clinic-name">Nome da Clínica</Label>
                    <Input 
                      id="clinic-name" 
                      defaultValue="Clínica Veterinária PetCare"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input 
                      id="cnpj" 
                      defaultValue="00.000.000/0001-00"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input 
                      id="address" 
                      defaultValue="Rua das Flores, 123 - Vila Madalena, São Paulo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      defaultValue="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue="contato@petcare.com.br"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Sobre a Clínica</Label>
                    <Textarea 
                      id="description"
                      rows={4}
                      defaultValue="Clínica veterinária especializada em cuidados preventivos e tratamentos avançados para pets."
                    />
                  </div>
                </div>

                <Button variant="vet" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Hours Tab */}
          <TabsContent value="hours" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-vet-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Horário de Funcionamento
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { day: "Segunda-feira", open: "08:00", close: "18:00", enabled: true },
                  { day: "Terça-feira", open: "08:00", close: "18:00", enabled: true },
                  { day: "Quarta-feira", open: "08:00", close: "18:00", enabled: true },
                  { day: "Quinta-feira", open: "08:00", close: "18:00", enabled: true },
                  { day: "Sexta-feira", open: "08:00", close: "18:00", enabled: true },
                  { day: "Sábado", open: "08:00", close: "14:00", enabled: true },
                  { day: "Domingo", open: "00:00", close: "00:00", enabled: false },
                ].map((schedule) => (
                  <div key={schedule.day} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="w-40">
                      <p className="font-medium text-foreground">{schedule.day}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Input 
                        type="time" 
                        defaultValue={schedule.open}
                        disabled={!schedule.enabled}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input 
                        type="time" 
                        defaultValue={schedule.close}
                        disabled={!schedule.enabled}
                        className="w-32"
                      />
                    </div>
                    <Switch defaultChecked={schedule.enabled} />
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Duração das Consultas</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Consulta Padrão</Label>
                    <Input type="number" defaultValue="30" />
                    <p className="text-xs text-muted-foreground">minutos</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Retorno</Label>
                    <Input type="number" defaultValue="20" />
                    <p className="text-xs text-muted-foreground">minutos</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Emergência</Label>
                    <Input type="number" defaultValue="60" />
                    <p className="text-xs text-muted-foreground">minutos</p>
                  </div>
                </div>
              </div>

              <Button variant="vet" onClick={handleSave} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Salvar Horários
              </Button>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-5 w-5 text-vet-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Formas de Pagamento
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { method: "Dinheiro", enabled: true },
                  { method: "Cartão de Débito", enabled: true },
                  { method: "Cartão de Crédito", enabled: true },
                  { method: "PIX", enabled: true },
                  { method: "Boleto", enabled: false },
                ].map((payment) => (
                  <div key={payment.method} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <span className="font-medium text-foreground">{payment.method}</span>
                    <Switch defaultChecked={payment.enabled} />
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Informações de Cobrança</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chave PIX</Label>
                    <Input defaultValue="contato@petcare.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label>Banco</Label>
                    <Input defaultValue="Banco do Brasil" />
                  </div>
                  <div className="space-y-2">
                    <Label>Agência</Label>
                    <Input defaultValue="1234-5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Conta</Label>
                    <Input defaultValue="12345-6" />
                  </div>
                </div>
              </div>

              <Button variant="vet" onClick={handleSave} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-vet-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Segurança da Conta
                </h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Alterar Senha</h3>
                  <div className="space-y-4">
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
                    <Button variant="vet">
                      <Lock className="h-4 w-4 mr-2" />
                      Atualizar Senha
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Autenticação em Dois Fatores</h3>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Ativar 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Sessões Ativas</h3>
                  <div className="space-y-2">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Chrome - Windows</p>
                          <p className="text-sm text-muted-foreground">São Paulo, Brasil • Ativo agora</p>
                        </div>
                        <Button variant="vetOutline" size="sm">
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-vet-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Permissões de Acesso
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Gerencie as permissões de acesso da sua equipe ao sistema.
                </p>

                {Object.entries(rolesData).map(([roleName, roleData]) => (
                  <div key={roleName} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{roleData.name}</p>
                      <p className="text-sm text-muted-foreground">{roleData.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {roleData.members.length} {roleData.members.length === 1 ? 'membro' : 'membros'}
                      </span>
                      <Button 
                        variant="vetOutline" 
                        size="sm"
                        onClick={() => handleOpenRoleModal(roleName)}
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Role Permissions Modal */}
      <RolePermissionsModal 
        open={showRoleModal}
        onOpenChange={setShowRoleModal}
        role={selectedRole}
      />
    </div>
  );
};

export default ClinicSettings;
