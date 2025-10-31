import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Weight, Calendar, Syringe, FileText, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const MedicalRecord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("pet") || "1";

  const petData = {
    "1": {
      name: "Zeus",
      breed: "Golden Retriever",
      age: "3 anos",
      weight: "32 kg",
      gender: "Macho",
      microchip: "985141001234567",
      image: "🐕",
      status: "Saudável",
      vaccines: [
        { name: "V10", date: "12 Dez 2023", next: "12 Dez 2024", status: "Em dia" },
        { name: "Antirrábica", date: "15 Nov 2023", next: "15 Nov 2024", status: "Em dia" }
      ],
      consultations: [
        { date: "20 Dez 2023", vet: "Dra. Ana Silva", reason: "Check-up", notes: "Animal saudável, sem alterações" }
      ],
      medications: [
        { name: "Vermífugo", dosage: "1 comprimido", frequency: "A cada 3 meses", lastDate: "15 Out 2023" }
      ],
      allergies: ["Nenhuma alergia conhecida"],
      conditions: []
    },
    "2": {
      name: "Luna",
      breed: "Gato Persa",
      age: "2 anos",
      weight: "4.2 kg",
      gender: "Fêmea",
      microchip: "985141001234568",
      image: "🐱",
      status: "Acompanhamento",
      vaccines: [
        { name: "V4 Felina", date: "05 Jan 2024", next: "05 Jan 2025", status: "Em dia" }
      ],
      consultations: [
        { date: "18 Nov 2023", vet: "Dra. Ana Silva", reason: "Consulta", notes: "Tratamento para conjuntivite" }
      ],
      medications: [
        { name: "Colírio", dosage: "2 gotas", frequency: "3x ao dia", lastDate: "18 Nov 2023" }
      ],
      allergies: [],
      conditions: ["Conjuntivite crônica"]
    }
  };

  const pet = petData[petId as keyof typeof petData] || petData["1"];

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

          {/* Header do Prontuário */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
            <div className="flex items-start gap-6">
              <div className="text-6xl">{pet.image}</div>
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
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-xs text-vet-neutral mb-1">Microchip</p>
                    <p className="text-sm font-semibold text-foreground">••••••{pet.microchip.slice(-4)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Abas do Prontuário */}
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
                {pet.conditions.length > 0 ? (
                  <div className="space-y-2">
                    {pet.conditions.map((condition, index) => (
                      <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-sm text-foreground">{condition}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-vet-neutral">Nenhuma condição de saúde registrada</p>
                )}
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Alergias
                </h3>
                {pet.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {pet.allergies.map((allergy, index) => (
                      <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-foreground">{allergy}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-vet-neutral">Nenhuma alergia registrada</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="vacinas" className="space-y-4">
              {pet.vaccines.map((vaccine, index) => (
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
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
                    <Badge className={vaccine.status === "Em dia" ? "bg-green-100 text-green-800" : ""}>
                      {vaccine.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="consultas" className="space-y-4">
              {pet.consultations.map((consultation, index) => (
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
              ))}
            </TabsContent>

            <TabsContent value="medicamentos" className="space-y-4">
              {pet.medications.map((medication, index) => (
                <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">{medication.name}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-vet-neutral">Dosagem: <span className="text-foreground font-medium">{medication.dosage}</span></p>
                        <p className="text-vet-neutral">Frequência: <span className="text-foreground font-medium">{medication.frequency}</span></p>
                        <p className="text-vet-neutral">Última aplicação: <span className="text-foreground font-medium">{medication.lastDate}</span></p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MedicalRecord;
