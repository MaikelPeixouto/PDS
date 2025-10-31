import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Settings
} from "lucide-react";

const ClinicNotifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "appointment",
      title: "Novo Agendamento",
      message: "João Silva agendou consulta para Rex amanhã às 10h",
      time: "5 min atrás",
      read: false,
      icon: Calendar,
      color: "text-vet-primary"
    },
    {
      id: 2,
      type: "payment",
      title: "Pagamento Recebido",
      message: "Pagamento de R$ 250,00 referente à consulta de Mimi",
      time: "1 hora atrás",
      read: false,
      icon: DollarSign,
      color: "text-vet-success"
    },
    {
      id: 3,
      type: "confirmation",
      title: "Consulta Confirmada",
      message: "Maria Santos confirmou a consulta de Luna para hoje às 14h",
      time: "2 horas atrás",
      read: true,
      icon: CheckCircle2,
      color: "text-vet-success"
    },
    {
      id: 4,
      type: "reminder",
      title: "Lembrete de Consulta",
      message: "Você tem 5 consultas agendadas para hoje",
      time: "3 horas atrás",
      read: true,
      icon: Clock,
      color: "text-vet-warning"
    },
    {
      id: 5,
      type: "registration",
      title: "Novo Cliente",
      message: "Ana Lima se cadastrou na plataforma",
      time: "5 horas atrás",
      read: true,
      icon: UserCheck,
      color: "text-vet-secondary"
    },
    {
      id: 6,
      type: "alert",
      title: "Estoque Baixo",
      message: "Vacina antirrábica com estoque abaixo do mínimo",
      time: "1 dia atrás",
      read: true,
      icon: AlertCircle,
      color: "text-vet-error"
    },
  ];

  const notificationSettings = [
    { id: "email", label: "Notificações por E-mail", enabled: true },
    { id: "sms", label: "Notificações por SMS", enabled: false },
    { id: "push", label: "Notificações Push", enabled: true },
    { id: "appointments", label: "Novos Agendamentos", enabled: true },
    { id: "payments", label: "Confirmações de Pagamento", enabled: true },
    { id: "reminders", label: "Lembretes de Consulta", enabled: true },
    { id: "marketing", label: "Novidades e Promoções", enabled: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas notificações e preferências
                </p>
              </div>
            </div>
            
            <Button variant="vet" size="sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar Todas como Lidas
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Recentes
              </h2>
              
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div 
                      key={notification.id}
                      className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                        notification.read 
                          ? "bg-background border-border" 
                          : "bg-vet-primary/5 border-vet-primary/20"
                      }`}
                    >
                      <div className={`p-3 rounded-lg bg-background ${notification.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-vet-primary text-white">Nova</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-vet-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Preferências
                </h2>
              </div>
              
              <div className="space-y-4">
                {notificationSettings.map((setting, index) => (
                  <div key={setting.id}>
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor={setting.id}
                        className="text-sm cursor-pointer"
                      >
                        {setting.label}
                      </Label>
                      <Switch 
                        id={setting.id}
                        defaultChecked={setting.enabled}
                      />
                    </div>
                    {index < notificationSettings.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-vet-primary/5 border-vet-primary/20">
              <Bell className="h-8 w-8 text-vet-primary mb-3" />
              <h3 className="font-bold text-foreground mb-2">
                Mantenha-se Atualizado
              </h3>
              <p className="text-sm text-muted-foreground">
                Configure suas preferências para receber apenas as notificações mais importantes.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicNotifications;
