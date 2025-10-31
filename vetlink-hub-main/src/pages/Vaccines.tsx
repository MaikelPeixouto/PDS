import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Syringe, Calendar, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ScheduleVaccineModal from "@/components/modals/ScheduleVaccineModal";
import VaccineDetailsModal from "@/components/modals/VaccineDetailsModal";

const Vaccines = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("pet") || "1";
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);

  const petData = {
    "1": {
      name: "Zeus",
      breed: "Golden Retriever",
      image: "🐕",
      vaccines: [
        { name: "V10", date: "12 Dez 2023", next: "12 Dez 2024", status: "Em dia", vet: "Dra. Ana Silva" },
        { name: "Antirrábica", date: "15 Nov 2023", next: "15 Nov 2024", status: "Em dia", vet: "Dr. Carlos Santos" },
        { name: "Gripe Canina", date: "10 Out 2023", next: "10 Out 2024", status: "Vencida", vet: "Dra. Mariana Oliveira" }
      ]
    },
    "2": {
      name: "Luna",
      breed: "Gato Persa",
      image: "🐱",
      vaccines: [
        { name: "V4 Felina", date: "05 Jan 2024", next: "05 Jan 2025", status: "Em dia", vet: "Dra. Mariana Oliveira" },
        { name: "Antirrábica", date: "20 Dez 2023", next: "20 Dez 2024", status: "Em dia", vet: "Dra. Ana Silva" },
        { name: "FeLV", date: "10 Nov 2023", next: "10 Nov 2024", status: "Vencida", vet: "Dra. Ana Silva" }
      ]
    }
  };

  const pet = petData[petId as keyof typeof petData] || petData["1"];

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
            <div className="text-5xl">{pet.image}</div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-1">
                Vacinas de {pet.name}
              </h1>
              <p className="text-xl text-vet-neutral">
                {pet.breed}
              </p>
            </div>
          </div>

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

          <div className="space-y-4">
            {pet.vaccines.map((vaccine, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-md transition-all">
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
                        
                        <div>
                          <p className="text-sm text-vet-neutral mb-1">Próxima dose</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-vet-secondary" />
                            <p className="text-sm font-medium text-foreground">{vaccine.next}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-vet-neutral mb-1">Veterinário</p>
                          <p className="text-sm font-medium text-foreground">{vaccine.vet}</p>
                        </div>
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
        </div>
      </div>

      <ScheduleVaccineModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        petName={pet.name}
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
