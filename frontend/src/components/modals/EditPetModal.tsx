import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

interface EditPetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet: {
    name: string;
    breed: string;
    age: string;
    weight: string;
    gender: string;
    microchip: string;
  };
}

const EditPetModal = ({ open, onOpenChange, pet }: EditPetModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="petName">Nome do pet</Label>
            <Input defaultValue={pet.name} placeholder="Ex: Rex, Mimi..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="species">Espécie</Label>
              <select className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none">
                <option>Cão</option>
                <option>Gato</option>
                <option>Pássaro</option>
                <option>Coelho</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <Label htmlFor="breed">Raça</Label>
              <Input defaultValue={pet.breed} placeholder="Ex: Golden Retriever" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input defaultValue={pet.age} placeholder="Ex: 3 anos" />
            </div>
            <div>
              <Label htmlFor="weight">Peso</Label>
              <Input defaultValue={pet.weight} placeholder="Ex: 25 kg" />
            </div>
          </div>
          <div>
            <Label htmlFor="gender">Sexo</Label>
            <select 
              defaultValue={pet.gender}
              className="w-full p-2 border border-border rounded-md focus:border-vet-primary focus:outline-none"
            >
              <option>Macho</option>
              <option>Fêmea</option>
            </select>
          </div>
          <div>
            <Label htmlFor="microchip">Microchip</Label>
            <Input defaultValue={pet.microchip} placeholder="Ex: 985141001234567" />
          </div>
          <Button variant="vet" className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPetModal;
