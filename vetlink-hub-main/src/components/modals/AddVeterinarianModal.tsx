import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AddVeterinarianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddVeterinarianModal = ({ open, onOpenChange }: AddVeterinarianModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    crmv: "",
    specialty: "",
    status: "offline"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Novo veterinário:", formData);
    // Aqui você implementaria a lógica de adicionar o veterinário
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Veterinário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. João Silva"
                required
              />
            </div>

            <div>
              <Label htmlFor="crmv">CRMV *</Label>
              <Input
                id="crmv"
                value={formData.crmv}
                onChange={(e) => setFormData({ ...formData, crmv: e.target.value })}
                placeholder="CRMV-SP 12345"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@clinica.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">Especialidade *</Label>
              <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinica-geral">Clínica Geral</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="cardiologia">Cardiologia</SelectItem>
                  <SelectItem value="dermatologia">Dermatologia</SelectItem>
                  <SelectItem value="oftalmologia">Oftalmologia</SelectItem>
                  <SelectItem value="ortopedia">Ortopedia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status Inicial</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="busy">Ocupado</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="vet">
              Adicionar Veterinário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVeterinarianModal;
