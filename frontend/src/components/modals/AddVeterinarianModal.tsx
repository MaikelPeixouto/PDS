import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface AddVeterinarianModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const AddVeterinarianModal = ({
    open,
    onOpenChange,
    onSuccess,
}: AddVeterinarianModalProps) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        crmv: "",
        specialty: "",
    });

    const createVeterinarianMutation = useMutation({
        mutationFn: async (data: any) => {
            return await api.createVeterinarian({
                clinic_id: user?.id!,
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email || undefined,
                phone: data.phone || undefined,
                crmv: data.crmv,
                specialty: data.specialty,
            });
        },
        onSuccess: () => {
            toast.success("Veterinário adicionado com sucesso!");
            onOpenChange(false);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                crmv: "",
                specialty: "",
            });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao adicionar veterinário");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.crmv ||
            !formData.specialty
        ) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }
        createVeterinarianMutation.mutate(formData);
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
                            <Label htmlFor="firstName">Nome *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        firstName: e.target.value,
                                    })
                                }
                                placeholder="João"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Sobrenome *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        lastName: e.target.value,
                                    })
                                }
                                placeholder="Silva"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="crmv">CRMV *</Label>
                            <Input
                                id="crmv"
                                value={formData.crmv}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        crmv: e.target.value,
                                    })
                                }
                                placeholder="CRMV-SP 12345"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email (opcional)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="joao@clinica.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Telefone (opcional)</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="specialty">Especialidade *</Label>
                        <Select
                            value={formData.specialty}
                            onValueChange={(value) =>
                                setFormData({ ...formData, specialty: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a especialidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Clínica Geral">
                                    Clínica Geral
                                </SelectItem>
                                <SelectItem value="Cirurgia">
                                    Cirurgia
                                </SelectItem>
                                <SelectItem value="Cardiologia">
                                    Cardiologia
                                </SelectItem>
                                <SelectItem value="Dermatologia">
                                    Dermatologia
                                </SelectItem>
                                <SelectItem value="Oftalmologia">
                                    Oftalmologia
                                </SelectItem>
                                <SelectItem value="Ortopedia">
                                    Ortopedia
                                </SelectItem>
                                <SelectItem value="Neurologia">
                                    Neurologia
                                </SelectItem>
                                <SelectItem value="Oncologia">
                                    Oncologia
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setFormData({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    phone: "",
                                    crmv: "",
                                    specialty: "",
                                });
                            }}
                            disabled={createVeterinarianMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="vet"
                            disabled={createVeterinarianMutation.isPending}
                        >
                            {createVeterinarianMutation.isPending
                                ? "Adicionando..."
                                : "Adicionar Veterinário"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddVeterinarianModal;
