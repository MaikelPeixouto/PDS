import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Stethoscope } from "lucide-react";

interface HistoryDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation: {
    date: string;
    vet: string;
    reason: string;
    notes: string;
    type: string;
  };
  petName: string;
}

const HistoryDetailsModal = ({ open, onOpenChange, consultation, petName }: HistoryDetailsModalProps) => {
  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "Emergência":
        return "bg-red-100 text-red-800";
      case "Vacina":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-vet-primary/10 p-3 rounded-lg">
              <Stethoscope className="h-6 w-6 text-vet-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{consultation.reason}</h3>
              <p className="text-sm text-vet-neutral">Pet: {petName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-vet-neutral">Tipo:</span>
            <Badge className={getTypeBadgeColor(consultation.type)}>
              {consultation.type}
            </Badge>
          </div>

          <div className="space-y-4 border-t border-border/30 pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-vet-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Data da Consulta</p>
                <p className="text-sm text-vet-neutral">{consultation.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-vet-secondary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Veterinário Responsável</p>
                <p className="text-sm text-vet-neutral">{consultation.vet}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-vet-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Motivo da Consulta</p>
                <p className="text-sm text-vet-neutral">{consultation.reason}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-vet-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Observações e Diagnóstico</p>
                <p className="text-sm text-vet-neutral">{consultation.notes || "Sem observações"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDetailsModal;
