import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Download,
  Search,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/services/api";
import * as XLSX from "xlsx";

const ClientsReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clientsReport', user?.id, searchTerm],
    queryFn: async () => {
      if (!user?.id) return null;
      return await api.getClientsReport(searchTerm || undefined);
    },
    enabled: !!user?.id,
  });

  const reportData = clientsData || {
    total: 0,
    active: 0,
    new: 0,
    returning: 0,
    clients: []
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm) return reportData.clients || [];
    const term = searchTerm.toLowerCase();
    return (reportData.clients || []).filter((client: any) =>
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term)
    );
  }, [reportData.clients, searchTerm]);

  const handleExportExcel = () => {
    const worksheetData = filteredClients.map((client: any) => ({
      'Nome': client.name,
      'Email': client.email,
      'Telefone': client.phone,
      'Pets': client.pets?.join(', ') || '',
      'Total Gasto': client.totalSpent,
      'Consultas': client.appointments,
      'Última Visita': client.lastVisit ? format(parseISO(client.lastVisit), 'dd/MM/yyyy', { locale: ptBR }) : '',
      'Status': client.status === 'new' ? 'Novo' : 'Ativo'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, `relatorio-clientes-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard-clinica")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Relatório de Clientes</h1>
                <p className="text-sm text-vet-neutral">Clientes ativos e histórico</p>
              </div>
            </div>

            <Button variant="vet" onClick={handleExportExcel} disabled={isLoading || filteredClients.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-vet-neutral">Carregando relatório de clientes...</p>
          </div>
        ) : (
          <>
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Total de Clientes</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{reportData.total}</p>
                  </div>
                  <Users className="h-10 w-10 text-vet-primary" />
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Clientes Ativos</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{reportData.active}</p>
                    {reportData.total > 0 && (
                      <Badge className="mt-2 bg-vet-success/10 text-vet-success border-vet-success/20">
                        {Math.round((reportData.active / reportData.total) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <TrendingUp className="h-10 w-10 text-vet-success" />
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Novos Clientes</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{reportData.new}</p>
                    <p className="text-xs text-vet-neutral mt-2">Este mês</p>
                  </div>
                  <Users className="h-10 w-10 text-vet-secondary" />
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Taxa de Retorno</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {reportData.total > 0 ? Math.round((reportData.returning / reportData.total) * 100) : 0}%
                    </p>
                    <Badge className={`mt-2 ${
                      reportData.total > 0 && (reportData.returning / reportData.total) >= 0.7
                        ? 'bg-vet-success/10 text-vet-success border-vet-success/20'
                        : 'bg-vet-accent/10 text-vet-accent border-vet-accent/20'
                    }`}>
                      {reportData.total > 0 && (reportData.returning / reportData.total) >= 0.7 ? 'Alto' : 'Médio'}
                    </Badge>
                  </div>
                  <Calendar className="h-10 w-10 text-vet-accent" />
                </div>
              </Card>
            </div>

            {}
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-vet-neutral" />
                <Input
                  placeholder="Buscar clientes por nome ou email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Card>

            {}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Lista de Clientes</h3>
          {filteredClients.length > 0 ? (
            <div className="space-y-4">
              {filteredClients.map((client: any) => (
                <div key={client.id} className="p-4 border border-border rounded-lg hover:bg-vet-primary/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-vet-primary text-white">
                          {client.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'CL'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{client.name}</h4>
                          <Badge className={client.status === 'new'
                            ? 'bg-vet-secondary/10 text-vet-secondary border-vet-secondary/20'
                            : 'bg-vet-success/10 text-vet-success border-vet-success/20'
                          }>
                            {client.status === 'new' ? 'Novo' : 'Ativo'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {client.email && (
                            <div className="flex items-center gap-2 text-vet-neutral">
                              <Mail className="h-4 w-4" />
                              {client.email}
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-vet-neutral">
                              <Phone className="h-4 w-4" />
                              {client.phone}
                            </div>
                          )}
                        </div>

                        {client.pets && client.pets.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="text-xs text-vet-neutral">
                              Pets: <span className="font-medium text-foreground">{client.pets.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-vet-neutral">Total gasto</p>
                      <p className="text-lg font-bold text-vet-success">
                        R$ {client.totalSpent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                      <p className="text-xs text-vet-neutral mt-1">{client.appointments || 0} consultas</p>
                      {client.lastVisit && (
                        <p className="text-xs text-vet-neutral">
                          Última: {format(parseISO(client.lastVisit), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-vet-neutral text-center py-8">
              {searchTerm ? 'Nenhum cliente encontrado com o termo de busca.' : 'Nenhum cliente cadastrado.'}
            </p>
          )}
        </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientsReport;
