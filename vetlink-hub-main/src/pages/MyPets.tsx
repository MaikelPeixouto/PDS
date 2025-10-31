import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, PawPrint, Calendar, Syringe, Heart, FileText, Camera, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditPetModal from "@/components/modals/EditPetModal";
import DeletePetDialog from "@/components/modals/DeletePetDialog";

const MyPets = () => {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  
  const pets = [
    {
      id: 1,
      name: "Zeus",
      breed: "Golden Retriever",
      age: "3 anos",
      weight: "32 kg",
      gender: "Macho",
      microchip: "985141001234567",
      image: "🐕",
      nextAppointment: "15 Jan, 15:30",
      lastVaccine: "12 Dez 2023",
      status: "Saudável",
      vaccines: [
        { name: "V10", date: "12 Dez 2023", next: "12 Dez 2024" },
        { name: "Antirrábica", date: "15 Nov 2023", next: "15 Nov 2024" },
        { name: "Gripe Canina", date: "10 Out 2023", next: "10 Out 2024" }
      ],
      consultations: [
        { date: "20 Dez 2023", vet: "Dra. Ana Silva", reason: "Check-up", notes: "Animal saudável, sem alterações" },
        { date: "15 Set 2023", vet: "Dr. Carlos Santos", reason: "Vacinação", notes: "Aplicação da vacina V10" }
      ]
    },
    {
      id: 2,
      name: "Luna",
      breed: "Gato Persa",
      age: "2 anos",
      weight: "4.2 kg",
      gender: "Fêmea",
      microchip: "985141001234568",
      image: "🐱",
      nextAppointment: "22 Jan, 10:00",
      lastVaccine: "05 Jan 2024",
      status: "Acompanhamento",
      vaccines: [
        { name: "V4 Felina", date: "05 Jan 2024", next: "05 Jan 2025" },
        { name: "Antirrábica", date: "20 Dez 2023", next: "20 Dez 2024" },
        { name: "FeLV", date: "10 Nov 2023", next: "10 Nov 2024" }
      ],
      consultations: [
        { date: "05 Jan 2024", vet: "Dra. Mariana Oliveira", reason: "Vacinação", notes: "Aplicação V4 felina" },
        { date: "18 Nov 2023", vet: "Dra. Ana Silva", reason: "Consulta", notes: "Tratamento para conjuntivite" }
      ]
    }
  ];

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
                Gerencie a saúde e histórico médico dos seus companheiros
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="vet" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Pet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Pet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="petName">Nome do pet</Label>
                    <Input placeholder="Ex: Rex, Mimi..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="species">Espécie</Label>
                      <select className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none">
                        <option>Cão</option>
                        <option>Gato</option>
                        <option>Pássaro</option>
                        <option>Coelho</option>
                        <option>Outro</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="breed">Raça</Label>
                      <Input placeholder="Ex: Golden Retriever" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Idade</Label>
                      <Input placeholder="Ex: 3 anos" />
                    </div>
                    <div>
                      <Label htmlFor="weight">Peso</Label>
                      <Input placeholder="Ex: 25 kg" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gender">Sexo</Label>
                    <select className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none">
                      <option>Macho</option>
                      <option>Fêmea</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="microchip">Microchip (opcional)</Label>
                    <Input placeholder="Ex: 985141001234567" />
                  </div>
                  <Button variant="vet" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Cadastrar Pet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Pets */}
            <div className="lg:col-span-2 space-y-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="p-6 bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-6">
                    <div className="text-6xl">{pet.image}</div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{pet.name}</h3>
                          <p className="text-vet-neutral">{pet.breed} • {pet.age} • {pet.weight}</p>
                          <Badge 
                            variant={pet.status === "Saudável" ? "default" : "secondary"} 
                            className={pet.status === "Saudável" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {pet.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedPet(pet);
                              setEditModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedPet(pet);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="vetOutline" size="sm" onClick={() => navigate(`/prontuario?pet=${pet.id}`)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Prontuário
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                        <div className="bg-vet-primary/5 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-vet-primary" />
                            <span className="font-semibold text-sm text-vet-primary">Próxima Consulta</span>
                          </div>
                          <p className="text-sm text-foreground font-medium">{pet.nextAppointment}</p>
                        </div>
                        
                        <div className="bg-vet-secondary/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Syringe className="h-4 w-4 text-vet-secondary" />
                            <span className="font-semibold text-sm text-vet-secondary">Última Vacina</span>
                          </div>
                          <p className="text-sm text-foreground font-medium">{pet.lastVaccine}</p>
                        </div>
                        
                        <div className="bg-vet-accent/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-vet-warm" />
                            <span className="font-semibold text-sm text-vet-warm">Microchip</span>
                          </div>
                          <p className="text-sm text-foreground font-medium">••••••{pet.microchip.slice(-4)}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button variant="vet" size="sm" className="flex-1" onClick={() => navigate("/agendar")}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar Consulta
                        </Button>
                        <Button variant="vetOutline" size="sm" className="flex-1" onClick={() => navigate(`/vacinas?pet=${pet.id}`)}>
                          <Syringe className="h-4 w-4 mr-2" />
                          Vacinas
                        </Button>
                        <Button variant="vetOutline" size="sm" className="flex-1" onClick={() => navigate(`/historico?pet=${pet.id}`)}>
                          <Heart className="h-4 w-4 mr-2" />
                          Histórico
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar com resumo */}
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-bold text-foreground mb-4">Resumo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-vet-primary/5 rounded-lg">
                    <span className="text-sm font-medium text-vet-primary">Total de Pets</span>
                    <span className="text-xl font-bold text-vet-primary">{pets.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-vet-accent/10 rounded-lg">
                    <span className="text-sm font-medium text-vet-warm">Consultas este mês</span>
                    <span className="text-xl font-bold text-vet-warm">3</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-vet-secondary/10 rounded-lg">
                    <span className="text-sm font-medium text-vet-secondary">Vacinas em dia</span>
                    <span className="text-xl font-bold text-vet-secondary">2</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
                <h3 className="text-lg font-bold text-foreground mb-4">Próximos Lembretes</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <Calendar className="h-4 w-4 text-vet-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Consulta Zeus</p>
                      <p className="text-xs text-vet-neutral">15 Jan, 15:30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <Syringe className="h-4 w-4 text-vet-secondary mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Vacina Luna</p>
                      <p className="text-xs text-vet-neutral">20 Dez, 2024</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
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
            petName={selectedPet.name}
            onConfirm={() => {
              console.log("Excluindo pet:", selectedPet.name);
              setDeleteDialogOpen(false);
            }}
          />
        </>
      )}

      <Footer />
    </div>
  );
};

export default MyPets;