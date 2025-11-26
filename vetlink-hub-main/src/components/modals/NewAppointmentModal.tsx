import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewAppointmentModal = ({ open, onOpenChange }: NewAppointmentModalProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    petName: "",
    petType: "",
    service: "",
    veterinarian: "",
    time: "",
    notes: ""
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Novo agendamento:", { ...formData, date });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="João Silva"
                required
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Telefone do Cliente *</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petName">Nome do Pet *</Label>
              <Input
                id="petName"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                placeholder="Rex"
                required
              />
            </div>

            <div>
              <Label htmlFor="petType">Tipo de Animal *</Label>
              <Select value={formData.petType} onValueChange={(value) => setFormData({ ...formData, petType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cachorro">Cachorro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="passaro">Pássaro</SelectItem>
                  <SelectItem value="roedor">Roedor</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <SelectValue placeholder="Selecione o horário" />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service">Tipo de Serviço *</Label>
              <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="vacinacao">Vacinação</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="veterinarian">Veterinário *</Label>
              <Select value={formData.veterinarian} onValueChange={(value) => setFormData({ ...formData, veterinarian: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veterinário" />
                </SelectTrigger>
                <SelectContent>
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
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informações adicionais sobre o agendamento..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="vet">
              Criar Agendamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentModal;
