import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Star, User, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const Schedule = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedPet, setSelectedPet] = useState<string>("");
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedClinic, setSelectedClinic] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedVeterinarian, setSelectedVeterinarian] =
        useState<string>("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<string>("none");
    const [notes, setNotes] = useState<string>("");

    const { data: pets = [] } = useQuery({
        queryKey: ["pets"],
        queryFn: () => api.getPets(),
    });

    const { data: clinicsData = [] } = useQuery({
        queryKey: ["clinics"],
        queryFn: () => api.getClinics({ limit: 20 }),
    });

    const clinics = Array.isArray(clinicsData)
        ? clinicsData
        : clinicsData?.data || [];

    const { data: services = [] } = useQuery({
        queryKey: ["services", selectedClinic],
        queryFn: () => selectedClinic ? api.getPublicClinicServices(selectedClinic) : Promise.resolve([]),
        enabled: !!selectedClinic,
    });

    const { data: veterinarians = [] } = useQuery({
        queryKey: ["veterinarians", selectedClinic],
        queryFn: () => api.getVeterinarians(selectedClinic || undefined),
        enabled: !!selectedClinic,
    });

    const {
        data: availableSlots = [],
        isLoading: slotsLoading,
        error: slotsError,
    } = useQuery({
        queryKey: [
            "timeSlots",
            selectedClinic,
            selectedDate,
            selectedVeterinarian,
        ],
        queryFn: async () => {
            if (!selectedClinic || !selectedDate) return [];
            try {
                const isoDate = new Date(
                    selectedDate + "T00:00:00"
                ).toISOString();
                const slots = await api.getAvailableTimeSlots(
                    selectedClinic,
                    isoDate,
                    selectedVeterinarian && selectedVeterinarian !== "any"
                        ? selectedVeterinarian
                        : undefined
                );
                return slots.map((time: string) => ({ time, available: true }));
            } catch (error) {
                console.error("Error fetching time slots:", error);
                toast.error("Erro ao carregar horários disponíveis");
                return [];
            }
        },
        enabled: !!selectedClinic && !!selectedDate,
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

    const handleSubmit = () => {
        if (
            !selectedPet ||
            !selectedService ||
            !selectedClinic ||
            !selectedDate ||
            !selectedTime
        ) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);

        console.log("Creating appointment with:", {
            petId: selectedPet,
            clinicId: selectedClinic,
            serviceId: selectedService,
            appointmentDate: appointmentDateTime.toISOString(),
            veterinarianId:
                selectedVeterinarian && selectedVeterinarian !== "any"
                    ? selectedVeterinarian
                    : undefined,
        });

        createAppointmentMutation.mutate({
            petId: selectedPet,
            clinicId: selectedClinic,
            serviceId: selectedService,
            appointmentDate: appointmentDateTime.toISOString(),
            veterinarianId:
                selectedVeterinarian && selectedVeterinarian !== "any"
                    ? selectedVeterinarian
                    : undefined,
            paymentMethod:
                selectedPaymentMethod && selectedPaymentMethod !== "none"
                    ? selectedPaymentMethod
                    : undefined,
            notes: notes || undefined,
        });
    };

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
                            Escolha a clínica, data e horário ideais para seu
                            pet
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        { }
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                                <h2 className="text-2xl font-bold text-foreground mb-6">
                                    Dados do Agendamento
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="pet">
                                            Selecione seu pet *
                                        </Label>
                                        <Select
                                            value={selectedPet}
                                            onValueChange={setSelectedPet}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Escolha um pet" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pets.map((pet: any) => (
                                                    <SelectItem
                                                        key={pet.id}
                                                        value={pet.id.toString()}
                                                    >
                                                        {pet.name} (
                                                        {pet.breed})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="clinic">
                                            Clínica veterinária *
                                        </Label>
                                        <Select
                                            value={selectedClinic}
                                            onValueChange={(value) => {
                                                setSelectedClinic(value);
                                                setSelectedVeterinarian("");
                                                setSelectedService("");
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Escolha uma clínica" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clinics.map((clinic: any) => (
                                                    <SelectItem
                                                        key={clinic.id}
                                                        value={clinic.id.toString()}
                                                    >
                                                        {clinic.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="service">
                                                Tipo de serviço *
                                            </Label>
                                            <Select
                                                value={selectedService}
                                                onValueChange={
                                                    setSelectedService
                                                }
                                                disabled={!selectedClinic}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={selectedClinic ? "Escolha o serviço" : "Selecione uma clínica primeiro"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {services.map(
                                                        (service: any) => (
                                                            <SelectItem
                                                                key={service.id}
                                                                value={service.id.toString()}
                                                            >
                                                                {service.name}{" "}
                                                                {service.price
                                                                    ? `- R$ ${Number(service.price).toFixed(
                                                                        2
                                                                    )}`
                                                                    : ""}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="veterinarian">
                                                Veterinário (opcional)
                                            </Label>
                                            <Select
                                                value={selectedVeterinarian}
                                                onValueChange={
                                                    setSelectedVeterinarian
                                                }
                                                disabled={!selectedClinic}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Qualquer veterinário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">
                                                        Qualquer veterinário
                                                    </SelectItem>
                                                    {veterinarians.map(
                                                        (vet: any) => (
                                                            <SelectItem
                                                                key={vet.id}
                                                                value={vet.id.toString()}
                                                            >
                                                                {vet.first_name}{" "}
                                                                {vet.last_name}{" "}
                                                                -{" "}
                                                                {vet.specialty}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="date">
                                            Data da consulta *
                                        </Label>
                                        <Input
                                            type="date"
                                            className="focus:border-vet-primary"
                                            value={selectedDate}
                                            onChange={(e) => {
                                                setSelectedDate(
                                                    e.target.value
                                                );
                                                setSelectedTime("");
                                            }}
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">
                                            Observações (opcional)
                                        </Label>
                                        <Textarea
                                            className="w-full min-h-[100px]"
                                            placeholder="Descreva os sintomas ou motivo da consulta..."
                                            value={notes}
                                            onChange={(e) =>
                                                setNotes(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </Card>

                            { }
                            {selectedDate && selectedClinic && (
                                <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-vet-primary" />
                                        Horários Disponíveis
                                    </h3>

                                    {slotsLoading ? (
                                        <p className="text-vet-neutral">
                                            Carregando horários disponíveis...
                                        </p>
                                    ) : slotsError ? (
                                        <p className="text-vet-error">
                                            Erro ao carregar horários. Tente
                                            novamente.
                                        </p>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {availableSlots.map((slot: any) => (
                                                <Button
                                                    key={slot.time}
                                                    variant={
                                                        selectedTime ===
                                                            slot.time
                                                            ? "vet"
                                                            : slot.available
                                                                ? "vetOutline"
                                                                : "outline"
                                                    }
                                                    size="sm"
                                                    disabled={!slot.available}
                                                    onClick={() =>
                                                        slot.available &&
                                                        setSelectedTime(
                                                            slot.time
                                                        )
                                                    }
                                                    className={`${slot.available
                                                        ? "hover:bg-vet-primary hover:text-white"
                                                        : "opacity-50 cursor-not-allowed"
                                                        }`}
                                                >
                                                    {slot.time}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-vet-neutral">
                                            Nenhum horário disponível para esta
                                            data.
                                        </p>
                                    )}
                                </Card>
                            )}

                            <Button
                                variant="vet"
                                size="lg"
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={
                                    createAppointmentMutation.isPending ||
                                    !selectedPet ||
                                    !selectedService ||
                                    !selectedClinic ||
                                    !selectedDate ||
                                    !selectedTime
                                }
                            >
                                <Calendar className="h-5 w-5 mr-2" />
                                {createAppointmentMutation.isPending
                                    ? "Agendando..."
                                    : "Confirmar Agendamento"}
                            </Button>
                        </div>

                        { }
                        <div className="space-y-6">
                            <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                                <h3 className="text-lg font-bold text-foreground mb-4">
                                    Clínicas Disponíveis
                                </h3>

                                <div className="space-y-4">
                                    {clinics.length > 0 ? (
                                        clinics
                                            .slice(0, 3)
                                            .map((clinic: any) => (
                                                <div
                                                    key={clinic.id}
                                                    className="border border-border/30 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                                    onClick={() =>
                                                        setSelectedClinic(
                                                            clinic.id.toString()
                                                        )
                                                    }
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-16 h-16 rounded-lg bg-vet-primary/10 flex items-center justify-center">
                                                            <span className="text-2xl">
                                                                🏥
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-foreground text-sm line-clamp-2">
                                                                {clinic.name}
                                                            </h4>
                                                            {clinic.rating && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Star className="h-3 w-3 fill-vet-accent text-vet-accent" />
                                                                    <span className="text-xs text-vet-neutral">
                                                                        {
                                                                            clinic.rating
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {clinic.specialties &&
                                                                Array.isArray(
                                                                    clinic.specialties
                                                                ) &&
                                                                clinic
                                                                    .specialties
                                                                    .length >
                                                                0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {clinic.specialties
                                                                            .slice(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    specialty: string,
                                                                                    i: number
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        className="text-xs bg-vet-primary/10 text-vet-primary px-2 py-1 rounded-full"
                                                                                    >
                                                                                        {
                                                                                            specialty
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-vet-neutral text-sm">
                                            Nenhuma clínica disponível
                                        </p>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
                                <h3 className="text-lg font-bold text-foreground mb-4">
                                    Dicas para a Consulta
                                </h3>

                                <ul className="space-y-3 text-sm text-vet-neutral">
                                    <li className="flex items-start gap-2">
                                        <User className="h-4 w-4 text-vet-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Chegue 15 minutos antes do horário
                                            agendado
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-vet-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Tenha em mãos o cartão de vacinação
                                            do seu pet
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-vet-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            Verifique o endereço e
                                            disponibilidade de estacionamento
                                        </span>
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
