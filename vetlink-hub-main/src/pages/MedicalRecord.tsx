import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Weight, Calendar, Syringe, FileText, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, isBefore, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import api from "@/services/api";

const MedicalRecord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("pet");

  const { data: pet, isLoading: isLoadingPet, error: petError } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => api.getPet(petId!),
    enabled: !!petId,
  });

  const { data: vaccines = [], isLoading: isLoadingVaccines, refetch: refetchVaccines } = useQuery({
    queryKey: ['vaccines', petId],
    queryFn: async () => {
      const vaccinesData = await api.getVaccines(petId!);
      console.log('MedicalRecord - Vaccines fetched:', vaccinesData);
      return vaccinesData;
    },
    enabled: !!petId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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

  const consultations = appointments
    .filter((apt: any) => {
      if (apt.pet_id !== petId) return false;
      const aptDate = new Date(apt.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      aptDate.setHours(0, 0, 0, 0);
      return apt.status === "completed" || aptDate < today;
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.appointment_date);
      const dateB = new Date(b.appointment_date);
      return dateB.getTime() - dateA.getTime();
    })
    .map((apt: any) => ({
      date: format(new Date(apt.appointment_date), "dd MMM yyyy", { locale: ptBR }),
      vet: apt.veterinarian_name || "N/A",
      reason: apt.service_name || "Consulta",
      notes: apt.notes || "Sem observações",
    }));

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
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/meus-pets")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Meus Pets
          </Button>

          {}
          <Card className="p-6 mb-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
            <div className="flex items-start gap-6">
              <div className="text-6xl">{petImage}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Prontuário - {pet.name}
                    </h1>
                    <p className="text-lg text-vet-neutral mb-2">{pet.breed}</p>
                    <Badge
                      variant={pet.status === "Saudável" ? "default" : "secondary"}
                      className={pet.status === "Saudável" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {pet.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-xs text-vet-neutral mb-1">Idade</p>
                    <p className="text-sm font-semibold text-foreground">{pet.age}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-xs text-vet-neutral mb-1">Peso</p>
                    <div className="flex items-center gap-1">
                      <Weight className="h-3 w-3 text-vet-primary" />
                      <p className="text-sm font-semibold text-foreground">{pet.weight}</p>
                    </div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-xs text-vet-neutral mb-1">Sexo</p>
                    <p className="text-sm font-semibold text-foreground">{pet.gender}</p>
                  </div>
                  {pet.microchip && (
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-xs text-vet-neutral mb-1">Microchip</p>
                      <p className="text-sm font-semibold text-foreground">••••••{pet.microchip.slice(-4)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {}
          <Tabs defaultValue="geral" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="vacinas">Vacinas</TabsTrigger>
              <TabsTrigger value="consultas">Consultas</TabsTrigger>
              <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-vet-warm" />
                  Condições de Saúde
                </h3>
                <p className="text-vet-neutral">Nenhuma condição de saúde registrada</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Alergias
                </h3>
                <p className="text-vet-neutral">Nenhuma alergia registrada</p>
              </Card>
            </TabsContent>

            <TabsContent value="vacinas" className="space-y-4">
              {isLoadingVaccines ? (
                <Card className="p-6 text-center">
                  <p className="text-vet-neutral">Carregando vacinas...</p>
                </Card>
              ) : formattedVaccines.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-vet-neutral">Nenhuma vacina cadastrada</p>
                </Card>
              ) : (
                formattedVaccines.map((vaccine: any) => (
                  <Card key={vaccine.id} className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-vet-secondary/10 p-3 rounded-lg">
                          <Syringe className="h-5 w-5 text-vet-secondary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-1">{vaccine.name}</h4>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-vet-neutral">Aplicada em: {vaccine.date}</span>
                            <span className="text-vet-neutral">Próxima: {vaccine.next}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={vaccine.status === "Em dia" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {vaccine.status}
                      </Badge>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="consultas" className="space-y-4">
              {isLoadingAppointments ? (
                <Card className="p-6 text-center">
                  <p className="text-vet-neutral">Carregando consultas...</p>
                </Card>
              ) : consultations.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-vet-neutral">Nenhuma consulta registrada</p>
                </Card>
              ) : (
                consultations.map((consultation: any, index: number) => (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-vet-primary/10 p-3 rounded-lg">
                        <FileText className="h-5 w-5 text-vet-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-foreground mb-1">{consultation.reason}</h4>
                        <div className="flex items-center gap-4 text-sm text-vet-neutral">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {consultation.date}
                          </span>
                          <span>{consultation.vet}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-vet-neutral mb-1">Observações</p>
                      <p className="text-sm text-foreground">{consultation.notes}</p>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="medicamentos" className="space-y-4">
              <Card className="p-6 text-center">
                <p className="text-vet-neutral">Nenhum medicamento registrado</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MedicalRecord;
