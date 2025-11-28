import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Syringe, Calendar, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import ScheduleVaccineModal from "@/components/modals/ScheduleVaccineModal";
import VaccineDetailsModal from "@/components/modals/VaccineDetailsModal";
import api from "@/services/api";

const Vaccines = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("pet");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);

  const { data: pet } = useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => {
      if (!petId) return null;
      const petData = await api.getPet(petId);
      return petData || null;
    },
    enabled: !!petId,
  });

  const { data: vaccines = [], isLoading, refetch } = useQuery({
    queryKey: ['vaccines', petId],
    queryFn: async () => {
      const vaccinesData = await api.getVaccines(petId!);
      console.log('Vaccines fetched:', vaccinesData);
      return vaccinesData;
    },
    enabled: !!petId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const formattedVaccines = vaccines.map((vaccine: any) => {
    const vaccinationDate = vaccine.vaccination_date ? parseISO(vaccine.vaccination_date) : null;
    const nextDate = vaccine.next_vaccination_date ? parseISO(vaccine.next_vaccination_date) : null;
    const today = new Date();

    let status = "Em dia";
    if (nextDate && isBefore(nextDate, today)) {
      status = "Vencida";
    } else if (nextDate && isAfter(nextDate, today)) {
      status = "Em dia";
    }

    return {
      ...vaccine,
      date: vaccinationDate ? format(vaccinationDate, "dd MMM yyyy", { locale: ptBR }) : "N/A",
      next: nextDate ? format(nextDate, "dd MMM yyyy", { locale: ptBR }) : "Não agendada",
      status,
    };
  });

  const hasExpiredVaccines = formattedVaccines.some((v: any) => v.status === "Vencida");

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

  if (!pet) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-vet-neutral mb-4">Carregando informações do pet...</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const petImage = pet.species === "Gato" ? "🐱" : pet.species === "Cão" ? "🐕" : "🐾";

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
                Vacinas de {pet.name}
              </h1>
              <p className="text-xl text-vet-neutral">
                {pet.breed}
              </p>
            </div>
          </div>

          {hasExpiredVaccines && (
            <Card className="p-6 mb-6 bg-gradient-to-r from-vet-secondary/10 to-vet-accent/10 border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-vet-warm" />
                  <div>
                    <p className="font-semibold text-foreground">Atenção!</p>
                    <p className="text-sm text-vet-neutral">Algumas vacinas precisam ser renovadas</p>
                  </div>
                </div>
                <Button variant="vet" onClick={() => setScheduleModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Vacina
                </Button>
              </div>
            </Card>
          )}

          {!hasExpiredVaccines && (
            <Card className="p-6 mb-6 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-green-600">✓</div>
                  <div>
                    <p className="font-semibold text-foreground">Tudo em dia!</p>
                    <p className="text-sm text-vet-neutral">Todas as vacinas estão atualizadas</p>
                  </div>
                </div>
                <Button variant="vet" onClick={() => setScheduleModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Nova Vacina
                </Button>
              </div>
            </Card>
          )}

          {isLoading ? (
            <Card className="p-6 text-center">
              <p className="text-vet-neutral">Carregando vacinas...</p>
            </Card>
          ) : formattedVaccines.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-vet-neutral mb-4">Nenhuma vacina cadastrada para este pet</p>
              <Button variant="vet" onClick={() => setScheduleModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Vacina
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {formattedVaccines.map((vaccine: any, index: number) => (
                <Card key={vaccine.id || index} className="p-6 bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-vet-secondary/10 p-3 rounded-lg">
                        <Syringe className="h-6 w-6 text-vet-secondary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{vaccine.name}</h3>
                          <Badge
                            variant={vaccine.status === "Em dia" ? "default" : "destructive"}
                            className={vaccine.status === "Em dia" ? "bg-green-100 text-green-800" : ""}
                          >
                            {vaccine.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-vet-neutral mb-1">Última aplicação</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-vet-primary" />
                              <p className="text-sm font-medium text-foreground">{vaccine.date}</p>
                            </div>
                          </div>

                          {vaccine.next_vaccination_date && (
                            <div>
                              <p className="text-sm text-vet-neutral mb-1">Próxima dose</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-vet-secondary" />
                                <p className="text-sm font-medium text-foreground">{vaccine.next}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="vetOutline"
                      size="sm"
                      onClick={() => {
                        setSelectedVaccine(vaccine);
                        setDetailsModalOpen(true);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ScheduleVaccineModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        petName={pet.name}
        petId={petId || ''}
        onSuccess={async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          await queryClient.invalidateQueries({ queryKey: ['vaccines', petId] });
          await queryClient.invalidateQueries({ queryKey: ['vaccines'] });
          await refetch();
          await queryClient.refetchQueries({ queryKey: ['vaccines', petId] });
        }}
      />

      {selectedVaccine && (
        <VaccineDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          vaccine={selectedVaccine}
          petName={pet.name}
        />
      )}

      <Footer />
    </div>
  );
};

export default Vaccines;
