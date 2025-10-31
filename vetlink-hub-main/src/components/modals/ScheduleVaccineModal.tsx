import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Syringe } from "lucide-react";

interface ScheduleVaccineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petName: string;
}

const ScheduleVaccineModal = ({ open, onOpenChange, petName }: ScheduleVaccineModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Vacina para {petName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="vaccine">Tipo de Vacina</Label>
            <select className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none">
              <option>V10 (Polivalente)</option>
              <option>Antirrábica</option>
              <option>Gripe Canina</option>
              <option>V4 Felina</option>
              <option>FeLV</option>
              <option>Giardíase</option>
              <option>Outra</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="clinic">Clínica Veterinária</Label>
            <select className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none">
              <option>Clínica VetCare</option>
              <option>Hospital PetLife</option>
              <option>Centro Animal+</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input type="date" />
            </div>
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input type="time" />
            </div>
          </div>

          <div>
            <Label htmlFor="vet">Veterinário (opcional)</Label>
            <Input placeholder="Nome do veterinário" />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              placeholder="Adicione observações sobre a vacinação..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="vet" className="flex-1">
              <Syringe className="h-4 w-4 mr-2" />
              Agendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleVaccineModal;
