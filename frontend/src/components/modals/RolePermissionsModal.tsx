import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import {
  UserPlus,
  Trash2,
  Mail,
  Shield,
  Check,
  X
} from "lucide-react";

interface RolePermission {
  id: string;
  label: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface RolePermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: {
    name: string;
    description: string;
    permissions: RolePermission[];
    members: TeamMember[];
  } | null;
}

export function RolePermissionsModal({
  open,
  onOpenChange,
  role,
}: RolePermissionsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions.map(p => p.id) || []
  );

  useEffect(() => {
    if (role) {
      const firstMember = role.members[0];
      if (firstMember) {
        setSelectedPermissions(role.permissions.map(p => p.id));
      } else {
        setSelectedPermissions(role.permissions.map(p => p.id));
      }
    }
  }, [role]);

  const createMemberMutation = useMutation({
    mutationFn: async (data: { email: string; name: string; role: string; permissions: string[] }) => {
      return await api.createTeamMember({
        email: data.email,
        name: data.name,
        role: data.role,
        permissions: data.permissions.map(id => ({ id, enabled: true })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({
        title: "Membro adicionado",
        description: `${newMemberName} foi adicionado à equipe`,
      });
      setNewMemberEmail("");
      setNewMemberName("");
      setShowAddMember(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message || "Não foi possível adicionar o membro.",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      return await api.deleteTeamMember(memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover membro",
        description: error.message || "Não foi possível remover o membro.",
        variant: "destructive",
      });
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ memberId, permissions }: { memberId: string; permissions: string[] }) => {
      return await api.updateTeamMemberPermissions(memberId, permissions.map(id => ({ id, enabled: true })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({
        title: "Permissões atualizadas",
        description: "As permissões foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message || "Não foi possível atualizar as permissões.",
        variant: "destructive",
      });
    },
  });

  const handleAddMember = () => {
    if (!newMemberEmail || !newMemberName || !role) return;

    createMemberMutation.mutate({
      email: newMemberEmail,
      name: newMemberName,
      role: role.name.toLowerCase(),
      permissions: selectedPermissions,
    });
  };

  const handleRemoveMember = (member: TeamMember) => {
    deleteMemberMutation.mutate(member.id);
  };

  const handleSavePermissions = () => {
    if (!role) return;

    const updatePromises = role.members.map(member =>
      updatePermissionsMutation.mutateAsync({
        memberId: member.id,
        permissions: selectedPermissions,
      })
    );

    Promise.all(updatePromises).then(() => {
      onOpenChange(false);
    });
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-vet-primary" />
            Gerenciar {role.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {role.description}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Permissões de Acesso</h3>
            <Card className="p-4">
              <div className="space-y-3">
                {role.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={permission.id}
                        className="font-medium cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                    {selectedPermissions.includes(permission.id) ? (
                      <Check className="h-4 w-4 text-vet-success" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Separator />

          {}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">
                Membros ({role.members.length})
              </h3>
              <Button
                variant="vetOutline"
                size="sm"
                onClick={() => setShowAddMember(!showAddMember)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </div>

            {}
            {showAddMember && (
              <Card className="p-4 mb-4 border-vet-primary/30">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="member-name">Nome do Membro</Label>
                    <Input
                      id="member-name"
                      placeholder="Nome completo"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-email">E-mail do Membro</Label>
                    <div className="flex gap-2">
                      <Input
                        id="member-email"
                        type="email"
                        placeholder="exemplo@email.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                      />
                      <Button
                        variant="vet"
                        onClick={handleAddMember}
                        disabled={createMemberMutation.isPending}
                      >
                        {createMemberMutation.isPending ? "Adicionando..." : "Adicionar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {}
            <div className="space-y-2">
              {role.members.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-vet-primary text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                      disabled={deleteMemberMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-vet-error" />
                    </Button>
                  </div>
                </Card>
              ))}

              {role.members.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum membro com esta função</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="vet"
            onClick={handleSavePermissions}
            disabled={updatePermissionsMutation.isPending}
          >
            {updatePermissionsMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
