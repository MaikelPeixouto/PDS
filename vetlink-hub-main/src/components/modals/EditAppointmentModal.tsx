import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import api from "@/services/api";

interface EditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    id: string;
    time?: string;
    pet?: string;
    owner?: string;
    service?: string;
    status?: string;
    appointment_date?: string;
    veterinarian_id?: string;
    service_id?: string;
    notes?: string;
  };
}

const EditAppointmentModal = ({ open, onOpenChange, appointment }: EditAppointmentModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    veterinarian: "",
    time: "",
    status: "",
    paymentMethod: "none",
    notes: ""
  });

  const { data: appointmentData, isLoading: appointmentLoading } = useQuery({
    queryKey: ['appointment', appointment?.id],
    queryFn: async () => {
      if (!appointment?.id) return null;
      return await api.getAppointment(appointment.id);
    },
    enabled: !!appointment?.id && open,
  });

  const { data: servicesData = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      return await api.getServices();
    },
    enabled: open,
  });

  const { data: veterinariansData = [], isLoading: veterinariansLoading } = useQuery({
    queryKey: ['veterinarians', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await api.getVeterinarians(user.id);
    },
    enabled: !!user?.id && open,
  });

  const veterinarians = Array.isArray(veterinariansData)
    ? veterinariansData.filter((vet: any) => vet && vet.id && String(vet.id).trim() !== '')
    : [];

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!appointment?.id) throw new Error('Appointment ID is required');
      return await api.updateAppointment(appointment.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', appointment?.id] });
      queryClient.invalidateQueries({ queryKey: ['clinicAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['userAppointments'] });
      toast.success("Agendamento atualizado com sucesso!");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar agendamento");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!appointment?.id) throw new Error('Appointment ID is required');
      return await api.deleteAppointment(appointment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['userAppointments'] });
      toast.success("Agendamento cancelado com sucesso!");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao cancelar agendamento");
    },
  });

  useEffect(() => {
    if (appointmentData) {
      const aptDate = appointmentData.appointment_date ? parseISO(appointmentData.appointment_date) : null;
      setDate(aptDate || undefined);
      setFormData({
        veterinarian: appointmentData.veterinarian_id || "none",
        time: aptDate ? format(aptDate, "HH:mm") : "",
        status: appointmentData.status || "pending",
        paymentMethod: appointmentData.payment_method || "none",
        notes: appointmentData.notes || ""
      });
    } else if (appointment) {
      const aptDate = appointment.appointment_date ? parseISO(appointment.appointment_date) : null;
      setDate(aptDate || undefined);
      setFormData({
        veterinarian: appointment.veterinarian_id || "none",
        time: appointment.time || (aptDate ? format(aptDate, "HH:mm") : ""),
        status: appointment.status || "pending",
        paymentMethod: appointment.payment_method || "none",
        notes: appointment.notes || ""
      });
    }
  }, [appointmentData, appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment?.id) return;

    const appointmentDateTime = date && formData.time
      ? new Date(`${format(date, "yyyy-MM-dd")}T${formData.time}`)
      : appointmentData?.appointment_date
      ? new Date(appointmentData.appointment_date)
      : null;

    if (!appointmentDateTime) {
      toast.error("Data e horário são obrigatórios");
      return;
    }

    updateMutation.mutate({
      veterinarianId: formData.veterinarian && formData.veterinarian !== "none" ? formData.veterinarian : undefined,
      appointmentDate: appointmentDateTime.toISOString(),
      status: formData.status,
      paymentMethod: formData.paymentMethod && formData.paymentMethod !== "none" ? formData.paymentMethod : undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      deleteMutation.mutate();
    }
  };

  if (!appointment) return null;

  if (appointmentLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-vet-neutral">Carregando dados do agendamento...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentAppointment = appointmentData || appointment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {}
          <div className="bg-vet-primary/5 p-4 rounded-lg space-y-2">
            <p className="text-sm text-vet-neutral">
              <span className="font-semibold">Cliente:</span> {currentAppointment?.user_first_name && currentAppointment?.user_last_name
                ? `${currentAppointment.user_first_name} ${currentAppointment.user_last_name}`
                : currentAppointment?.owner || 'N/A'}
            </p>
            <p className="text-sm text-vet-neutral">
              <span className="font-semibold">Pet:</span> {currentAppointment?.pet_name || currentAppointment?.pet || 'N/A'}
            </p>
            <p className="text-sm text-vet-neutral">
              <span className="font-semibold">Serviço:</span> {currentAppointment?.service_name || currentAppointment?.service || 'N/A'}
            </p>
            {currentAppointment?.service_price !== null && currentAppointment?.service_price !== undefined && (
              <p className="text-sm text-vet-neutral">
                <span className="font-semibold">Valor:</span>{' '}
                <span className="font-semibold text-vet-primary text-base">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(Number(currentAppointment.service_price))}
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data do Agendamento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Horário *</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="veterinarian">Veterinário (opcional)</Label>
            <Select value={formData.veterinarian || "none"} onValueChange={(value) => setFormData({ ...formData, veterinarian: value === "none" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um veterinário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum veterinário</SelectItem>
                {veterinariansLoading ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : veterinarians.length === 0 ? (
                  <SelectItem value="no-vet" disabled>Nenhum veterinário cadastrado</SelectItem>
                ) : (
                  veterinarians.map((vet: any) => {
                    const vetId = String(vet.id || '').trim();
                    if (!vetId) return null;
                    return (
                      <SelectItem key={vet.id} value={vetId}>
                        {vet.first_name || ''} {vet.last_name || ''} - {vet.specialty || 'Sem especialidade'}
                      </SelectItem>
                    );
                  }).filter(Boolean)
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Cancelando..." : "Cancelar Agendamento"}
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Descartar
              </Button>
              <Button type="submit" variant="vet" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;
