import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Syringe, FileText } from "lucide-react";

interface VaccineDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaccine: {
    name: string;
    date: string;
    next: string;
    status: string;
    vet: string;
  };
  petName: string;
}

const VaccineDetailsModal = ({ open, onOpenChange, vaccine, petName }: VaccineDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da Vacina</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-vet-secondary/10 p-3 rounded-lg">
              <Syringe className="h-6 w-6 text-vet-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{vaccine.name}</h3>
              <p className="text-sm text-vet-neutral">Pet: {petName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-vet-neutral">Status:</span>
            <Badge 
              variant={vaccine.status === "Em dia" ? "default" : "destructive"}
              className={vaccine.status === "Em dia" ? "bg-green-100 text-green-800" : ""}
            >
              {vaccine.status}
            </Badge>
          </div>

          <div className="space-y-4 border-t border-border/30 pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-vet-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Data de Aplicação</p>
                <p className="text-sm text-vet-neutral">{vaccine.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-vet-secondary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Próxima Dose</p>
                <p className="text-sm text-vet-neutral">{vaccine.next}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-vet-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Veterinário Responsável</p>
                <p className="text-sm text-vet-neutral">{vaccine.vet}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-vet-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Observações</p>
                <p className="text-sm text-vet-neutral">
                  Vacina aplicada conforme protocolo. Animal apresentou boa reação. 
                  Recomenda-se manter o pet em observação por 24 horas após a aplicação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VaccineDetailsModal;
