import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
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
import { MapPin, Star, Clock, Phone, Mail, Calendar as CalendarIcon, Check, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import clinic1 from "@/assets/clinic-1.jpg";
import api from "@/services/api";

const ClinicDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: clinic, isLoading: isLoadingClinic, error: clinicError } = useQuery({
    queryKey: ['clinic', id],
    queryFn: async () => {
      if (!id) return null;
      const clinicData = await api.getClinic(id);
      return clinicData;
    },
    enabled: !!id,
  });

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.getServices(),
  });

  const { data: veterinarians = [], isLoading: isLoadingVeterinarians } = useQuery({
    queryKey: ['veterinarians', id],
    queryFn: () => api.getVeterinarians(id),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const [selectedPet, setSelectedPet] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const { data: availableSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['availableSlots', id, selectedDate, selectedVet],
    queryFn: async () => {
      if (!id || !selectedDate) return [];
      const dateStr = selectedDate.toISOString().split('T')[0];
      const slots = await api.getAvailableTimeSlots(id, dateStr, selectedVet || undefined);
      return slots || [];
    },
    enabled: !!id && !!selectedDate,
  });

  const { data: pets = [] } = useQuery({
    queryKey: ["pets"],
    queryFn: () => api.getPets(),
  });

  const { data: reviews = [], isLoading: isLoadingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) return [];
      const reviewsData = await api.getClinicReviews(id, 50, 0);
      return reviewsData || [];
    },
    enabled: !!id,
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
    enabled: !!user,
  });

  const completedAppointments = userAppointments.filter(
    (apt: any) => apt.clinic_id === id && apt.status === 'completed'
  );

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<string>("");

  useEffect(() => {
    if (completedAppointments.length > 0 && !selectedAppointmentForReview) {
      setSelectedAppointmentForReview(completedAppointments[0].id);
    }
  }, [completedAppointments, selectedAppointmentForReview]);

  const { data: existingReview } = useQuery({
    queryKey: ['userReview', id, user?.id, selectedAppointmentForReview],
    queryFn: async () => {
      if (!id || !user || !selectedAppointmentForReview) return null;
      try {
        const review = await api.getUserReview(id, selectedAppointmentForReview);
        return review;
      } catch (error) {
        return null;
      }
    },
    enabled: !!id && !!user && !!selectedAppointmentForReview && completedAppointments.length > 0,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.createAppointment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["clinicAppointments"] });
      toast.success("Agendamento criado com sucesso!");
      navigate("/meus-pets");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar agendamento");
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { clinicId: string; appointmentId: string; rating: number; comment: string }) => {
      return await api.createReview(data.clinicId, data.appointmentId, data.rating, data.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['userReview', id] });
      queryClient.invalidateQueries({ queryKey: ['clinic', id] });
      toast.success("Avaliação enviada com sucesso!");
      setReviewRating(0);
      setReviewComment("");
      setSelectedAppointmentForReview("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao enviar avaliação");
    },
  });

  const formattedServices = services.map((service: any) => ({
    id: service.id,
    name: service.name,
    price: service.price ? `R$ ${parseFloat(service.price).toFixed(2).replace('.', ',')}` : "Preço não informado",
    duration: service.duration_minutes ? `${service.duration_minutes}min` : "Duração não informada",
    description: service.description || ""
  }));

  const formattedVeterinarians = veterinarians.map((vet: any) => ({
    id: vet.id,
    name: `${vet.first_name} ${vet.last_name}`,
    crmv: vet.crmv,
    specialty: vet.specialty,
    avatar: ""
  }));

  const specialties = clinic?.specialties ? (Array.isArray(clinic.specialties) ? clinic.specialties : []) : [];

  const handleBooking = () => {
    if (!selectedPet || !selectedService || !selectedDate || !selectedTime || !id) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const dateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    createAppointmentMutation.mutate({
      petId: selectedPet,
      clinicId: id,
      serviceId: selectedService,
      appointmentDate: dateTime.toISOString(),
      veterinarianId: selectedVet || undefined,
      notes: notes || undefined,
    });
  };

  const handleSubmitReview = () => {
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Por favor, escreva um comentário");
      return;
    }
    if (!id) {
      toast.error("Erro: ID da clínica não encontrado");
      return;
    }

    const appointmentId = selectedAppointmentForReview || (completedAppointments.length > 0 ? completedAppointments[0].id : "");

    if (!appointmentId) {
      toast.error("Erro: Nenhuma consulta encontrada");
      return;
    }

    createReviewMutation.mutate({
      clinicId: id,
      appointmentId: appointmentId,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
  };

  if (isLoadingClinic) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-vet-primary" />
          <p className="text-vet-neutral">Carregando informações da clínica...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (clinicError || !clinic) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Clínica não encontrada</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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

        <Card className="overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <img
                src={clinic.photo_url || clinic1}
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
                      <span className="font-semibold text-lg">{clinic.rating || 0}</span>
                      <span className="text-muted-foreground">({clinic.total_reviews || 0} avaliações)</span>
                    </div>
                    <Badge variant={clinic.is_open ? "default" : "destructive"}>
                      {clinic.is_open ? "Aberto" : "Fechado"}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{clinic.description || "Clínica veterinária especializada em cuidados para pets."}</p>

              <div className="space-y-2">
                {clinic.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-vet-primary" />
                    <span>{clinic.address}</span>
                  </div>
                )}
                {clinic.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-vet-primary" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
                {clinic.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-vet-primary" />
                    <span>{clinic.email}</span>
                  </div>
                )}
                {clinic.hours && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-vet-primary" />
                    <span>{clinic.hours}</span>
                  </div>
                )}
              </div>

              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-vet-primary/10 text-vet-primary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Tabs defaultValue="booking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="booking">Agendar</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Agendar Consulta</h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pet">Selecione seu pet *</Label>
                      <Select value={selectedPet} onValueChange={setSelectedPet}>
                        <SelectTrigger id="pet">
                          <SelectValue placeholder="Escolha um pet" />
                        </SelectTrigger>
                        <SelectContent>
                          {pets.length === 0 ? (
                            <SelectItem value="none" disabled>Nenhum pet cadastrado</SelectItem>
                          ) : (
                            pets.map((pet: any) => (
                              <SelectItem key={pet.id} value={pet.id.toString()}>
                                {pet.name} {pet.breed ? `(${pet.breed})` : ''}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Serviço *</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingServices ? (
                            <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>
                          ) : formattedServices.length === 0 ? (
                            <SelectItem value="none" disabled>Nenhum serviço disponível</SelectItem>
                          ) : (
                            formattedServices.map((service: any) => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {service.name} - {service.price} ({service.duration})
                              </SelectItem>
                            ))
                          )}
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
                          {isLoadingVeterinarians ? (
                            <SelectItem value="loading" disabled>Carregando veterinários...</SelectItem>
                          ) : formattedVeterinarians.length === 0 ? (
                            <SelectItem value="none" disabled>Nenhum veterinário disponível</SelectItem>
                          ) : (
                            formattedVeterinarians.map((vet: any) => (
                              <SelectItem key={vet.id} value={vet.id.toString()}>
                                {vet.name} - {vet.specialty}
                              </SelectItem>
                            ))
                          )}
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
                      {isLoadingSlots ? (
                        <div className="text-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto text-vet-primary" />
                          <p className="text-sm text-vet-neutral mt-2">Carregando horários disponíveis...</p>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-sm text-vet-neutral">Nenhum horário disponível para esta data</p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {availableSlots.map((slot: string) => (
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
                      )}
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
                      disabled={createAppointmentMutation.isPending}
                    >
                      {createAppointmentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Agendando...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Confirmar Agendamento
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {clinic.photo_url && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Foto da Clínica</h3>
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={clinic.photo_url}
                        alt={clinic.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </Card>
                )}

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

          <TabsContent value="services">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Serviços Oferecidos</h2>
              {isLoadingServices ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-vet-primary mb-2" />
                  <p className="text-vet-neutral">Carregando serviços...</p>
                </div>
              ) : formattedServices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-vet-neutral">Nenhum serviço disponível</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {formattedServices.map((service: any) => (
                    <Card key={service.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-vet-primary font-bold">{service.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Duração: {service.duration}</p>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Nossa Equipe</h2>
              {isLoadingVeterinarians ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-vet-primary mb-2" />
                  <p className="text-vet-neutral">Carregando equipe...</p>
                </div>
              ) : formattedVeterinarians.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-vet-neutral">Nenhum veterinário cadastrado</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formattedVeterinarians.map((vet: any) => (
                    <Card key={vet.id} className="p-6 text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={vet.avatar} />
                        <AvatarFallback className="text-2xl bg-vet-primary text-white">
                          {vet.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg mb-1">{vet.name}</h3>
                      <p className="text-sm text-vet-primary mb-1">{vet.specialty}</p>
                      <p className="text-xs text-muted-foreground">CRMV: {vet.crmv}</p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

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
                            star <= Math.round(clinic.rating || 0)
                              ? "fill-vet-accent text-vet-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold">{clinic.rating ? parseFloat(clinic.rating).toFixed(1) : "0.0"}</span>
                    <span className="text-muted-foreground">({clinic.total_reviews || 0} avaliações)</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {user && completedAppointments.length > 0 && !existingReview && (
                <Card className="p-6 mb-6 bg-vet-primary/5">
                  <h3 className="text-xl font-bold mb-4">Deixe sua avaliação</h3>
                  <div className="space-y-4">
                    {completedAppointments.length > 1 && (
                      <div className="space-y-2">
                        <Label>Selecione a consulta que deseja avaliar *</Label>
                        <Select value={selectedAppointmentForReview} onValueChange={setSelectedAppointmentForReview}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma consulta" />
                          </SelectTrigger>
                          <SelectContent>
                            {completedAppointments.map((apt: any) => (
                              <SelectItem key={apt.id} value={apt.id}>
                                {apt.pet_name} - {format(new Date(apt.appointment_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Nota *</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors ${
                                star <= reviewRating
                                  ? "fill-vet-accent text-vet-accent cursor-pointer"
                                  : "text-muted-foreground cursor-pointer hover:text-vet-accent/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {reviewRating > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {reviewRating === 1 && "Péssimo"}
                          {reviewRating === 2 && "Ruim"}
                          {reviewRating === 3 && "Regular"}
                          {reviewRating === 4 && "Bom"}
                          {reviewRating === 5 && "Excelente"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review-comment">Comentário *</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Compartilhe sua experiência com esta clínica..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button
                      variant="vet"
                      onClick={handleSubmitReview}
                      disabled={createReviewMutation.isPending || !reviewRating || !reviewComment.trim()}
                      className="w-full"
                    >
                      {createReviewMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Avaliação"
                      )}
                    </Button>
                  </div>
                </Card>
              )}

              {isLoadingReviews ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-vet-primary mb-2" />
                  <p className="text-vet-neutral">Carregando avaliações...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-vet-neutral">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback className="bg-vet-primary text-white">
                            {review.first_name?.[0] || 'U'}{review.last_name?.[0] || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">
                              {review.first_name} {review.last_name?.charAt(0) || ''}.
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(review.created_at), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                            </span>
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
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicDetails;
