import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Star, User, Phone } from "lucide-react";
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";

const Schedule = () => {
  const availableSlots = [
    { time: "09:00", available: true },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: false },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: false },
  ];

  const clinics = [
    {
      id: 1,
      name: "Clínica Veterinária PetCare",
      rating: 4.9,
      distance: "1.2 km",
      image: clinic1,
      specialties: ["Clínica Geral", "Cirurgia", "Emergência 24h"]
    },
    {
      id: 2,
      name: "Hospital Veterinário AnimalCare",
      rating: 4.8,
      distance: "2.1 km",
      image: clinic2,
      specialties: ["Cardiologia", "Dermatologia", "Oftalmologia"]
    },
    {
      id: 3,
      name: "Centro Veterinário Vida Animal",
      rating: 4.7,
      distance: "3.5 km",
      image: clinic3,
      specialties: ["Oncologia", "Neurologia", "Fisioterapia"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Agendar Consulta
            </h1>
            <p className="text-xl text-vet-neutral">
              Escolha a clínica, data e horário ideais para seu pet
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário de agendamento */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-6">Dados do Agendamento</h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pet">Selecione seu pet</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um pet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zeus">Zeus (Golden Retriever)</SelectItem>
                          <SelectItem value="luna">Luna (Gato Persa)</SelectItem>
                          <SelectItem value="max">Max (Labrador)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="service">Tipo de serviço</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulta">Consulta Geral</SelectItem>
                          <SelectItem value="vacina">Vacinação</SelectItem>
                          <SelectItem value="cirurgia">Cirurgia</SelectItem>
                          <SelectItem value="emergencia">Emergência</SelectItem>
                          <SelectItem value="checkup">Check-up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="clinic">Clínica veterinária</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha uma clínica" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((clinic) => (
                          <SelectItem key={clinic.id} value={clinic.id.toString()}>
                            {clinic.name} - {clinic.distance}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data da consulta</Label>
                      <Input type="date" className="focus:border-vet-primary" />
                    </div>
                    
                    <div>
                      <Label htmlFor="veterinarian">Veterinário (opcional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Qualquer veterinário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-silva">Dr. Ana Silva</SelectItem>
                          <SelectItem value="dr-santos">Dr. Carlos Santos</SelectItem>
                          <SelectItem value="dra-oliveira">Dra. Mariana Oliveira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 border border-border rounded-md focus:border-vet-primary focus:outline-none resize-none"
                      placeholder="Descreva os sintomas ou motivo da consulta..."
                    />
                  </div>
                </div>
              </Card>

              {/* Horários disponíveis */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-vet-primary" />
                  Horários Disponíveis
                </h3>
                
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={slot.available ? "vetOutline" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      className={`${slot.available ? 'hover:bg-vet-primary hover:text-white' : 'opacity-50 cursor-not-allowed'}`}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </Card>

              <Button variant="vet" size="lg" className="w-full">
                <Calendar className="h-5 w-5 mr-2" />
                Confirmar Agendamento
              </Button>
            </div>

            {/* Sidebar com informações */}
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-bold text-foreground mb-4">Clínicas Recomendadas</h3>
                
                <div className="space-y-4">
                  {clinics.slice(0, 2).map((clinic) => (
                    <div key={clinic.id} className="border border-border/30 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-3">
                        <img 
                          src={clinic.image} 
                          alt={clinic.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm line-clamp-2">{clinic.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-3 w-3 fill-vet-accent text-vet-accent" />
                            <span className="text-xs text-vet-neutral">{clinic.rating}</span>
                            <span className="text-xs text-vet-neutral">•</span>
                            <span className="text-xs text-vet-neutral">{clinic.distance}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {clinic.specialties.slice(0, 2).map((specialty, i) => (
                              <span key={i} className="text-xs bg-vet-primary/10 text-vet-primary px-2 py-1 rounded-full">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
                <h3 className="text-lg font-bold text-foreground mb-4">Dicas para a Consulta</h3>
                
                <ul className="space-y-3 text-sm text-vet-neutral">
                  <li className="flex items-start gap-2">
                    <User className="h-4 w-4 text-vet-primary mt-0.5 flex-shrink-0" />
                    <span>Chegue 15 minutos antes do horário agendado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-vet-primary mt-0.5 flex-shrink-0" />
                    <span>Tenha em mãos o cartão de vacinação do seu pet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-vet-primary mt-0.5 flex-shrink-0" />
                    <span>Verifique o endereço e disponibilidade de estacionamento</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Schedule;