import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  Edit,
  Plus,
  Settings,
  Bell,
  FileText,
  UserPlus,
  Search,
  Filter
} from "lucide-react";

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data
  const clinicData = {
    name: "Clínica Veterinária PetCare",
    rating: 4.8,
    reviews: 342,
    address: "Rua das Flores, 123 - Vila Madalena, São Paulo",
    phone: "(11) 99999-9999",
    email: "contato@petcare.com.br",
    avatar: "/placeholder.svg"
  };

  const metrics = [
    { title: "Agendamentos Hoje", value: "23", icon: Calendar, color: "text-vet-primary" },
    { title: "Receita do Mês", value: "R$ 45.2K", icon: DollarSign, color: "text-vet-success" },
    { title: "Novos Clientes", value: "12", icon: Users, color: "text-vet-secondary" },
    { title: "Taxa de Ocupação", value: "87%", icon: TrendingUp, color: "text-vet-accent" }
  ];

  const appointments = [
    { id: 1, time: "09:00", pet: "Rex", owner: "João Silva", service: "Consulta", status: "confirmed" },
    { id: 2, time: "10:30", pet: "Mimi", owner: "Maria Santos", service: "Vacinação", status: "pending" },
    { id: 3, time: "14:00", pet: "Bob", owner: "Carlos Lima", service: "Cirurgia", status: "confirmed" },
    { id: 4, time: "15:30", pet: "Luna", owner: "Ana Costa", service: "Check-up", status: "confirmed" }
  ];

  const veterinarians = [
    { id: 1, name: "Dra. Maria Oliveira", specialty: "Clínica Geral", crmv: "CRMV-SP 12345", status: "online" },
    { id: 2, name: "Dr. João Santos", specialty: "Cirurgia", crmv: "CRMV-SP 67890", status: "busy" },
    { id: 3, name: "Dra. Ana Costa", specialty: "Cardiologia", crmv: "CRMV-SP 11111", status: "offline" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "pending": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      case "online": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "busy": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      case "offline": return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
      default: return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={clinicData.avatar} alt={clinicData.name} />
                <AvatarFallback className="bg-vet-primary text-white">PC</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-foreground">{clinicData.name}</h1>
                <div className="flex items-center gap-2 text-sm text-vet-neutral">
                  <Star className="h-4 w-4 fill-vet-warning text-vet-warning" />
                  {clinicData.rating} ({clinicData.reviews} avaliações)
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="vetOutline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </Button>
              <Button variant="vet" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="veterinarians">Veterinários</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-vet-neutral">{metric.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color === 'text-vet-primary' ? 'from-vet-primary/10 to-vet-primary/20' : metric.color === 'text-vet-success' ? 'from-vet-success/10 to-vet-success/20' : metric.color === 'text-vet-secondary' ? 'from-vet-secondary/10 to-vet-secondary/20' : 'from-vet-accent/10 to-vet-accent/20'}`}>
                        <Icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Today's Appointments */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Agendamentos de Hoje</h3>
                <Button variant="vet" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
              
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Clock className="h-4 w-4 text-vet-neutral mx-auto mb-1" />
                        <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{appointment.pet}</p>
                        <p className="text-sm text-vet-neutral">Dono: {appointment.owner}</p>
                        <p className="text-sm text-vet-neutral">{appointment.service}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </Badge>
                      <Button variant="vetOutline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Gestão de Agendamentos</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-vet-neutral" />
                  <Input placeholder="Buscar agendamentos..." className="pl-10" />
                </div>
                <Button variant="vetOutline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="vet">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-vet-primary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Clock className="h-5 w-5 text-vet-neutral mx-auto mb-1" />
                        <p className="font-medium text-foreground">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">{appointment.pet}</p>
                        <p className="text-vet-neutral">Proprietário: {appointment.owner}</p>
                        <p className="text-vet-neutral">Serviço: {appointment.service}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </Badge>
                      <Button variant="vetOutline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                      <Button variant="vetOutline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Veterinarians Tab */}
          <TabsContent value="veterinarians" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Equipe Veterinária</h2>
              <Button variant="vet">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Veterinário
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {veterinarians.map((vet) => (
                <Card key={vet.id} className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src="/placeholder.svg" alt={vet.name} />
                      <AvatarFallback className="bg-vet-primary text-white text-lg">
                        {vet.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="font-bold text-foreground text-lg">{vet.name}</h3>
                    <p className="text-vet-neutral mb-2">{vet.specialty}</p>
                    <p className="text-sm text-vet-neutral mb-4">{vet.crmv}</p>
                    
                    <Badge className={`${getStatusColor(vet.status)} mb-4`}>
                      {vet.status === 'online' ? 'Online' : vet.status === 'busy' ? 'Ocupado' : 'Offline'}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="vetOutline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="vet" size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agenda
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Perfil da Clínica</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Informações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clinicName">Nome da Clínica</Label>
                    <Input defaultValue={clinicData.name} />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input defaultValue={clinicData.address} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input defaultValue={clinicData.phone} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input defaultValue={clinicData.email} />
                    </div>
                  </div>
                  
                  <Button variant="vet" className="w-full">
                    Salvar Alterações
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Estatísticas</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-vet-primary/10 rounded-lg">
                    <span className="text-foreground">Total de Agendamentos</span>
                    <span className="font-bold text-vet-primary">1,234</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-vet-success/10 rounded-lg">
                    <span className="text-foreground">Clientes Ativos</span>
                    <span className="font-bold text-vet-success">456</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-vet-secondary/10 rounded-lg">
                    <span className="text-foreground">Avaliação Média</span>
                    <span className="font-bold text-vet-secondary">{clinicData.rating}/5.0</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-vet-accent/10 rounded-lg">
                    <span className="text-foreground">Taxa de Retorno</span>
                    <span className="font-bold text-vet-accent">87%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
              <Button variant="vet">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="p-4 bg-vet-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-vet-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Relatório Mensal</h3>
                  <p className="text-vet-neutral mb-4">Agendamentos e receitas do mês</p>
                  <Button variant="vetOutline" size="sm" className="w-full">
                    Visualizar
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="p-4 bg-vet-success/10 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-vet-success" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Clientes</h3>
                  <p className="text-vet-neutral mb-4">Relatório de clientes ativos</p>
                  <Button variant="vetOutline" size="sm" className="w-full">
                    Visualizar
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="p-4 bg-vet-secondary/10 rounded-full w-fit mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-vet-secondary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Financeiro</h3>
                  <p className="text-vet-neutral mb-4">Receitas e despesas</p>
                  <Button variant="vetOutline" size="sm" className="w-full">
                    Visualizar
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClinicDashboard;