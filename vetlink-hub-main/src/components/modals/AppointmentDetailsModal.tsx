import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  PawPrint
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/services/api";

interface AppointmentDetailsModalProps {
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
  };
  onEdit?: () => void;
}

const AppointmentDetailsModal = ({ open, onOpenChange, appointment, onEdit }: AppointmentDetailsModalProps) => {
  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ['appointment', appointment?.id],
    queryFn: async () => {
      if (!appointment?.id) return null;
      return await api.getAppointment(appointment.id);
    },
    enabled: !!appointment?.id && open,
  });

  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "pending": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      case "completed": return "bg-vet-primary/10 text-vet-primary border-vet-primary/20";
      case "cancelled": return "bg-vet-error/10 text-vet-error border-vet-error/20";
      default: return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "completed": return "Concluído";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const fullAppointment = appointmentData || appointment;

  const appointmentDate = fullAppointment?.appointment_date
    ? parseISO(fullAppointment.appointment_date)
    : null;

  const formattedDate = appointmentDate
    ? format(appointmentDate, "dd/MM/yyyy", { locale: ptBR })
    : appointment?.date || "N/A";

  const formattedTime = appointmentDate
    ? format(appointmentDate, "HH:mm", { locale: ptBR })
    : appointment?.time || "N/A";

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-vet-neutral">Carregando detalhes...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {}
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(fullAppointment?.status || 'pending')} text-lg px-4 py-2`}>
              {getStatusLabel(fullAppointment?.status || 'pending')}
            </Badge>
            <span className="text-sm text-vet-neutral">ID: #{fullAppointment?.id || appointment.id}</span>
          </div>

          <Separator />

          {}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-vet-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-vet-primary" />
              </div>
              <div>
                <p className="text-sm text-vet-neutral">Data</p>
                <p className="font-semibold text-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-vet-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-vet-primary" />
              </div>
              <div>
                <p className="text-sm text-vet-neutral">Horário</p>
                <p className="font-semibold text-foreground">{formattedTime}</p>
              </div>
            </div>
          </div>

          <Separator />

          {}
          <div>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-vet-primary" />
              Informações do Cliente
            </h3>
            <div className="space-y-2 ml-7">
              <p>
                <span className="text-vet-neutral">Nome:</span>{' '}
                <span className="font-medium">
                  {fullAppointment?.user_first_name && fullAppointment?.user_last_name
                    ? `${fullAppointment.user_first_name} ${fullAppointment.user_last_name}`
                    : fullAppointment?.owner || 'N/A'}
                </span>
              </p>
              {fullAppointment?.user_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-vet-neutral" />
                  <span className="font-medium">{fullAppointment.user_phone}</span>
                </div>
              )}
              {fullAppointment?.user_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-vet-neutral" />
                  <span className="font-medium">{fullAppointment.user_email}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {}
          <div>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-vet-primary" />
              Informações do Pet
            </h3>
            <div className="space-y-2 ml-7">
              <p>
                <span className="text-vet-neutral">Nome:</span>{' '}
                <span className="font-medium">{fullAppointment?.pet_name || fullAppointment?.pet || 'N/A'}</span>
              </p>
              {fullAppointment?.pet_species && (
                <p>
                  <span className="text-vet-neutral">Tipo:</span>{' '}
                  <span className="font-medium">{fullAppointment.pet_species}</span>
                </p>
              )}
              {fullAppointment?.pet_age && (
                <p>
                  <span className="text-vet-neutral">Idade:</span>{' '}
                  <span className="font-medium">{fullAppointment.pet_age}</span>
                </p>
              )}
            </div>
          </div>

          <Separator />

          {}
          <div>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-vet-primary" />
              Informações do Serviço
            </h3>
            <div className="space-y-2 ml-7">
              <p>
                <span className="text-vet-neutral">Serviço:</span>{' '}
                <span className="font-medium">{fullAppointment?.service_name || fullAppointment?.service || 'N/A'}</span>
              </p>
              {fullAppointment?.veterinarian_name && (
                <p>
                  <span className="text-vet-neutral">Veterinário:</span>{' '}
                  <span className="font-medium">{fullAppointment.veterinarian_name}</span>
                </p>
              )}
              {fullAppointment?.service_price !== null && fullAppointment?.service_price !== undefined && (
                <p>
                  <span className="text-vet-neutral">Valor:</span>{' '}
                  <span className="font-semibold text-vet-primary text-lg">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(fullAppointment.service_price))}
                  </span>
                </p>
              )}
            </div>
          </div>

          {}
          {fullAppointment?.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-bold text-foreground mb-2">Observações</h3>
                <p className="text-vet-neutral bg-vet-primary/5 p-3 rounded-lg">
                  {fullAppointment.notes}
                </p>
              </div>
            </>
          )}

          {}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            {onEdit && (
              <Button variant="vet" onClick={onEdit}>
                Editar Agendamento
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;
