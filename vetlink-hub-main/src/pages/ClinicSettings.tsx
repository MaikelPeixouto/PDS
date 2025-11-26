import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
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
    Lock,
} from "lucide-react";

const ClinicSettings = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("profile");
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: "",
        cnpj: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        photo_url: "",
    });

    const { data: clinicData, isLoading: clinicLoading } = useQuery({
        queryKey: ["clinicProfile", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const response = await api.getClinic(user.id);
            return response.data;
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (clinicData) {
            setProfileForm({
                name: clinicData.name || "",
                cnpj: clinicData.cnpj || "",
                address: clinicData.address || "",
                phone: clinicData.phone || "",
                email: clinicData.email || "",
                description: clinicData.description || "",
                photo_url: clinicData.photo_url || "",
            });
        }
    }, [clinicData]);

    const updateClinicMutation = useMutation({
        mutationFn: async (data: typeof profileForm) => {
            return await api.updateClinic(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clinicProfile", user?.id],
            });
            toast({
                title: "Configurações salvas",
                description: "Suas alterações foram salvas com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao salvar",
                description:
                    error.message || "Não foi possível salvar as alterações.",
                variant: "destructive",
            });
        },
    });

    const handleSave = () => {
        updateClinicMutation.mutate(profileForm);
    };

    const handleLogoUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Arquivo muito grande",
                description: "O arquivo deve ter no máximo 5MB.",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await api.uploadClinicLogo(file);
            setProfileForm((prev) => ({
                ...prev,
                photo_url: result.photo_url,
            }));
            queryClient.invalidateQueries({
                queryKey: ["clinicProfile", user?.id],
            });
            toast({
                title: "Logo atualizado",
                description: "O logo foi atualizado com sucesso.",
            });
        } catch (error: any) {
            toast({
                title: "Erro ao fazer upload",
                description:
                    error.message || "Não foi possível fazer upload do logo.",
                variant: "destructive",
            });
        }
    };

    const [operatingHours, setOperatingHours] = useState([
        {
            day: "Segunda-feira",
            day_of_week: "Segunda-feira",
            open: "08:00",
            close: "18:00",
            enabled: true,
        },
        {
            day: "Terça-feira",
            day_of_week: "Terça-feira",
            open: "08:00",
            close: "18:00",
            enabled: true,
        },
        {
            day: "Quarta-feira",
            day_of_week: "Quarta-feira",
            open: "08:00",
            close: "18:00",
            enabled: true,
        },
        {
            day: "Quinta-feira",
            day_of_week: "Quinta-feira",
            open: "08:00",
            close: "18:00",
            enabled: true,
        },
        {
            day: "Sexta-feira",
            day_of_week: "Sexta-feira",
            open: "08:00",
            close: "18:00",
            enabled: true,
        },
        {
            day: "Sábado",
            day_of_week: "Sábado",
            open: "08:00",
            close: "14:00",
            enabled: true,
        },
        {
            day: "Domingo",
            day_of_week: "Domingo",
            open: "00:00",
            close: "00:00",
            enabled: false,
        },
    ]);

    const [appointmentDurations, setAppointmentDurations] = useState({
        standard: 30,
        return: 20,
        emergency: 60,
    });

    const { data: hoursData, isLoading: hoursLoading } = useQuery({
        queryKey: ["operatingHours", user?.id],
        queryFn: async () => {
            return await api.getOperatingHours();
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (hoursData && Array.isArray(hoursData) && hoursData.length > 0) {
            const hoursMap = new Map(
                hoursData.map((h: any) => [h.day_of_week, h])
            );
            setOperatingHours((prev) =>
                prev.map((h) => {
                    const stored = hoursMap.get(h.day_of_week);
                    if (stored) {
                        const formatTime = (time: string | null) => {
                            if (!time) return "00:00";
                            if (time.length >= 5) return time.substring(0, 5);
                            return time;
                        };
                        return {
                            ...h,
                            open: formatTime(stored.open_time),
                            close: formatTime(stored.close_time),
                            enabled:
                                stored.is_open !== undefined
                                    ? stored.is_open
                                    : h.enabled,
                        };
                    }
                    return h;
                })
            );
        }
    }, [hoursData]);

    const { data: durationsData, isLoading: durationsLoading } = useQuery({
        queryKey: ["appointmentDurations", user?.id],
        queryFn: async () => {
            return await api.getAppointmentDurations();
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (
            durationsData &&
            Array.isArray(durationsData) &&
            durationsData.length > 0
        ) {
            const durationsMap = new Map(
                durationsData.map((d: any) => [d.appointment_type, d])
            );
            setAppointmentDurations({
                standard: durationsMap.get("standard")?.duration_minutes || 30,
                return: durationsMap.get("return")?.duration_minutes || 20,
                emergency:
                    durationsMap.get("emergency")?.duration_minutes || 60,
            });
        }
    }, [durationsData]);

    const updateHoursMutation = useMutation({
        mutationFn: async () => {
            const hours = operatingHours.map((h) => ({
                day_of_week: h.day_of_week,
                open_time: h.enabled ? h.open : null,
                close_time: h.enabled ? h.close : null,
                is_open: h.enabled,
            }));
            return await api.updateOperatingHours(hours);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["operatingHours", user?.id],
            });
            toast({
                title: "Horários salvos",
                description: "Os horários foram atualizados com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao salvar",
                description:
                    error.message || "Não foi possível salvar os horários.",
                variant: "destructive",
            });
        },
    });

    const updateDurationsMutation = useMutation({
        mutationFn: async () => {
            const durations = [
                {
                    appointment_type: "standard",
                    duration_minutes: appointmentDurations.standard,
                },
                {
                    appointment_type: "return",
                    duration_minutes: appointmentDurations.return,
                },
                {
                    appointment_type: "emergency",
                    duration_minutes: appointmentDurations.emergency,
                },
            ];
            return await api.updateAppointmentDurations(durations);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["appointmentDurations", user?.id],
            });
            toast({
                title: "Durações salvas",
                description: "As durações foram atualizadas com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao salvar",
                description:
                    error.message || "Não foi possível salvar as durações.",
                variant: "destructive",
            });
        },
    });

    const handleSaveHours = () => {
        updateHoursMutation.mutate();
        updateDurationsMutation.mutate();
    };

    const rolesData = {
        Administrador: {
            name: "Administrador",
            description: "Acesso total ao sistema",
            permissions: [
                {
                    id: "manage_users",
                    label: "Gerenciar Usuários",
                    description:
                        "Adicionar, editar e remover usuários do sistema",
                },
                {
                    id: "manage_settings",
                    label: "Gerenciar Configurações",
                    description: "Alterar configurações da clínica",
                },
                {
                    id: "view_reports",
                    label: "Visualizar Relatórios",
                    description:
                        "Acesso a todos os relatórios financeiros e operacionais",
                },
                {
                    id: "manage_appointments",
                    label: "Gerenciar Agendamentos",
                    description: "Criar, editar e cancelar agendamentos",
                },
                {
                    id: "manage_medical_records",
                    label: "Gerenciar Prontuários",
                    description: "Acesso completo aos prontuários",
                },
                {
                    id: "manage_billing",
                    label: "Gerenciar Faturamento",
                    description: "Controle total sobre pagamentos e cobranças",
                },
            ],
            members: [
                {
                    id: 1,
                    name: "Carlos Silva",
                    email: "carlos@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 2,
                    name: "Patricia Oliveira",
                    email: "patricia@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
            ],
        },
        Veterinário: {
            name: "Veterinário",
            description: "Acesso a consultas e prontuários",
            permissions: [
                {
                    id: "view_appointments",
                    label: "Visualizar Agendamentos",
                    description: "Ver a agenda de consultas",
                },
                {
                    id: "manage_consultations",
                    label: "Gerenciar Consultas",
                    description: "Realizar e documentar consultas",
                },
                {
                    id: "manage_medical_records",
                    label: "Gerenciar Prontuários",
                    description: "Criar e editar prontuários médicos",
                },
                {
                    id: "prescribe_medications",
                    label: "Prescrever Medicamentos",
                    description: "Criar receitas e prescrições",
                },
                {
                    id: "request_exams",
                    label: "Solicitar Exames",
                    description: "Requisitar exames laboratoriais",
                },
                {
                    id: "view_medical_history",
                    label: "Histórico Médico",
                    description: "Acessar histórico completo dos pacientes",
                },
            ],
            members: [
                {
                    id: 3,
                    name: "Dra. Maria Oliveira",
                    email: "maria@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 4,
                    name: "Dr. João Santos",
                    email: "joao@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 5,
                    name: "Dra. Ana Costa",
                    email: "ana@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
            ],
        },
        Recepcionista: {
            name: "Recepcionista",
            description: "Acesso a agendamentos",
            permissions: [
                {
                    id: "manage_appointments",
                    label: "Gerenciar Agendamentos",
                    description: "Criar, editar e cancelar agendamentos",
                },
                {
                    id: "view_schedule",
                    label: "Visualizar Agenda",
                    description: "Ver agenda completa da clínica",
                },
                {
                    id: "register_clients",
                    label: "Cadastrar Clientes",
                    description: "Adicionar novos clientes e pets",
                },
                {
                    id: "confirm_appointments",
                    label: "Confirmar Consultas",
                    description: "Confirmar presença dos clientes",
                },
                {
                    id: "basic_billing",
                    label: "Faturamento Básico",
                    description: "Registrar pagamentos de consultas",
                },
            ],
            members: [
                {
                    id: 6,
                    name: "Fernanda Lima",
                    email: "fernanda@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 7,
                    name: "Roberto Alves",
                    email: "roberto@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
            ],
        },
        Assistente: {
            name: "Assistente",
            description: "Acesso limitado",
            permissions: [
                {
                    id: "view_appointments",
                    label: "Visualizar Agendamentos",
                    description: "Ver agendamentos do dia",
                },
                {
                    id: "assist_consultations",
                    label: "Auxiliar Consultas",
                    description: "Apoiar veterinários durante consultas",
                },
                {
                    id: "manage_supplies",
                    label: "Gerenciar Suprimentos",
                    description: "Controlar estoque de materiais",
                },
                {
                    id: "basic_patient_care",
                    label: "Cuidados Básicos",
                    description: "Realizar cuidados básicos com os animais",
                },
            ],
            members: [
                {
                    id: 8,
                    name: "Julia Martins",
                    email: "julia@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 9,
                    name: "Pedro Santos",
                    email: "pedro@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 10,
                    name: "Carla Rodrigues",
                    email: "carla@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
                {
                    id: 11,
                    name: "Lucas Ferreira",
                    email: "lucas@petcare.com.br",
                    avatar: "/placeholder.svg",
                },
            ],
        },
    };

    const [paymentMethods, setPaymentMethods] = useState([
        { method: "Dinheiro", payment_type: "cash", enabled: true },
        { method: "Cartão de Débito", payment_type: "debit", enabled: true },
        { method: "Cartão de Crédito", payment_type: "credit", enabled: true },
        { method: "PIX", payment_type: "pix", enabled: true },
        { method: "Boleto", payment_type: "boleto", enabled: false },
    ]);

    const [billingInfo, setBillingInfo] = useState({
        pix_key: "",
        bank_name: "",
        bank_agency: "",
        bank_account: "",
    });

    const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
        useQuery({
            queryKey: ["paymentMethods", user?.id],
            queryFn: async () => {
                return await api.getPaymentMethods();
            },
            enabled: !!user?.id,
        });

    useEffect(() => {
        if (
            paymentMethodsData &&
            Array.isArray(paymentMethodsData) &&
            paymentMethodsData.length > 0
        ) {
            const methodsMap = new Map(
                paymentMethodsData.map((m: any) => [m.payment_type, m])
            );
            setPaymentMethods((prev) =>
                prev.map((pm) => {
                    const stored = methodsMap.get(pm.payment_type);
                    if (stored) {
                        return { ...pm, enabled: stored.is_enabled };
                    }
                    return pm;
                })
            );
        }
    }, [paymentMethodsData]);

    const { data: billingInfoData, isLoading: billingInfoLoading } = useQuery({
        queryKey: ["billingInfo", user?.id],
        queryFn: async () => {
            return await api.getBillingInfo();
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (billingInfoData) {
            setBillingInfo({
                pix_key: billingInfoData.pix_key || "",
                bank_name: billingInfoData.bank_name || "",
                bank_agency: billingInfoData.bank_agency || "",
                bank_account: billingInfoData.bank_account || "",
            });
        }
    }, [billingInfoData]);

    const updatePaymentMethodsMutation = useMutation({
        mutationFn: async () => {
            const methods = paymentMethods.map((pm) => ({
                payment_type: pm.payment_type,
                is_enabled: pm.enabled,
            }));
            return await api.updatePaymentMethods(methods);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["paymentMethods", user?.id],
            });
            toast({
                title: "Métodos de pagamento salvos",
                description:
                    "Os métodos de pagamento foram atualizados com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao salvar",
                description:
                    error.message ||
                    "Não foi possível salvar os métodos de pagamento.",
                variant: "destructive",
            });
        },
    });

    const updateBillingInfoMutation = useMutation({
        mutationFn: async () => {
            return await api.updateBillingInfo(billingInfo);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["billingInfo", user?.id],
            });
            toast({
                title: "Informações de cobrança salvas",
                description:
                    "As informações de cobrança foram atualizadas com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao salvar",
                description:
                    error.message ||
                    "Não foi possível salvar as informações de cobrança.",
                variant: "destructive",
            });
        },
    });

    const handleSavePayments = () => {
        updatePaymentMethodsMutation.mutate();
        updateBillingInfoMutation.mutate();
    };

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [activeSessions, setActiveSessions] = useState<
        Array<{
            id: string;
            created_at: string;
            expires_at: string;
            device: string;
            location: string;
        }>
    >([]);

    const { data: clinicDataForSecurity } = useQuery({
        queryKey: ["clinicProfile", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const response = await api.getClinic(user.id);
            return response.data;
        },
        enabled: !!user?.id && activeTab === "security",
    });

    useEffect(() => {
        if (clinicDataForSecurity) {
            setTwoFactorEnabled(
                clinicDataForSecurity.two_factor_enabled || false
            );
        }
    }, [clinicDataForSecurity]);

    const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
        queryKey: ["activeSessions", user?.id],
        queryFn: async () => {
            return await api.getActiveSessions();
        },
        enabled: !!user?.id && activeTab === "security",
    });

    useEffect(() => {
        if (sessionsData) {
            setActiveSessions(sessionsData || []);
        }
    }, [sessionsData]);

    const changePasswordMutation = useMutation({
        mutationFn: async () => {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                throw new Error("As senhas não coincidem");
            }
            return await api.changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );
        },
        onSuccess: () => {
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            toast({
                title: "Senha alterada",
                description: "Sua senha foi alterada com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao alterar senha",
                description:
                    error.message || "Não foi possível alterar a senha.",
                variant: "destructive",
            });
        },
    });

    const updateTwoFactorMutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            return await api.updateTwoFactor(enabled);
        },
        onSuccess: (data) => {
            setTwoFactorEnabled(data.two_factor_enabled);
            queryClient.invalidateQueries({
                queryKey: ["clinicProfile", user?.id],
            });
            toast({
                title: `2FA ${
                    data.two_factor_enabled ? "ativado" : "desativado"
                }`,
                description: `Autenticação em dois fatores foi ${
                    data.two_factor_enabled ? "ativada" : "desativada"
                } com sucesso.`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao atualizar 2FA",
                description:
                    error.message ||
                    "Não foi possível atualizar a autenticação em dois fatores.",
                variant: "destructive",
            });
        },
    });

    const endSessionMutation = useMutation({
        mutationFn: async (tokenId: string) => {
            return await api.endSession(tokenId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["activeSessions", user?.id],
            });
            toast({
                title: "Sessão encerrada",
                description: "A sessão foi encerrada com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao encerrar sessão",
                description:
                    error.message || "Não foi possível encerrar a sessão.",
                variant: "destructive",
            });
        },
    });

    const handleChangePassword = () => {
        changePasswordMutation.mutate();
    };

    const handleToggleTwoFactor = (checked: boolean) => {
        updateTwoFactorMutation.mutate(checked);
    };

    const handleEndSession = (tokenId: string) => {
        endSessionMutation.mutate(tokenId);
    };

    const [teamMembers, setTeamMembers] = useState<
        Array<{
            id: string;
            email: string;
            name: string;
            role: string;
            permissions: Array<any>;
        }>
    >([]);

    const { data: teamMembersData, isLoading: teamMembersLoading } = useQuery({
        queryKey: ["teamMembers", user?.id],
        queryFn: async () => {
            return await api.getTeamMembers();
        },
        enabled: !!user?.id && activeTab === "team",
    });

    useEffect(() => {
        if (teamMembersData) {
            setTeamMembers(teamMembersData || []);
        }
    }, [teamMembersData]);

    const teamMembersByRole = teamMembers.reduce((acc, member) => {
        if (!acc[member.role]) {
            acc[member.role] = [];
        }
        acc[member.role].push(member);
        return acc;
    }, {} as Record<string, typeof teamMembers>);

    const createTeamMemberMutation = useMutation({
        mutationFn: async (data: {
            email: string;
            name: string;
            role: string;
            permissions?: Array<any>;
        }) => {
            return await api.createTeamMember(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamMembers", user?.id],
            });
            toast({
                title: "Membro adicionado",
                description: "O membro da equipe foi adicionado com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao adicionar membro",
                description:
                    error.message ||
                    "Não foi possível adicionar o membro da equipe.",
                variant: "destructive",
            });
        },
    });

    const updatePermissionsMutation = useMutation({
        mutationFn: async ({
            memberId,
            permissions,
        }: {
            memberId: string;
            permissions: Array<any>;
        }) => {
            return await api.updateTeamMemberPermissions(memberId, permissions);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamMembers", user?.id],
            });
            toast({
                title: "Permissões atualizadas",
                description: "As permissões foram atualizadas com sucesso.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erro ao atualizar permissões",
                description:
                    error.message ||
                    "Não foi possível atualizar as permissões.",
                variant: "destructive",
            });
        },
    });

    const handleOpenRoleModal = (roleName: string) => {
        const roleMembers = teamMembersByRole[roleName] || [];
        const roleData = {
            name: roleName,
            description:
                rolesData[roleName as keyof typeof rolesData]?.description ||
                "",
            permissions:
                rolesData[roleName as keyof typeof rolesData]?.permissions ||
                [],
            members: roleMembers.map((m) => ({
                id: m.id,
                name: m.name,
                email: m.email,
                avatar: "/placeholder.svg",
            })),
        };
        setSelectedRole(roleData);
        setShowRoleModal(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {}
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
                            <h1 className="text-2xl font-bold text-foreground">
                                Configurações
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Gerencie as configurações da sua clínica
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {}
            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="hours">Horários</TabsTrigger>
                        <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                        <TabsTrigger value="security">Segurança</TabsTrigger>
                        <TabsTrigger value="team">Equipe</TabsTrigger>
                    </TabsList>

                    {}
                    <TabsContent value="profile" className="space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Building2 className="h-5 w-5 text-vet-primary" />
                                <h2 className="text-xl font-bold text-foreground">
                                    Informações da Clínica
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {}
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={
                                                profileForm.photo_url ||
                                                "/placeholder.svg"
                                            }
                                        />
                                        <AvatarFallback className="bg-vet-primary text-white text-2xl">
                                            {clinicData?.name
                                                ?.substring(0, 2)
                                                .toUpperCase() || "PC"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                        <Button
                                            variant="vet"
                                            size="sm"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "logo-upload"
                                                    )
                                                    ?.click()
                                            }
                                            disabled={
                                                updateClinicMutation.isPending
                                            }
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Alterar Logo
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            PNG, JPG até 5MB
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {}
                                {clinicLoading ? (
                                    <p className="text-vet-neutral text-center py-4">
                                        Carregando dados da clínica...
                                    </p>
                                ) : (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="clinic-name">
                                                    Nome da Clínica
                                                </Label>
                                                <Input
                                                    id="clinic-name"
                                                    value={profileForm.name}
                                                    onChange={(e) =>
                                                        setProfileForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cnpj">
                                                    CNPJ
                                                </Label>
                                                <Input
                                                    id="cnpj"
                                                    value={profileForm.cnpj}
                                                    onChange={(e) =>
                                                        setProfileForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                cnpj: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address">
                                                    Endereço Completo
                                                </Label>
                                                <Input
                                                    id="address"
                                                    value={profileForm.address}
                                                    onChange={(e) =>
                                                        setProfileForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                address:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">
                                                    Telefone
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    value={profileForm.phone}
                                                    onChange={(e) =>
                                                        setProfileForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                phone: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    E-mail
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileForm.email}
                                                    onChange={(e) =>
                                                        setProfileForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                email: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="description">
                                                    Sobre a Clínica
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    rows={4}
                                                    value={
                                                        profileForm.description
                                                    }
                                                    onChange={(e) =>
                                                        setProfileForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                description:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            variant="vet"
                                            onClick={handleSave}
                                            disabled={
                                                updateClinicMutation.isPending
                                            }
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {updateClinicMutation.isPending
                                                ? "Salvando..."
                                                : "Salvar Alterações"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>
                    </TabsContent>

                    {}
                    <TabsContent value="hours" className="space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Clock className="h-5 w-5 text-vet-primary" />
                                <h2 className="text-xl font-bold text-foreground">
                                    Horário de Funcionamento
                                </h2>
                            </div>

                            {hoursLoading ? (
                                <p className="text-vet-neutral text-center py-4">
                                    Carregando horários...
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {operatingHours.map((schedule) => (
                                        <div
                                            key={schedule.day}
                                            className="flex items-center gap-4 p-4 border border-border rounded-lg"
                                        >
                                            <div className="w-40">
                                                <p className="font-medium text-foreground">
                                                    {schedule.day}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-1">
                                                <Input
                                                    type="time"
                                                    value={schedule.open}
                                                    onChange={(e) =>
                                                        setOperatingHours(
                                                            (prev) =>
                                                                prev.map((h) =>
                                                                    h.day ===
                                                                    schedule.day
                                                                        ? {
                                                                              ...h,
                                                                              open: e
                                                                                  .target
                                                                                  .value,
                                                                          }
                                                                        : h
                                                                )
                                                        )
                                                    }
                                                    disabled={!schedule.enabled}
                                                    className="w-32"
                                                />
                                                <span className="text-muted-foreground">
                                                    até
                                                </span>
                                                <Input
                                                    type="time"
                                                    value={schedule.close}
                                                    onChange={(e) =>
                                                        setOperatingHours(
                                                            (prev) =>
                                                                prev.map((h) =>
                                                                    h.day ===
                                                                    schedule.day
                                                                        ? {
                                                                              ...h,
                                                                              close: e
                                                                                  .target
                                                                                  .value,
                                                                          }
                                                                        : h
                                                                )
                                                        )
                                                    }
                                                    disabled={!schedule.enabled}
                                                    className="w-32"
                                                />
                                            </div>
                                            <Switch
                                                checked={schedule.enabled}
                                                onCheckedChange={(checked) =>
                                                    setOperatingHours((prev) =>
                                                        prev.map((h) =>
                                                            h.day ===
                                                            schedule.day
                                                                ? {
                                                                      ...h,
                                                                      enabled:
                                                                          checked,
                                                                  }
                                                                : h
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">
                                    Duração das Consultas
                                </h3>
                                {durationsLoading ? (
                                    <p className="text-vet-neutral text-center py-4">
                                        Carregando durações...
                                    </p>
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Consulta Padrão</Label>
                                            <Input
                                                type="number"
                                                value={
                                                    appointmentDurations.standard
                                                }
                                                onChange={(e) =>
                                                    setAppointmentDurations(
                                                        (prev) => ({
                                                            ...prev,
                                                            standard:
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 30,
                                                        })
                                                    )
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                minutos
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Retorno</Label>
                                            <Input
                                                type="number"
                                                value={
                                                    appointmentDurations.return
                                                }
                                                onChange={(e) =>
                                                    setAppointmentDurations(
                                                        (prev) => ({
                                                            ...prev,
                                                            return:
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 20,
                                                        })
                                                    )
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                minutos
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Emergência</Label>
                                            <Input
                                                type="number"
                                                value={
                                                    appointmentDurations.emergency
                                                }
                                                onChange={(e) =>
                                                    setAppointmentDurations(
                                                        (prev) => ({
                                                            ...prev,
                                                            emergency:
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 60,
                                                        })
                                                    )
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                minutos
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="vet"
                                onClick={handleSaveHours}
                                className="mt-6"
                                disabled={
                                    updateHoursMutation.isPending ||
                                    updateDurationsMutation.isPending
                                }
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updateHoursMutation.isPending ||
                                updateDurationsMutation.isPending
                                    ? "Salvando..."
                                    : "Salvar Horários"}
                            </Button>
                        </Card>
                    </TabsContent>

                    {}
                    <TabsContent value="payments" className="space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <DollarSign className="h-5 w-5 text-vet-primary" />
                                <h2 className="text-xl font-bold text-foreground">
                                    Formas de Pagamento
                                </h2>
                            </div>

                            {paymentMethodsLoading ? (
                                <p className="text-vet-neutral text-center py-4">
                                    Carregando métodos de pagamento...
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {paymentMethods.map((payment) => (
                                        <div
                                            key={payment.method}
                                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                                        >
                                            <span className="font-medium text-foreground">
                                                {payment.method}
                                            </span>
                                            <Switch
                                                checked={payment.enabled}
                                                onCheckedChange={(checked) =>
                                                    setPaymentMethods((prev) =>
                                                        prev.map((pm) =>
                                                            pm.method ===
                                                            payment.method
                                                                ? {
                                                                      ...pm,
                                                                      enabled:
                                                                          checked,
                                                                  }
                                                                : pm
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">
                                    Informações de Cobrança
                                </h3>
                                {billingInfoLoading ? (
                                    <p className="text-vet-neutral text-center py-4">
                                        Carregando informações de cobrança...
                                    </p>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Chave PIX</Label>
                                            <Input
                                                value={billingInfo.pix_key}
                                                onChange={(e) =>
                                                    setBillingInfo((prev) => ({
                                                        ...prev,
                                                        pix_key: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Banco</Label>
                                            <Input
                                                value={billingInfo.bank_name}
                                                onChange={(e) =>
                                                    setBillingInfo((prev) => ({
                                                        ...prev,
                                                        bank_name:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Agência</Label>
                                            <Input
                                                value={billingInfo.bank_agency}
                                                onChange={(e) =>
                                                    setBillingInfo((prev) => ({
                                                        ...prev,
                                                        bank_agency:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Conta</Label>
                                            <Input
                                                value={billingInfo.bank_account}
                                                onChange={(e) =>
                                                    setBillingInfo((prev) => ({
                                                        ...prev,
                                                        bank_account:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="vet"
                                onClick={handleSavePayments}
                                className="mt-6"
                                disabled={
                                    updatePaymentMethodsMutation.isPending ||
                                    updateBillingInfoMutation.isPending
                                }
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updatePaymentMethodsMutation.isPending ||
                                updateBillingInfoMutation.isPending
                                    ? "Salvando..."
                                    : "Salvar Configurações"}
                            </Button>
                        </Card>
                    </TabsContent>

                    {}
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
                                    <h3 className="font-semibold text-foreground">
                                        Alterar Senha
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">
                                                Senha Atual
                                            </Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={
                                                    passwordForm.currentPassword
                                                }
                                                onChange={(e) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        currentPassword:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">
                                                Nova Senha
                                            </Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        newPassword:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">
                                                Confirmar Nova Senha
                                            </Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={
                                                    passwordForm.confirmPassword
                                                }
                                                onChange={(e) =>
                                                    setPasswordForm((prev) => ({
                                                        ...prev,
                                                        confirmPassword:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <Button
                                            variant="vet"
                                            onClick={handleChangePassword}
                                            disabled={
                                                changePasswordMutation.isPending
                                            }
                                        >
                                            <Lock className="h-4 w-4 mr-2" />
                                            {changePasswordMutation.isPending
                                                ? "Atualizando..."
                                                : "Atualizar Senha"}
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground">
                                        Autenticação em Dois Fatores
                                    </h3>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Ativar 2FA
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Adicione uma camada extra de
                                                segurança
                                            </p>
                                        </div>
                                        <Switch
                                            checked={twoFactorEnabled}
                                            onCheckedChange={
                                                handleToggleTwoFactor
                                            }
                                            disabled={
                                                updateTwoFactorMutation.isPending
                                            }
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground">
                                        Sessões Ativas
                                    </h3>
                                    {sessionsLoading ? (
                                        <p className="text-vet-neutral text-center py-4">
                                            Carregando sessões...
                                        </p>
                                    ) : activeSessions.length === 0 ? (
                                        <p className="text-vet-neutral text-center py-4">
                                            Nenhuma sessão ativa
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {activeSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="p-4 border border-border rounded-lg"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-foreground">
                                                                {session.device}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    session.location
                                                                }{" "}
                                                                • Criada em{" "}
                                                                {new Date(
                                                                    session.created_at
                                                                ).toLocaleString(
                                                                    "pt-BR"
                                                                )}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="vetOutline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEndSession(
                                                                    session.id
                                                                )
                                                            }
                                                            disabled={
                                                                endSessionMutation.isPending
                                                            }
                                                        >
                                                            Encerrar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {}
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

                            {teamMembersLoading ? (
                                <p className="text-vet-neutral text-center py-4">
                                    Carregando membros da equipe...
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">
                                        Gerencie as permissões de acesso da sua
                                        equipe ao sistema.
                                    </p>

                                    {Object.entries(rolesData).map(
                                        ([roleName, roleData]) => {
                                            const membersInRole =
                                                teamMembersByRole[roleName] ||
                                                [];
                                            return (
                                                <div
                                                    key={roleName}
                                                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {roleData.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                roleData.description
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-muted-foreground">
                                                            {
                                                                membersInRole.length
                                                            }{" "}
                                                            {membersInRole.length ===
                                                            1
                                                                ? "membro"
                                                                : "membros"}
                                                        </span>
                                                        <Button
                                                            variant="vetOutline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOpenRoleModal(
                                                                    roleName
                                                                )
                                                            }
                                                        >
                                                            Configurar
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {}
            <RolePermissionsModal
                open={showRoleModal}
                onOpenChange={setShowRoleModal}
                role={selectedRole}
            />
        </div>
    );
};

export default ClinicSettings;
