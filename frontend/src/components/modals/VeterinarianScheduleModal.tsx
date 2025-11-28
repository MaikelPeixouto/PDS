import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock } from "lucide-react";

interface VeterinarianScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  veterinarian: {
    id: number;
    name: string;
    specialty: string;
  } | null;
}

export function VeterinarianScheduleModal({
  open,
  onOpenChange,
  veterinarian,
}: VeterinarianScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const appointments = [
    {
      id: 1,
      time: "09:00",
      petName: "Rex",
      ownerName: "João Silva",
      type: "Consulta de Rotina",
      status: "confirmado",
    },
    {
      id: 2,
      time: "10:30",
      petName: "Mimi",
      ownerName: "Maria Santos",
      type: "Vacinação",
      status: "confirmado",
    },
    {
      id: 3,
      time: "14:00",
      petName: "Thor",
      ownerName: "Pedro Costa",
      type: "Cirurgia",
      status: "em_andamento",
    },
    {
      id: 4,
      time: "16:00",
      petName: "Luna",
      ownerName: "Ana Lima",
      type: "Retorno",
      status: "aguardando",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-500";
      case "em_andamento":
        return "bg-blue-500";
      case "aguardando":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "em_andamento":
        return "Em Andamento";
      case "aguardando":
        return "Aguardando";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Agenda - {veterinarian?.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {veterinarian?.specialty}
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Selecione a Data</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">
              Agendamentos - {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : ""}
            </h3>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{appointment.time}</span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.petName}</p>
                    <p className="text-sm text-muted-foreground">
                      Tutor: {appointment.ownerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.type}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
