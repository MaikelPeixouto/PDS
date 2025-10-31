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
import { useState } from "react";

const ClientsReport = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const clientsData = {
    total: 456,
    active: 387,
    new: 23,
    returning: 364,
    clients: [
      {
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        phone: "(11) 99999-1111",
        pets: ["Rex", "Bolinha"],
        appointments: 12,
        lastVisit: "15/01/2025",
        totalSpent: 2400,
        status: "active"
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(11) 99999-2222",
        pets: ["Mimi"],
        appointments: 8,
        lastVisit: "18/01/2025",
        totalSpent: 1600,
        status: "active"
      },
      {
        id: 3,
        name: "Carlos Lima",
        email: "carlos@email.com",
        phone: "(11) 99999-3333",
        pets: ["Bob", "Luna", "Thor"],
        appointments: 15,
        lastVisit: "20/01/2025",
        totalSpent: 3200,
        status: "active"
      },
      {
        id: 4,
        name: "Ana Costa",
        email: "ana@email.com",
        phone: "(11) 99999-4444",
        pets: ["Mel"],
        appointments: 6,
        lastVisit: "12/01/2025",
        totalSpent: 980,
        status: "new"
      }
    ]
  };

  const filteredClients = clientsData.clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            
            <Button variant="vet">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Total de Clientes</p>
                <p className="text-3xl font-bold text-foreground mt-1">{clientsData.total}</p>
              </div>
              <Users className="h-10 w-10 text-vet-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Clientes Ativos</p>
                <p className="text-3xl font-bold text-foreground mt-1">{clientsData.active}</p>
                <Badge className="mt-2 bg-vet-success/10 text-vet-success border-vet-success/20">
                  {Math.round((clientsData.active / clientsData.total) * 100)}%
                </Badge>
              </div>
              <TrendingUp className="h-10 w-10 text-vet-success" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Novos Clientes</p>
                <p className="text-3xl font-bold text-foreground mt-1">{clientsData.new}</p>
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
                  {Math.round((clientsData.returning / clientsData.total) * 100)}%
                </p>
                <Badge className="mt-2 bg-vet-accent/10 text-vet-accent border-vet-accent/20">
                  Alto
                </Badge>
              </div>
              <Calendar className="h-10 w-10 text-vet-accent" />
            </div>
          </Card>
        </div>

        {/* Search Bar */}
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

        {/* Clients List */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Lista de Clientes</h3>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-4 border border-border rounded-lg hover:bg-vet-primary/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-vet-primary text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
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
                        <div className="flex items-center gap-2 text-vet-neutral">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-vet-neutral">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="text-xs text-vet-neutral">
                          Pets: <span className="font-medium text-foreground">{client.pets.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-vet-neutral">Total gasto</p>
                    <p className="text-lg font-bold text-vet-success">
                      R$ {client.totalSpent.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-vet-neutral mt-1">{client.appointments} consultas</p>
                    <p className="text-xs text-vet-neutral">Última: {client.lastVisit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientsReport;
