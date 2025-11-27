import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import api from "@/services/api";

interface Service {
    id: string;
    name: string;
    price: number;
    duration_minutes?: number;
    description?: string;
}

const ServiceManagement = () => {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration_minutes: "",
        description: "",
    });

    const { data: services = [], isLoading } = useQuery({
        queryKey: ["clinicServices"],
        queryFn: () => api.getClinicServices(),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.createClinicService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clinicServices"] });
            toast.success("Serviço criado com sucesso!");
            handleCloseDialog();
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao criar serviço");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.updateClinicService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clinicServices"] });
            toast.success("Serviço atualizado com sucesso!");
            handleCloseDialog();
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao atualizar serviço");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteClinicService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clinicServices"] });
            toast.success("Serviço deletado com sucesso!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao deletar serviço");
        },
    });

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingService(null);
        setFormData({
            name: "",
            price: "",
            duration_minutes: "",
            description: "",
        });
    };

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                price: service.price.toString(),
                duration_minutes: service.duration_minutes?.toString() || "",
                description: service.description || "",
            });
        } else {
            setEditingService(null);
            setFormData({
                name: "",
                price: "",
                duration_minutes: "",
                description: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            toast.error("Preencha os campos obrigatórios");
            return;
        }

        const data = {
            name: formData.name,
            price: parseFloat(formData.price),
            duration_minutes: formData.duration_minutes
                ? parseInt(formData.duration_minutes)
                : undefined,
            description: formData.description || undefined,
        };

        if (editingService) {
            updateMutation.mutate({ id: editingService.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja deletar o serviço "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-vet-primary" />
                    <span className="ml-2">Carregando serviços...</span>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Serviços</h2>
                    <p className="text-muted-foreground">
                        Gerencie os serviços oferecidos pela sua clínica
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Serviço
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingService ? "Editar Serviço" : "Novo Serviço"}
                                </DialogTitle>
                                <DialogDescription>
                                    Preencha os dados do serviço
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        placeholder="Ex: Consulta Geral"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Preço (R$) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        placeholder="150.00"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duração (minutos)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={formData.duration_minutes}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                duration_minutes: e.target.value,
                                            })
                                        }
                                        placeholder="30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        placeholder="Descrição do serviço..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        "Salvar"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {services.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        Nenhum serviço cadastrado
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Primeiro Serviço
                    </Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Duração</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service: Service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell>
                                    R$ {parseFloat(service.price.toString()).toFixed(2).replace(".", ",")}
                                </TableCell>
                                <TableCell>
                                    {service.duration_minutes
                                        ? `${service.duration_minutes} min`
                                        : "-"}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {service.description || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(service)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(service.id, service.name)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Card>
    );
};

export default ServiceManagement;
