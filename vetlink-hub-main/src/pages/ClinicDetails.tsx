import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Star, Clock, Phone, Mail, Calendar as CalendarIcon, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";

// Mock data - in a real app, this would come from an API
const clinicData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Clínica Veterinária PetCare",
    rating: 4.8,
    reviews: 234,
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    phone: "(11) 3456-7890",
    email: "contato@petcare.com.br",
    openUntil: "18h",
    isOpen: true,
    specialties: ["Cães", "Gatos", "Emergências", "Cirurgias"],
    description: "Clínica veterinária especializada em atendimento de pequenos animais com mais de 15 anos de experiência. Nossa equipe é formada por profissionais altamente qualificados e dedicados ao bem-estar do seu pet.",
    services: [
      { id: 1, name: "Consulta Veterinária", duration: "30min", price: "R$ 150,00" },
      { id: 2, name: "Vacinação", duration: "15min", price: "R$ 80,00" },
      { id: 3, name: "Check-up Completo", duration: "45min", price: "R$ 250,00" },
      { id: 4, name: "Cirurgia de Castração", duration: "2h", price: "R$ 600,00" },
    ],
    veterinarians: [
      { id: 1, name: "Dra. Ana Silva", crmv: "12345", specialty: "Clínica Geral", avatar: "" },
      { id: 2, name: "Dr. Carlos Santos", crmv: "23456", specialty: "Cirurgião", avatar: "" },
      { id: 3, name: "Dra. Maria Oliveira", crmv: "34567", specialty: "Dermatologia", avatar: "" },
    ],
    images: [clinic1, clinic2, clinic3],
    reviews_list: [
      { id: 1, author: "João Silva", rating: 5, date: "2024-01-15", comment: "Excelente atendimento! A equipe é muito atenciosa e o ambiente é limpo e organizado.", avatar: "" },
      { id: 2, author: "Maria Santos", rating: 5, date: "2024-01-10", comment: "Minha cachorrinha foi muito bem tratada. Recomendo!", avatar: "" },
      { id: 3, author: "Pedro Costa", rating: 4, date: "2024-01-05", comment: "Ótima clínica, apenas o tempo de espera foi um pouco longo.", avatar: "" },
    ],
  },
  "2": {
    id: "2",
    name: "VetCenter 24h",
    rating: 4.9,
    reviews: 456,
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    phone: "(11) 2345-6789",
    email: "contato@vetcenter.com.br",
    openUntil: "24h",
    isOpen: true,
    specialties: ["Emergências 24h", "UTI", "Internação", "Diagnóstico por Imagem"],
    description: "Centro veterinário de referência com atendimento 24 horas. Equipamentos de última geração e equipe especializada em emergências e cuidados intensivos.",
    services: [
      { id: 1, name: "Consulta de Emergência", duration: "30min", price: "R$ 200,00" },
      { id: 2, name: "Raio-X", duration: "30min", price: "R$ 180,00" },
      { id: 3, name: "Ultrassom", duration: "45min", price: "R$ 280,00" },
      { id: 4, name: "Internação (diária)", duration: "24h", price: "R$ 350,00" },
    ],
    veterinarians: [
      { id: 1, name: "Dr. Roberto Lima", crmv: "45678", specialty: "Emergências", avatar: "" },
      { id: 2, name: "Dra. Paula Mendes", crmv: "56789", specialty: "Diagnóstico", avatar: "" },
    ],
    images: [clinic2, clinic1, clinic3],
    reviews_list: [
      { id: 1, author: "Ana Paula", rating: 5, date: "2024-01-18", comment: "Salvaram a vida do meu cachorro! Atendimento excepcional.", avatar: "" },
      { id: 2, author: "Carlos Eduardo", rating: 5, date: "2024-01-12", comment: "Equipe extremamente competente e atenciosa.", avatar: "" },
    ],
  },
  "3": {
    id: "3",
    name: "Hospital Veterinário Pet Plus",
    rating: 4.7,
    reviews: 189,
    address: "Rua dos Veterinários, 456 - Jardins, São Paulo - SP",
    phone: "(11) 4567-8901",
    email: "contato@petplus.com.br",
    openUntil: "20h",
    isOpen: true,
    specialties: ["Ortopedia", "Cardiologia", "Oncologia", "Fisioterapia"],
    description: "Hospital veterinário completo com especialidades médicas avançadas. Referência em tratamentos complexos e cirurgias especializadas.",
    services: [
      { id: 1, name: "Consulta Especializada", duration: "45min", price: "R$ 280,00" },
      { id: 2, name: "Ecocardiograma", duration: "30min", price: "R$ 350,00" },
      { id: 3, name: "Fisioterapia (sessão)", duration: "40min", price: "R$ 120,00" },
      { id: 4, name: "Cirurgia Ortopédica", duration: "3h", price: "R$ 1.500,00" },
    ],
    veterinarians: [
      { id: 1, name: "Dr. Fernando Costa", crmv: "67890", specialty: "Ortopedia", avatar: "" },
      { id: 2, name: "Dra. Juliana Rocha", crmv: "78901", specialty: "Cardiologia", avatar: "" },
    ],
    images: [clinic3, clinic2, clinic1],
    reviews_list: [
      { id: 1, author: "Fernanda Lima", rating: 5, date: "2024-01-20", comment: "Excelentes especialistas! Tratamento de primeira.", avatar: "" },
      { id: 2, author: "Ricardo Alves", rating: 4, date: "2024-01-14", comment: "Muito bom, apenas os preços são um pouco elevados.", avatar: "" },
    ],
  },
};

const availableSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const ClinicDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clinic = clinicData[id || "1"];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  if (!clinic) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Clínica não encontrada</h1>
          <Button onClick={() => navigate("/agendar")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para agendamento
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Agendamento realizado com sucesso!");
    setTimeout(() => navigate("/meus-pets"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Hero Section */}
        <Card className="overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <img
                src={clinic.images[0]}
                alt={clinic.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{clinic.name}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-vet-accent text-vet-accent" />
                      <span className="font-semibold text-lg">{clinic.rating}</span>
                      <span className="text-muted-foreground">({clinic.reviews} avaliações)</span>
                    </div>
                    <Badge variant={clinic.isOpen ? "default" : "destructive"}>
                      {clinic.isOpen ? "Aberto" : "Fechado"}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{clinic.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-vet-primary" />
                  <span>{clinic.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-vet-primary" />
                  <span>{clinic.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-vet-primary" />
                  <span>{clinic.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-vet-primary" />
                  <span>{clinic.isOpen ? `Aberto até ${clinic.openUntil}` : `Abre amanhã`}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {clinic.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-vet-primary/10 text-vet-primary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="booking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="booking">Agendar</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Agendar Consulta</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Serviço *</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinic.services.map((service: any) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - {service.price} ({service.duration})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vet">Veterinário (Opcional)</Label>
                      <Select value={selectedVet} onValueChange={setSelectedVet}>
                        <SelectTrigger id="vet">
                          <SelectValue placeholder="Selecione o veterinário" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinic.veterinarians.map((vet: any) => (
                            <SelectItem key={vet.id} value={vet.id.toString()}>
                              {vet.name} - {vet.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Data *</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Horário Disponível *</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "vet" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(slot)}
                            className="w-full"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        placeholder="Descreva os sintomas ou motivo da consulta..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button
                      variant="vet"
                      size="lg"
                      className="w-full"
                      onClick={handleBooking}
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Confirmar Agendamento
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Galeria de Fotos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {clinic.images.map((img: string, index: number) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${clinic.name} - ${index + 1}`}
                        className="rounded-lg w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-vet-primary/5">
                  <h3 className="font-semibold mb-3">Dicas para a Consulta</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Chegue 10 minutos antes do horário</li>
                    <li>• Traga a carteira de vacinação</li>
                    <li>• Mantenha seu pet em jejum se solicitado</li>
                    <li>• Liste todos os sintomas observados</li>
                  </ul>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Serviços Oferecidos</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {clinic.services.map((service: any) => (
                  <Card key={service.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <span className="text-vet-primary font-bold">{service.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Duração: {service.duration}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Nossa Equipe</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinic.veterinarians.map((vet: any) => (
                  <Card key={vet.id} className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={vet.avatar} />
                      <AvatarFallback className="text-2xl bg-vet-primary text-white">
                        {vet.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mb-1">{vet.name}</h3>
                    <p className="text-sm text-vet-primary mb-1">{vet.specialty}</p>
                    <p className="text-xs text-muted-foreground">CRMV: {vet.crmv}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Avaliações</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(clinic.rating)
                              ? "fill-vet-accent text-vet-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold">{clinic.rating}</span>
                    <span className="text-muted-foreground">({clinic.reviews} avaliações)</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                {clinic.reviews_list.map((review: any) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback className="bg-vet-primary text-white">
                          {review.author.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.author}</h4>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-vet-accent text-vet-accent"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicDetails;
