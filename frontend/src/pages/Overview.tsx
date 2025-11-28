import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Bell,
  Activity,
  Star,
  ChevronRight,
  Plus,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Timer
} from "lucide-react";

const Overview = () => {
  const todayStats = {
    consultations: 23,
    revenue: "R$ 3.240",
    newClients: 4,
    occupancyRate: 87
  };

  const upcomingAppointments = [
    {
      id: 1,
      time: "09:00",
      pet: "Rex",
      owner: "João Silva",
      service: "Consulta Geral",
      status: "confirmed",
      priority: "normal"
    },
    {
      id: 2,
      time: "09:30",
      pet: "Mimi", 
      owner: "Maria Santos",
      service: "Vacinação",
      status: "confirmed",
      priority: "high"
    },
    {
      id: 3,
      time: "10:00",
      pet: "Bob",
      owner: "Carlos Lima", 
      service: "Cirurgia",
      status: "pending",
      priority: "urgent"
    },
    {
      id: 4,
      time: "10:30",
      pet: "Luna",
      owner: "Ana Costa",
      service: "Check-up",
      status: "confirmed", 
      priority: "normal"
    }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: "Maria Santos",
      message: "Gostaria de reagendar a consulta do Mimi",
      time: "há 5 min",
      unread: true,
      type: "reschedule"
    },
    {
      id: 2,
      sender: "João Silva",
      message: "Rex está se comportando de forma estranha...",
      time: "há 15 min",
      unread: true,
      type: "concern"
    },
    {
      id: 3,
      sender: "Ana Costa",
      message: "Obrigada pelo atendimento excelente!",
      time: "há 1h",
      unread: false,
      type: "feedback"
    },
    {
      id: 4,
      sender: "Carlos Lima",
      message: "Confirmação da cirurgia do Bob amanhã",
      time: "há 2h",
      unread: false,
      type: "confirmation"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "urgent",
      title: "Emergência - Rex",
      message: "Cliente reportou sintomas graves",
      time: "há 10 min"
    },
    {
      id: 2,
      type: "reminder",
      title: "Lembrete",
      message: "Cirurgia do Bob em 30 minutos",
      time: "há 20 min"
    },
    {
      id: 3,
      type: "info",
      title: "Estoque baixo",
      message: "Vacinas V10 com apenas 5 unidades",
      time: "há 1h"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "pending": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      default: return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-red-500";
      case "high": return "border-l-orange-500";
      case "normal": return "border-l-vet-primary";
      default: return "border-l-vet-neutral";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "reminder": return <Timer className="h-4 w-4 text-vet-warning" />;
      case "info": return <Bell className="h-4 w-4 text-vet-primary" />;
      default: return <Bell className="h-4 w-4 text-vet-neutral" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-primary/5 via-background to-vet-secondary/5">
      {}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
              <p className="text-vet-neutral">Clínica Veterinária PetCare - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="vetOutline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificações (3)
              </Button>
              <Button variant="vet" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {}
          <div className="col-span-8 space-y-6">
            {}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-vet-neutral">Consultas Hoje</p>
                      <p className="text-2xl font-bold text-foreground">{todayStats.consultations}</p>
                    </div>
                    <div className="p-2 bg-vet-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-vet-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-vet-neutral">Receita Hoje</p>
                      <p className="text-2xl font-bold text-foreground">{todayStats.revenue}</p>
                    </div>
                    <div className="p-2 bg-vet-success/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-vet-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-vet-neutral">Novos Clientes</p>
                      <p className="text-2xl font-bold text-foreground">{todayStats.newClients}</p>
                    </div>
                    <div className="p-2 bg-vet-secondary/10 rounded-lg">
                      <Users className="h-5 w-5 text-vet-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-vet-neutral">Taxa Ocupação</p>
                      <p className="text-2xl font-bold text-foreground">{todayStats.occupancyRate}%</p>
                    </div>
                    <div className="p-2 bg-vet-accent/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-vet-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-vet-primary" />
                    Próximos Atendimentos
                  </CardTitle>
                  <Button variant="vetOutline" size="sm">
                    Ver Agenda Completa
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-4 border-l-4 ${getPriorityColor(appointment.priority)} bg-gradient-to-r from-transparent to-vet-primary/5 rounded-r-lg border border-l-0 border-border`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="p-2 bg-vet-primary/10 rounded-lg mb-1">
                              <Clock className="h-4 w-4 text-vet-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">{appointment.pet}</p>
                              {appointment.priority === "urgent" && (
                                <Badge className="bg-red-100 text-red-700 text-xs">Urgente</Badge>
                              )}
                            </div>
                            <p className="text-sm text-vet-neutral">Tutor: {appointment.owner}</p>
                            <p className="text-sm text-vet-neutral">Serviço: {appointment.service}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="vetOutline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="vet" size="sm">
                              Iniciar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="col-span-4 space-y-6">
            {}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-vet-warning" />
                  Alertas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 border border-border rounded-lg hover:bg-vet-primary/5 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{alert.title}</p>
                            <p className="text-xs text-vet-neutral mt-1">{alert.message}</p>
                            <p className="text-xs text-vet-neutral/70 mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-vet-primary" />
                    Mensagens Recentes
                  </CardTitle>
                  <Badge className="bg-vet-primary/10 text-vet-primary">
                    2 não lidas
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {recentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border border-border rounded-lg cursor-pointer hover:bg-vet-primary/5 transition-colors ${
                          message.unread ? 'bg-vet-primary/5 border-vet-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-vet-primary text-white text-xs">
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground text-sm">{message.sender}</p>
                                {message.unread && (
                                  <div className="w-2 h-2 bg-vet-primary rounded-full"></div>
                                )}
                              </div>
                              <p className="text-xs text-vet-neutral">{message.message}</p>
                              <p className="text-xs text-vet-neutral/70 mt-1">{message.time}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="vetOutline" size="sm" className="w-full">
                    Ver Todas as Mensagens
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-vet-primary" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="vet" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Cliente
                  </Button>
                  <Button variant="vetOutline" size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-1" />
                    Agendar
                  </Button>
                  <Button variant="vetOutline" size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-1" />
                    Clientes
                  </Button>
                  <Button variant="vetOutline" size="sm" className="w-full">
                    <Star className="h-4 w-4 mr-1" />
                    Avaliações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;