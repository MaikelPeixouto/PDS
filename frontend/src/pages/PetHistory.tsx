import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, FileText, X, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import HistoryDetailsModal from "@/components/modals/HistoryDetailsModal";
import api from "@/services/api";
import { toast } from "sonner";
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

const PetHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("pet");
  const queryClient = useQueryClient();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);

  const { data: pet, isLoading: isLoadingPet, error: petError } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => api.getPet(petId!),
    enabled: !!petId,
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['userAppointments'],
    queryFn: async () => {
      try {
        const apps = await api.getAppointments();
        return apps || [];
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
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao cancelar agendamento");
    },
  });

  const handleCancelClick = (appointment: any) => {
    setAppointmentToCancel(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (appointmentToCancel?.id) {
      cancelAppointmentMutation.mutate(appointmentToCancel.id);
    }
  };

  const consultations = appointments
    .filter((apt: any) => apt.pet_id === petId)
    .sort((a: any, b: any) => {
      const dateA = new Date(a.appointment_date);
      const dateB = new Date(b.appointment_date);
      return dateB.getTime() - dateA.getTime();
    })
    .map((apt: any) => {
      let type = "Consulta";
      const serviceName = (apt.service_name || "").toLowerCase();
      if (serviceName.includes("vacina") || serviceName.includes("vacinação")) {
        type = "Vacina";
      } else if (serviceName.includes("emergência") || serviceName.includes("emergencia")) {
        type = "Emergência";
      }

      return {
        id: apt.id,
        date: format(new Date(apt.appointment_date), "dd MMM yyyy 'às' HH:mm", { locale: ptBR }),
        rawDate: new Date(apt.appointment_date),
        vet: apt.veterinarian_name || "N/A",
        reason: apt.service_name || "Consulta",
        notes: apt.notes || "Sem observações",
        type,
        status: apt.status,
        appointment: apt,
      };
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Concluído</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const petImage = pet?.species === "Gato" ? "🐱" : pet?.species === "Cão" ? "🐕" : "🐾";

  if (!petId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-vet-neutral mb-4">Pet não especificado</p>
            <Button variant="vet" onClick={() => navigate("/meus-pets")}>
              Voltar para Meus Pets
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoadingPet) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-vet-neutral">Carregando informações do pet...</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (petError || !pet) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-vet-neutral mb-4">Erro ao carregar informações do pet</p>
            <Button variant="vet" onClick={() => navigate("/meus-pets")}>
              Voltar para Meus Pets
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/meus-pets")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Meus Pets
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">{petImage}</div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-1">
                Histórico de {pet.name}
              </h1>
              <p className="text-xl text-vet-neutral">
                {pet.breed}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-vet-neutral">
              {consultations.length} registros encontrados
            </p>
          </div>

          {isLoadingAppointments ? (
            <Card className="p-6 text-center">
              <p className="text-vet-neutral">Carregando histórico...</p>
            </Card>
          ) : consultations.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-vet-neutral">Nenhuma consulta registrada</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation: any) => {
                const isFuture = new Date(consultation.rawDate) > new Date();
                const canCancel = (consultation.status === 'pending' || consultation.status === 'confirmed') && isFuture;

                return (
                  <Card key={consultation.id} className="p-6 bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-vet-primary/10 p-3 rounded-lg">
                          <FileText className="h-5 w-5 text-vet-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground">{consultation.reason}</h3>
                            {getStatusBadge(consultation.status)}
                          </div>
                          <p className="text-sm text-vet-neutral mt-1">{consultation.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {canCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelClick(consultation)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        )}
                        <Button
                          variant="vetOutline"
                          size="sm"
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setDetailsModalOpen(true);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-vet-primary" />
                        <div>
                          <p className="text-xs text-vet-neutral">Data</p>
                          <p className="text-sm font-medium text-foreground">{consultation.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-vet-secondary" />
                        <div>
                          <p className="text-xs text-vet-neutral">Veterinário</p>
                          <p className="text-sm font-medium text-foreground">{consultation.vet}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <p className="text-xs text-vet-neutral mb-2">Observações</p>
                      <p className="text-sm text-foreground">{consultation.notes}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedConsultation && (
        <HistoryDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          consultation={selectedConsultation}
          petName={pet.name}
        />
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o agendamento de <strong>{pet.name}</strong>?
              <br /><br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelAppointmentMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
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

export default PetHistory;
