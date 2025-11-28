import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Plus,
    PawPrint,
    Calendar,
    Syringe,
    Heart,
    FileText,
    Camera,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import EditPetModal from "@/components/modals/EditPetModal";
import DeletePetDialog from "@/components/modals/DeletePetDialog";
import api from "@/services/api";

const MyPets = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [cancelAppointmentDialogOpen, setCancelAppointmentDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [newPetForm, setNewPetForm] = useState({
        name: "",
        species: "Cão",
        breed: "",
        age: "",
        weight: "",
        gender: "Macho",
        microchip: "",
    });

    const { data: userAppointments = [] } = useQuery({
        queryKey: ["userAppointments"],
        queryFn: async () => {
            try {
                const appointments = await api.getAppointments();
                return appointments || [];
            } catch (error) {
                console.error("Error fetching appointments:", error);
                return [];
            }
        },
    });

    const cancelAppointmentMutation = useMutation({
        mutationFn: async (appointmentId: string) => {
            return await api.updateAppointment(appointmentId, { status: "cancelled" });
        },
        onSuccess: () => {
            toast.success("Agendamento cancelado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
            setCancelAppointmentDialogOpen(false);
            setSelectedAppointment(null);
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao cancelar agendamento");
        },
    });

    const handleCancelAppointment = (appointment: any) => {
        setSelectedAppointment(appointment);
        setCancelAppointmentDialogOpen(true);
    };

    const confirmCancelAppointment = () => {
        if (selectedAppointment?.id) {
            cancelAppointmentMutation.mutate(selectedAppointment.id);
        }
    };

    const {
        data: pets = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["pets", userAppointments],
        queryFn: async () => {
            const petsData = await api.getPets();

            // Fetch vaccines for each pet
            const petsWithDetails = await Promise.all(petsData.map(async (pet: any) => {
                let lastVaccineDate = "N/A";
                let vaccines = [];
                try {
                    vaccines = await api.getVaccines(pet.id);
                    if (vaccines && vaccines.length > 0) {
                        // Sort by date descending
                        const sortedVaccines = [...vaccines].sort((a: any, b: any) => {
                            return new Date(b.vaccination_date).getTime() - new Date(a.vaccination_date).getTime();
                        });

                        const lastVac = sortedVaccines[0];
                        lastVaccineDate = format(new Date(lastVac.vaccination_date), "dd/MM/yyyy", { locale: ptBR });
                    }
                } catch (error) {
                    console.error(`Error fetching vaccines for pet ${pet.id}`, error);
                }

                const petAppointments = userAppointments
                    .filter(
                        (apt: any) =>
                            apt.pet_id === pet.id && apt.status !== "cancelled"
                    )
                    .sort((a: any, b: any) => {
                        const dateA = new Date(a.appointment_date);
                        const dateB = new Date(b.appointment_date);
                        return dateA.getTime() - dateB.getTime();
                    });

                const nextAppointment = petAppointments.find((apt: any) => {
                    const aptDate = new Date(apt.appointment_date);
                    return aptDate >= new Date();
                });

                let nextAppointmentText = "Não agendada";
                if (nextAppointment) {
                    const aptDate = new Date(nextAppointment.appointment_date);
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    if (aptDate.toDateString() === today.toDateString()) {
                        nextAppointmentText = `Hoje às ${aptDate.toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                        )}`;
                    } else if (
                        aptDate.toDateString() === tomorrow.toDateString()
                    ) {
                        nextAppointmentText = `Amanhã às ${aptDate.toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                        )}`;
                    } else {
                        nextAppointmentText = aptDate.toLocaleDateString(
                            "pt-BR",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        );
                    }
                }

                return {
                    ...pet,
                    image:
                        pet.species === "Gato"
                            ? "🐱"
                            : pet.species === "Cão"
                                ? "🐕"
                                : "🐾",
                    nextAppointment: nextAppointmentText,
                    lastVaccine: lastVaccineDate,
                    vaccines: vaccines // Store vaccines for summary calculation
                };
            }));

            return petsWithDetails;
        },
        enabled: true,
    });

    // Calculate Summary Statistics
    const appointmentsThisMonth = userAppointments.filter((apt: any) => {
        if (apt.status === 'cancelled') return false;
        const aptDate = new Date(apt.appointment_date);
        const today = new Date();
        return aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear();
    }).length;

    const vaccinesUpToDateCount = pets.reduce((acc: number, pet: any) => {
        // Simple logic: if pet has any vaccine with next_vaccination_date > today, count as up to date
        // Or just count total vaccines given. Let's count pets with at least one vaccine for now as "active vaccination record"
        // Better: Count total vaccines administered in the last year across all pets?
        // User asked for "Vacinas em dia". Let's count pets that have vaccines.
        if (pet.vaccines && pet.vaccines.length > 0) {
            // Check if any vaccine is valid (next date in future or no next date but recent)
            // For simplicity, let's count total vaccines administered to show activity
            return acc + pet.vaccines.length;
        }
        return acc;
    }, 0);

    // Better interpretation of "Vacinas em dia": Count of vaccines that are NOT expired (next_vaccination_date > today)
    const activeVaccinesCount = pets.reduce((acc: number, pet: any) => {
        if (!pet.vaccines) return acc;
        const active = pet.vaccines.filter((v: any) => {
            if (!v.next_vaccination_date) return true; // Assume valid if no expiry
            return new Date(v.next_vaccination_date) > new Date();
        });
        return acc + active.length;
    }, 0);

    const createPetMutation = useMutation({
        mutationFn: async (data: any) => {
            return await api.createPet({
                ...data,
                status: "Saudável",
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["pets"] });
            await refetch();
            toast.success("Pet cadastrado com sucesso!");
            setCreateModalOpen(false);
            setNewPetForm({
                name: "",
                species: "Cão",
                breed: "",
                age: "",
                weight: "",
                gender: "Macho",
                microchip: "",
            });
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao cadastrar pet");
        },
    });

    const deletePetMutation = useMutation({
        mutationFn: async (id: number) => {
            return await api.deletePet(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] });
            toast.success("Pet excluído com sucesso!");
            setDeleteDialogOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao excluir pet");
        },
    });

    const handleCreatePet = () => {
        if (!newPetForm.name || !newPetForm.species || !newPetForm.breed) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }
        createPetMutation.mutate(newPetForm);
    };

    const handleDeletePet = () => {
        if (selectedPet) {
            deletePetMutation.mutate(selectedPet.id);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">
                                Meus Pets
                            </h1>
                            <p className="text-xl text-vet-neutral">
                                Gerencie a saúde e histórico médico dos seus
                                companheiros
                            </p>
                        </div>

                        <Dialog
                            open={createModalOpen}
                            onOpenChange={setCreateModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="vet" size="lg">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Adicionar Pet
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Cadastrar Novo Pet
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Label htmlFor="petName">
                                            Nome do pet *
                                        </Label>
                                        <Input
                                            placeholder="Ex: Rex, Mimi..."
                                            value={newPetForm.name}
                                            onChange={(e) =>
                                                setNewPetForm({
                                                    ...newPetForm,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="species">
                                                Espécie *
                                            </Label>
                                            <select
                                                className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none"
                                                value={newPetForm.species}
                                                onChange={(e) =>
                                                    setNewPetForm({
                                                        ...newPetForm,
                                                        species: e.target.value,
                                                    })
                                                }
                                            >
                                                <option>Cão</option>
                                                <option>Gato</option>
                                                <option>Pássaro</option>
                                                <option>Coelho</option>
                                                <option>Outro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="breed">
                                                Raça *
                                            </Label>
                                            <Input
                                                placeholder="Ex: Golden Retriever"
                                                value={newPetForm.breed}
                                                onChange={(e) =>
                                                    setNewPetForm({
                                                        ...newPetForm,
                                                        breed: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="age">Idade</Label>
                                            <Input
                                                placeholder="Ex: 3 anos"
                                                value={newPetForm.age}
                                                onChange={(e) =>
                                                    setNewPetForm({
                                                        ...newPetForm,
                                                        age: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="weight">Peso</Label>
                                            <Input
                                                placeholder="Ex: 25 kg"
                                                value={newPetForm.weight}
                                                onChange={(e) =>
                                                    setNewPetForm({
                                                        ...newPetForm,
                                                        weight: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Sexo</Label>
                                        <select
                                            className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none"
                                            value={newPetForm.gender}
                                            onChange={(e) =>
                                                setNewPetForm({
                                                    ...newPetForm,
                                                    gender: e.target.value,
                                                })
                                            }
                                        >
                                            <option>Macho</option>
                                            <option>Fêmea</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="microchip">
                                            Microchip (opcional)
                                        </Label>
                                        <Input
                                            placeholder="Ex: 985141001234567"
                                            value={newPetForm.microchip}
                                            onChange={(e) =>
                                                setNewPetForm({
                                                    ...newPetForm,
                                                    microchip: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <Button
                                        variant="vet"
                                        className="w-full"
                                        onClick={handleCreatePet}
                                        disabled={createPetMutation.isPending}
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        {createPetMutation.isPending
                                            ? "Cadastrando..."
                                            : "Cadastrar Pet"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-vet-neutral">
                                Carregando pets...
                            </p>
                        </div>
                    ) : pets.length === 0 ? (
                        <Card className="p-12 text-center">
                            <p className="text-vet-neutral mb-4">
                                Você ainda não tem pets cadastrados
                            </p>
                            <Button
                                variant="vet"
                                onClick={() => setCreateModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Cadastrar Primeiro Pet
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            { }
                            <div className="lg:col-span-2 space-y-6">
                                {pets.map((pet: any) => (
                                    <Card
                                        key={pet.id}
                                        className="p-6 bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl">
                                                {pet.image}
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-foreground">
                                                            {pet.name}
                                                        </h3>
                                                        <p className="text-vet-neutral">
                                                            {pet.breed} •{" "}
                                                            {pet.age} •{" "}
                                                            {pet.weight}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                pet.status ===
                                                                    "Saudável"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={
                                                                pet.status ===
                                                                    "Saudável"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }
                                                        >
                                                            {pet.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedPet(
                                                                    pet
                                                                );
                                                                setEditModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => {
                                                                setSelectedPet(
                                                                    pet
                                                                );
                                                                setDeleteDialogOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                                                    <div className="bg-vet-primary/5 p-4 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Calendar className="h-4 w-4 text-vet-primary" />
                                                            <span className="font-semibold text-sm text-vet-primary">
                                                                Próxima Consulta
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground font-medium">
                                                            {
                                                                pet.nextAppointment
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="bg-vet-secondary/10 p-4 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Syringe className="h-4 w-4 text-vet-secondary" />
                                                            <span className="font-semibold text-sm text-vet-secondary">
                                                                Última Vacina
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground font-medium">
                                                            {pet.lastVaccine}
                                                        </p>
                                                    </div>

                                                    {pet.microchip && (
                                                        <div className="bg-vet-accent/10 p-4 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Heart className="h-4 w-4 text-vet-warm" />
                                                                <span className="font-semibold text-sm text-vet-warm">
                                                                    Microchip
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-foreground font-medium">
                                                                ••••••
                                                                {pet.microchip.slice(
                                                                    -4
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        variant="vet"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            navigate("/agendar")
                                                        }
                                                    >
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Agendar Consulta
                                                    </Button>
                                                    <Button
                                                        variant="vetOutline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            navigate(
                                                                `/vacinas?pet=${pet.id}`
                                                            )
                                                        }
                                                    >
                                                        <Syringe className="h-4 w-4 mr-2" />
                                                        Vacinas
                                                    </Button>
                                                    <Button
                                                        variant="vetOutline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            navigate(
                                                                `/historico?pet=${pet.id}`
                                                            )
                                                        }
                                                    >
                                                        <Heart className="h-4 w-4 mr-2" />
                                                        Histórico
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            { }
                            <div className="space-y-6">
                                <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                                    <h3 className="text-lg font-bold text-foreground mb-4">
                                        Resumo
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-vet-primary/5 rounded-lg">
                                            <span className="text-sm font-medium text-vet-primary">
                                                Total de Pets
                                            </span>
                                            <span className="text-xl font-bold text-vet-primary">
                                                {pets.length}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-vet-accent/10 rounded-lg">
                                            <span className="text-sm font-medium text-vet-warm">
                                                Consultas este mês
                                            </span>
                                            <span className="text-xl font-bold text-vet-warm">
                                                {appointmentsThisMonth}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-vet-secondary/10 rounded-lg">
                                            <span className="text-sm font-medium text-vet-secondary">
                                                Vacinas em dia
                                            </span>
                                            <span className="text-xl font-bold text-vet-secondary">
                                                {activeVaccinesCount}
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
                                    <h3 className="text-lg font-bold text-foreground mb-4">
                                        Próximos Lembretes
                                    </h3>

                                    <div className="space-y-3">
                                        {(() => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const nextWeek = new Date(today);
                                            nextWeek.setDate(today.getDate() + 7);

                                            const upcomingReminders = userAppointments
                                                .filter((apt: any) => {
                                                    if (apt.status === "cancelled") return false;
                                                    const aptDate = new Date(apt.appointment_date);
                                                    aptDate.setHours(0, 0, 0, 0);
                                                    return aptDate >= today && aptDate <= nextWeek;
                                                })
                                                .sort((a: any, b: any) => {
                                                    const dateA = new Date(a.appointment_date);
                                                    const dateB = new Date(b.appointment_date);
                                                    return dateA.getTime() - dateB.getTime();
                                                })
                                                .slice(0, 5);

                                            if (upcomingReminders.length === 0) {
                                                return (
                                                    <p className="text-sm text-vet-neutral text-center">
                                                        Nenhum lembrete próximo
                                                    </p>
                                                );
                                            }

                                            return upcomingReminders.map((apt: any) => {
                                                const aptDate = new Date(apt.appointment_date);
                                                const isToday = aptDate.toDateString() === today.toDateString();
                                                const isTomorrow = aptDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();

                                                let dateLabel = format(aptDate, "dd MMM", { locale: ptBR });
                                                if (isToday) {
                                                    dateLabel = "Hoje";
                                                } else if (isTomorrow) {
                                                    dateLabel = "Amanhã";
                                                }

                                                const timeLabel = format(aptDate, "HH:mm", { locale: ptBR });

                                                const statusColors: Record<string, string> = {
                                                    confirmed: "bg-green-100 text-green-800",
                                                    pending: "bg-yellow-100 text-yellow-800",
                                                    completed: "bg-blue-100 text-blue-800",
                                                };

                                                return (
                                                    <div
                                                        key={apt.id}
                                                        className="p-3 bg-white/60 rounded-lg border border-border/30 hover:bg-white/80 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="text-sm font-semibold text-foreground truncate">
                                                                        {apt.pet_name}
                                                                    </p>
                                                                    <Badge
                                                                        className={`text-xs ${statusColors[apt.status] || "bg-gray-100 text-gray-800"}`}
                                                                    >
                                                                        {apt.status === "confirmed" ? "Confirmado" : apt.status === "pending" ? "Pendente" : apt.status}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-vet-neutral truncate">
                                                                    {apt.service_name || "Consulta"}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Calendar className="h-3 w-3 text-vet-primary" />
                                                                    <p className="text-xs text-vet-neutral">
                                                                        {dateLabel} às {timeLabel}
                                                                    </p>
                                                                </div>
                                                                {apt.clinic_name && (
                                                                    <p className="text-xs text-vet-neutral truncate mt-1">
                                                                        {apt.clinic_name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => handleCancelAppointment(apt)}
                                                                disabled={cancelAppointmentMutation.isPending || apt.status === "cancelled" || apt.status === "completed"}
                                                                title="Cancelar agendamento"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedPet && (
                <>
                    <EditPetModal
                        open={editModalOpen}
                        onOpenChange={setEditModalOpen}
                        pet={selectedPet}
                    />
                    <DeletePetDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        petName={selectedPet?.name}
                        onConfirm={handleDeletePet}
                    />
                </>
            )}

            <AlertDialog open={cancelAppointmentDialogOpen} onOpenChange={setCancelAppointmentDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja cancelar o agendamento de{" "}
                            <strong>{selectedAppointment?.pet_name}</strong> para{" "}
                            <strong>
                                {selectedAppointment?.appointment_date
                                    ? format(new Date(selectedAppointment.appointment_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                                    : "data não informada"}
                            </strong>
                            ?
                            <br />
                            <br />
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={cancelAppointmentMutation.isPending}>
                            Não, manter agendamento
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmCancelAppointment}
                            disabled={cancelAppointmentMutation.isPending}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {cancelAppointmentMutation.isPending ? "Cancelando..." : "Sim, cancelar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Footer />
        </div>
    );
};

export default MyPets;
