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

interface AppointmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    id: number;
    time: string;
    pet: string;
    owner: string;
    service: string;
    status: string;
  };
}

const AppointmentDetailsModal = ({ open, onOpenChange, appointment }: AppointmentDetailsModalProps) => {
  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-vet-success/10 text-vet-success border-vet-success/20";
      case "pending": return "bg-vet-warning/10 text-vet-warning border-vet-warning/20";
      default: return "bg-vet-neutral/10 text-vet-neutral border-vet-neutral/20";
    }
  };

  // Mock de dados completos do agendamento
  const fullAppointment = {
    ...appointment,
    date: "25/01/2025",
    phone: "(11) 99999-1111",
    email: "joao@email.com",
    petType: "Cachorro",
    petAge: "3 anos",
    veterinarian: "Dra. Maria Oliveira",
    notes: "Pet apresenta tosse há 3 dias. Precisa verificar possível bronquite."
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(fullAppointment.status)} text-lg px-4 py-2`}>
              {fullAppointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
            </Badge>
            <span className="text-sm text-vet-neutral">ID: #{fullAppointment.id}</span>
          </div>

          <Separator />

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-vet-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-vet-primary" />
              </div>
              <div>
                <p className="text-sm text-vet-neutral">Data</p>
                <p className="font-semibold text-foreground">{fullAppointment.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-vet-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-vet-primary" />
              </div>
              <div>
                <p className="text-sm text-vet-neutral">Horário</p>
                <p className="font-semibold text-foreground">{fullAppointment.time}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Client Info */}
          <div>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-vet-primary" />
              Informações do Cliente
            </h3>
            <div className="space-y-2 ml-7">
              <p><span className="text-vet-neutral">Nome:</span> <span className="font-medium">{fullAppointment.owner}</span></p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-vet-neutral" />
                <span className="font-medium">{fullAppointment.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-vet-neutral" />
                <span className="font-medium">{fullAppointment.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pet Info */}
          <div>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-vet-primary" />
              Informações do Pet
            </h3>
            <div className="space-y-2 ml-7">
              <p><span className="text-vet-neutral">Nome:</span> <span className="font-medium">{fullAppointment.pet}</span></p>
              <p><span className="text-vet-neutral">Tipo:</span> <span className="font-medium">{fullAppointment.petType}</span></p>
              <p><span className="text-vet-neutral">Idade:</span> <span className="font-medium">{fullAppointment.petAge}</span></p>
            </div>
          </div>

          <Separator />

          {/* Service Info */}
          <div>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-vet-primary" />
              Informações do Serviço
            </h3>
            <div className="space-y-2 ml-7">
              <p><span className="text-vet-neutral">Serviço:</span> <span className="font-medium">{fullAppointment.service}</span></p>
              <p><span className="text-vet-neutral">Veterinário:</span> <span className="font-medium">{fullAppointment.veterinarian}</span></p>
            </div>
          </div>

          {/* Notes */}
          {fullAppointment.notes && (
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

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="vet">
              Editar Agendamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;
