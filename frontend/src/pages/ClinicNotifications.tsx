import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
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

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'appointment':
      return Calendar;
    case 'payment':
      return DollarSign;
    case 'confirmation':
      return CheckCircle2;
    case 'reminder':
      return Clock;
    case 'registration':
      return UserCheck;
    case 'alert':
      return AlertCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'appointment':
      return 'text-vet-primary';
    case 'payment':
    case 'confirmation':
      return 'text-vet-success';
    case 'reminder':
      return 'text-vet-warning';
    case 'alert':
      return 'text-vet-error';
    default:
      return 'text-vet-secondary';
  }
};

const ClinicNotifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notificationsData = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      return await api.getNotifications({ limit: 50 });
    },
    enabled: !!user?.id,
  });

  const { data: preferencesData, isLoading: preferencesLoading } = useQuery({
    queryKey: ['notificationPreferences', user?.id],
    queryFn: async () => {
      return await api.getNotificationPreferences();
    },
    enabled: !!user?.id,
  });

  const [preferences, setPreferences] = useState({
    email_enabled: true,
    sms_enabled: false,
    push_enabled: true,
    appointments_enabled: true,
    payments_enabled: true,
    reminders_enabled: true,
    marketing_enabled: false,
  });

  useEffect(() => {
    if (preferencesData) {
      setPreferences({
        email_enabled: preferencesData.email_enabled ?? true,
        sms_enabled: preferencesData.sms_enabled ?? false,
        push_enabled: preferencesData.push_enabled ?? true,
        appointments_enabled: preferencesData.appointments_enabled ?? true,
        payments_enabled: preferencesData.payments_enabled ?? true,
        reminders_enabled: preferencesData.reminders_enabled ?? true,
        marketing_enabled: preferencesData.marketing_enabled ?? false,
      });
    }
  }, [preferencesData]);

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.markNotificationAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount', user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await api.markAllNotificationsAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount', user?.id] });
      toast({
        title: "Notificações marcadas",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível marcar as notificações como lidas.",
        variant: "destructive",
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: typeof preferences) => {
      return await api.updateNotificationPreferences(newPreferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences', user?.id] });
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram salvas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar as preferências.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updatePreferencesMutation.mutate(newPreferences);
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const notificationSettings = [
    { id: "email_enabled" as keyof typeof preferences, label: "Notificações por E-mail" },
    { id: "sms_enabled" as keyof typeof preferences, label: "Notificações por SMS" },
    { id: "push_enabled" as keyof typeof preferences, label: "Notificações Push" },
    { id: "appointments_enabled" as keyof typeof preferences, label: "Novos Agendamentos" },
    { id: "payments_enabled" as keyof typeof preferences, label: "Confirmações de Pagamento" },
    { id: "reminders_enabled" as keyof typeof preferences, label: "Lembretes de Consulta" },
    { id: "marketing_enabled" as keyof typeof preferences, label: "Novidades e Promoções" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {}
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

            <Button
              variant="vet"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending || notificationsData.filter((n: any) => !n.read).length === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar Todas como Lidas
            </Button>
          </div>
        </div>
      </header>

      {}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Recentes
              </h2>

              {notificationsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando notificações...
                </div>
              ) : notificationsData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma notificação ainda.
                </div>
              ) : (
                <div className="space-y-4">
                  {notificationsData.map((notification: any) => {
                    const Icon = getNotificationIcon(notification.type);
                    const color = getNotificationColor(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`flex gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                          notification.read
                            ? "bg-background border-border"
                            : "bg-vet-primary/5 border-vet-primary/20"
                        }`}
                        onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      >
                        <div className={`p-3 rounded-lg bg-background ${color}`}>
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
                              {formatTime(notification.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-vet-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Preferências
                </h2>
              </div>

              {preferencesLoading ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Carregando preferências...
                </div>
              ) : (
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
                          checked={preferences[setting.id]}
                          onCheckedChange={(checked) => handlePreferenceChange(setting.id, checked)}
                          disabled={updatePreferencesMutation.isPending}
                        />
                      </div>
                      {index < notificationSettings.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
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
