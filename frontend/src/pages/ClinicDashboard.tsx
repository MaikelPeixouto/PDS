import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { parseISO, format, isToday } from "date-fns";
import api from "@/services/api";

const ClinicStatisticsCard = ({ clinicId }: { clinicId?: string }) => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['clinicStatistics', clinicId],
    queryFn: async () => {
      if (!clinicId) return null;
      return await api.getClinicStatistics(clinicId);
    },
    enabled: !!clinicId,
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-foreground mb-6">Estatísticas</h3>
        <p className="text-vet-neutral text-center py-4">Carregando estatísticas...</p>
      </Card>
    );
  }

  const stats = statistics || {
    totalAppointments: 0,
    activeClients: 0,
    averageRating: 0,
    totalReviews: 0,
    returnRate: 0
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-foreground mb-6">Estatísticas</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-vet-primary/10 rounded-lg">
          <span className="text-foreground">Total de Agendamentos</span>
          <span className="font-bold text-vet-primary">{stats.totalAppointments.toLocaleString('pt-BR')}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-vet-success/10 rounded-lg">
          <span className="text-foreground">Clientes Ativos</span>
          <span className="font-bold text-vet-success">{stats.activeClients.toLocaleString('pt-BR')}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-vet-secondary/10 rounded-lg">
          <span className="text-foreground">Avaliação Média</span>
          <span className="font-bold text-vet-secondary">{stats.averageRating.toFixed(1)}/5.0</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-vet-accent/10 rounded-lg">
          <span className="text-foreground">Taxa de Retorno</span>
          <span className="font-bold text-vet-accent">{stats.returnRate}%</span>
        </div>
      </div>
    </Card>
  );
};
import AddVeterinarianModal from "@/components/modals/AddVeterinarianModal";
import NewAppointmentModal from "@/components/modals/NewAppointmentModal";
import AppointmentDetailsModal from "@/components/modals/AppointmentDetailsModal";
import EditAppointmentModal from "@/components/modals/EditAppointmentModal";
import { VeterinarianScheduleModal } from "@/components/modals/VeterinarianScheduleModal";
import { EditVeterinarianModal } from "@/components/modals/EditVeterinarianModal";
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
  Filter,
  Cat,
  Dog,
  Bird,
  Rabbit,
  PawPrint,
  LogOut
} from "lucide-react";

const getPetIcon = (species: string) => {
  const s = species?.toLowerCase() || '';
  if (s.includes('gato') || s.includes('felino')) return <Cat className="h-5 w-5 text-vet-primary" />;
  if (s.includes('cachorro') || s.includes('cão') || s.includes('canino')) return <Dog className="h-5 w-5 text-vet-primary" />;
  if (s.includes('pássaro') || s.includes('ave') || s.includes('passaro')) return <Bird className="h-5 w-5 text-vet-primary" />;
  if (s.includes('coelho')) return <Rabbit className="h-5 w-5 text-vet-primary" />;
  return <PawPrint className="h-5 w-5 text-vet-primary" />;
};

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddVetModal, setShowAddVetModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [showVetScheduleModal, setShowVetScheduleModal] = useState(false);
  const [showEditVetModal, setShowEditVetModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(undefined);
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<any>(null);

  const { data: appointmentsData = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['clinicAppointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.getAppointments({ clinicId: user.id });
      console.log('[ClinicDashboard] Appointments response:', response);
      return response || [];
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const { data: veterinariansData = [], isLoading: veterinariansLoading } = useQuery({
    queryKey: ['veterinarians', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await api.getVeterinarians(user.id);
    },
    enabled: !!user?.id,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ['unreadCount', user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      const result = await api.getUnreadCount();
      console.log('[ClinicDashboard] Unread count response:', result);
      return result;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const unreadCount = unreadCountData?.count || 0;
  console.log('[ClinicDashboard] Unread count:', unreadCount);

  console.log('[ClinicDashboard] appointmentsData:', appointmentsData);
  const formattedAppointments = appointmentsData.map((apt: any) => ({
    ...apt,
    time: apt.appointment_date ? format(parseISO(apt.appointment_date), 'HH:mm') : '',
    date: apt.appointment_date ? format(parseISO(apt.appointment_date), 'dd/MM/yyyy') : '',
    pet: apt.pet_name || apt.pet?.name || 'N/A',
    species: apt.pet_species || apt.pet?.species || '',
    owner: apt.user_name || (apt.user ? `${apt.user.first_name} ${apt.user.last_name}` : 'N/A'),
    service: apt.service_name || apt.service?.name || 'N/A',
  }));
  console.log('[ClinicDashboard] formattedAppointments:', formattedAppointments);

  const todayAppointments = formattedAppointments.filter((apt: any) => {
    if (!apt.appointment_date) return false;
    const aptDate = parseISO(apt.appointment_date);
    return isToday(aptDate);
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthAppointments = formattedAppointments.filter((apt: any) => {
    if (!apt.appointment_date) return false;
    const aptDate = parseISO(apt.appointment_date);
    return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
  });

  const monthlyRevenue = monthAppointments.reduce((sum: number, apt: any) => {
    const price = apt.service?.price || apt.price || 150;
    return sum + price;
  }, 0);

  const uniqueUsersThisMonth = new Set(
    monthAppointments
      .filter((apt: any) => apt.user_id || (apt.user && apt.user.id))
      .map((apt: any) => apt.user_id || apt.user?.id)
  );

  const confirmedAppointments = monthAppointments.filter(
    (apt: any) => apt.status === 'confirmed' || apt.status === 'scheduled'
  ).length;
  const occupancyRate = monthAppointments.length > 0
    ? Math.round((confirmedAppointments / monthAppointments.length) * 100)
    : 0;

  const clinicData = user?.clinic || {
    name: user?.name || "Clínica",
    rating: 0,
    reviews: 0,
    address: user?.address || "",
    phone: user?.phone || "",
    email: user?.email || "",
    avatar: "/placeholder.svg"
  };

  const metrics = [
    {
      title: "Agendamentos Hoje",
      value: todayAppointments.length.toString(),
      icon: Calendar,
      color: "text-vet-primary"
    },
    {
      title: "Receita do Mês",
      value: `R$ ${(monthlyRevenue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: "text-vet-success"
    },
    {
      title: "Novos Clientes",
      value: uniqueUsersThisMonth.size.toString(),
      icon: Users,
      color: "text-vet-secondary"
    },
    {
      title: "Taxa de Ocupação",
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      color: "text-vet-accent"
    }
  ];

  const veterinarians = veterinariansData.length > 0 ? veterinariansData.map((vet: any) => ({
    id: vet.id,
    name: `${vet.first_name} ${vet.last_name}`,
    specialty: vet.specialty,
    crmv: vet.crmv,
    status: "Ativo",
    email: vet.email,
    phone: vet.phone,
  })) : [];

  const formattedVeterinarians = veterinarians;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "pending": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      case "Ativo": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "Inativo": return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
      case "Férias": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      default: return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      { }
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={clinicData.avatar} alt={clinicData.name} />
                <AvatarFallback className="bg-vet-primary text-white">PC</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-foreground">{clinicData?.name || "Clínica"}</h1>
                {clinicData?.rating && (
                  <div className="flex items-center gap-2 text-sm text-vet-neutral">
                    <Star className="h-4 w-4 fill-vet-warning text-vet-warning" />
                    {clinicData.rating} {clinicData.reviews ? `(${clinicData.reviews} avaliações)` : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="vetOutline"
                size="sm"
                onClick={() => navigate("/clinica/notificacoes")}
                className="relative"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notificações
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-vet-error text-white text-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="vet"
                size="sm"
                onClick={() => navigate("/clinica/configuracoes")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      { }
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="veterinarians">Veterinários</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          { }
          <TabsContent value="dashboard" className="space-y-6">
            { }
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

            { }
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Agendamentos de Hoje</h3>
                <Button variant="vet" size="sm" onClick={() => setShowNewAppointmentModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>

              {appointmentsLoading ? (
                <p className="text-vet-neutral text-center py-4">Carregando agendamentos...</p>
              ) : formattedAppointments.filter((apt: any) => {
                if (!apt.appointment_date) return false;
                const aptDate = parseISO(apt.appointment_date);
                return isToday(aptDate);
              }).length === 0 ? (
                <p className="text-vet-neutral text-center py-4">Nenhum agendamento hoje</p>
              ) : (
                <div className="space-y-4">
                  {formattedAppointments.filter((apt: any) => {
                    if (!apt.appointment_date) return false;
                    const aptDate = parseISO(apt.appointment_date);
                    return isToday(aptDate);
                  }).map((appointment: any) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Clock className="h-4 w-4 text-vet-neutral mx-auto mb-1" />
                          <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {getPetIcon(appointment.species)}
                            <p className="font-semibold text-foreground">{appointment.pet}</p>
                          </div>
                          <p className="text-sm text-vet-neutral">Serviço: {appointment.service}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(appointment.status)}`}>
                          {appointment.status === 'confirmed' ? 'Confirmado' : appointment.status === 'pending' ? 'Pendente' : appointment.status}
                        </Badge>
                        <Button
                          variant="vetOutline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowEditAppointmentModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          { }
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
                <Button variant="vet" onClick={() => setShowNewAppointmentModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              {appointmentsLoading ? (
                <p className="text-vet-neutral text-center py-4">Carregando agendamentos...</p>
              ) : formattedAppointments.length === 0 ? (
                <p className="text-vet-neutral text-center py-4">Nenhum agendamento encontrado</p>
              ) : (
                <div className="space-y-4">
                  {formattedAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-vet-primary/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Clock className="h-5 w-5 text-vet-neutral mx-auto mb-1" />
                          <p className="font-medium text-foreground">{appointment.time}</p>
                          <p className="text-xs text-vet-neutral">{appointment.date}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {getPetIcon(appointment.species)}
                            <p className="font-semibold text-foreground text-lg">{appointment.pet}</p>
                          </div>
                          <p className="text-vet-neutral">Serviço: {appointment.service}</p>
                          {appointment.veterinarian_name && (
                            <p className="text-vet-neutral">Veterinário: {appointment.veterinarian_name}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(appointment.status)}`}>
                          {appointment.status === 'confirmed' ? 'Confirmado' : appointment.status === 'pending' ? 'Pendente' : appointment.status}
                        </Badge>
                        <Button
                          variant="vetOutline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowAppointmentDetailsModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                        <Button
                          variant="vetOutline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowEditAppointmentModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          { }
          <TabsContent value="veterinarians" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Equipe Veterinária</h2>
              <Button variant="vet" onClick={() => setShowAddVetModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Veterinário
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {veterinariansLoading ? (
                <p className="text-vet-neutral text-center py-4 col-span-full">Carregando veterinários...</p>
              ) : formattedVeterinarians.length === 0 ? (
                <Card className="p-6 col-span-full text-center">
                  <p className="text-vet-neutral mb-4">Nenhum veterinário cadastrado</p>
                  <Button variant="vet" onClick={() => setShowAddVetModal(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Veterinário
                  </Button>
                </Card>
              ) : (
                formattedVeterinarians.map((vet: any) => (
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
                        {vet.status}
                      </Badge>

                      <div className="flex gap-2">
                        <Button
                          variant="vetOutline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedVeterinarian(vet);
                            setShowEditVetModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="vet"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedVeterinarian(vet);
                            setShowVetScheduleModal(true);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Agenda
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          { }
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Perfil da Clínica</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Informações Básicas</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clinicName">Nome da Clínica</Label>
                    <Input defaultValue={clinicData?.name || ""} />
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input defaultValue={clinicData?.address || ""} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input defaultValue={clinicData?.phone || ""} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input defaultValue={clinicData?.email || ""} />
                    </div>
                  </div>

                  <Button variant="vet" className="w-full">
                    Salvar Alterações
                  </Button>
                </div>
              </Card>

              <ClinicStatisticsCard clinicId={user?.id} />
            </div>
          </TabsContent>

          { }
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
              <Button variant="vet" onClick={() => navigate("/relatorios/gerar")}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate("/relatorios/mensal")}
              >
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

              <Card
                className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate("/relatorios/clientes")}
              >
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

              <Card
                className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate("/relatorios/financeiro")}
              >
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

      { }
      <AddVeterinarianModal
        open={showAddVetModal}
        onOpenChange={setShowAddVetModal}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['veterinarians', user?.id] });
        }}
      />
      <NewAppointmentModal
        open={showNewAppointmentModal}
        onOpenChange={setShowNewAppointmentModal}
      />
      <AppointmentDetailsModal
        open={showAppointmentDetailsModal}
        onOpenChange={setShowAppointmentDetailsModal}
        appointment={selectedAppointment}
        onEdit={() => {
          setShowAppointmentDetailsModal(false);
          setShowEditAppointmentModal(true);
        }}
      />
      <EditAppointmentModal
        open={showEditAppointmentModal}
        onOpenChange={setShowEditAppointmentModal}
        appointment={selectedAppointment}
      />
      <VeterinarianScheduleModal
        open={showVetScheduleModal}
        onOpenChange={setShowVetScheduleModal}
        veterinarian={selectedVeterinarian}
      />
      <EditVeterinarianModal
        open={showEditVetModal}
        onOpenChange={setShowEditVetModal}
        veterinarian={selectedVeterinarian}
      />
    </div>
  );
};

export default ClinicDashboard;
