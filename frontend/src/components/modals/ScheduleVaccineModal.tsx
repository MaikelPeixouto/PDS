import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Syringe } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/services/api";

interface ScheduleVaccineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petName: string;
  petId: string | number;
  onSuccess?: () => void;
}

const ScheduleVaccineModal = ({ open, onOpenChange, petName, petId, onSuccess }: ScheduleVaccineModalProps) => {
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [nextVaccinationDate, setNextVaccinationDate] = useState("");

  const createVaccineMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!petId || (typeof petId === 'number' && isNaN(petId))) {
        throw new Error('ID do pet inválido');
      }
      return await api.createVaccine(petId, data);
    },
    onSuccess: () => {
      toast.success("Vacina cadastrada com sucesso!");
      onOpenChange(false);
      setVaccineName("");
      setVaccinationDate("");
      setNextVaccinationDate("");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao cadastrar vacina");
    },
  });

  const handleSubmit = () => {
    if (!vaccineName || !vaccinationDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createVaccineMutation.mutate({
      name: vaccineName,
      vaccination_date: new Date(vaccinationDate).toISOString(),
      next_vaccination_date: nextVaccinationDate ? new Date(nextVaccinationDate).toISOString() : undefined,
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Vacina para {petName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="vaccine">Tipo de Vacina *</Label>
            <select
              className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
            >
              <option value="">Selecione uma vacina</option>
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
            <Label htmlFor="vaccinationDate">Data da Vacinação *</Label>
            <Input
              type="date"
              value={vaccinationDate}
              onChange={(e) => setVaccinationDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="nextVaccinationDate">Próxima Vacinação (opcional)</Label>
            <Input
              type="date"
              value={nextVaccinationDate}
              onChange={(e) => setNextVaccinationDate(e.target.value)}
              min={vaccinationDate || new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-vet-neutral mt-1">
              Data prevista para a próxima dose desta vacina
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                setVaccineName("");
                setVaccinationDate("");
                setNextVaccinationDate("");
              }}
              disabled={createVaccineMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="vet"
              className="flex-1"
              onClick={handleSubmit}
              disabled={createVaccineMutation.isPending || !vaccineName || !vaccinationDate}
            >
              <Syringe className="h-4 w-4 mr-2" />
              {createVaccineMutation.isPending ? "Cadastrando..." : "Cadastrar Vacina"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleVaccineModal;
