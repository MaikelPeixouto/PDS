import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, FileText } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import HistoryDetailsModal from "@/components/modals/HistoryDetailsModal";

const PetHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("pet") || "1";
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  const petData = {
    "1": {
      name: "Zeus",
      breed: "Golden Retriever",
      image: "🐕",
      consultations: [
        { 
          date: "20 Dez 2023", 
          vet: "Dra. Ana Silva", 
          reason: "Check-up", 
          notes: "Animal saudável, sem alterações. Peso adequado para idade e raça.",
          type: "Consulta"
        },
        { 
          date: "15 Set 2023", 
          vet: "Dr. Carlos Santos", 
          reason: "Vacinação", 
          notes: "Aplicação da vacina V10. Animal apresentou boa reação.",
          type: "Vacina"
        },
        { 
          date: "10 Jul 2023", 
          vet: "Dra. Mariana Oliveira", 
          reason: "Emergência", 
          notes: "Ingestão de alimento inadequado. Tratamento realizado com sucesso.",
          type: "Emergência"
        }
      ]
    },
    "2": {
      name: "Luna",
      breed: "Gato Persa",
      image: "🐱",
      consultations: [
        { 
          date: "05 Jan 2024", 
          vet: "Dra. Mariana Oliveira", 
          reason: "Vacinação", 
          notes: "Aplicação V4 felina. Animal em bom estado geral.",
          type: "Vacina"
        },
        { 
          date: "18 Nov 2023", 
          vet: "Dra. Ana Silva", 
          reason: "Consulta", 
          notes: "Tratamento para conjuntivite. Medicação prescrita por 7 dias.",
          type: "Consulta"
        }
      ]
    }
  };

  const pet = petData[petId as keyof typeof petData] || petData["1"];

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "Emergência":
        return "bg-red-100 text-red-800";
      case "Vacina":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

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
                Histórico de {pet.name}
              </h1>
              <p className="text-xl text-vet-neutral">
                {pet.breed}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-vet-neutral">
              {pet.consultations.length} consultas registradas
            </p>
          </div>

          <div className="space-y-4">
            {pet.consultations.map((consultation, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-vet-primary/10 p-3 rounded-lg">
                      <FileText className="h-5 w-5 text-vet-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{consultation.reason}</h3>
                      <Badge className={getTypeBadgeColor(consultation.type)}>
                        {consultation.type}
                      </Badge>
                    </div>
                  </div>
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
            ))}
          </div>
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

      <Footer />
    </div>
  );
};

export default PetHistory;
