import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MonthlyReport = () => {
  const navigate = useNavigate();

  const monthData = {
    month: "Janeiro 2025",
    totalAppointments: 234,
    totalRevenue: 48500,
    newClients: 23,
    returnRate: 89,
    appointmentsByType: [
      { type: "Consulta", count: 98, revenue: 19600 },
      { type: "Vacinação", count: 67, revenue: 6700 },
      { type: "Cirurgia", count: 34, revenue: 17000 },
      { type: "Check-up", count: 35, revenue: 5200 }
    ],
    weeklyData: [
      { week: "Semana 1", appointments: 56, revenue: 11200 },
      { week: "Semana 2", appointments: 62, revenue: 12800 },
      { week: "Semana 3", appointments: 58, revenue: 11900 },
      { week: "Semana 4", appointments: 58, revenue: 12600 }
    ],
    comparison: {
      appointments: 12,
      revenue: 8.5,
      clients: 5
    }
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
                <h1 className="text-2xl font-bold text-foreground">Relatório Mensal</h1>
                <p className="text-sm text-vet-neutral">{monthData.month}</p>
              </div>
            </div>
            
            <Button variant="vet">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
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
                <p className="text-sm text-vet-neutral">Agendamentos</p>
                <p className="text-3xl font-bold text-foreground mt-1">{monthData.totalAppointments}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-vet-success" />
                  <span className="text-sm text-vet-success">+{monthData.comparison.appointments}%</span>
                </div>
              </div>
              <Calendar className="h-10 w-10 text-vet-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Receita Total</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  R$ {(monthData.totalRevenue / 1000).toFixed(1)}K
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-vet-success" />
                  <span className="text-sm text-vet-success">+{monthData.comparison.revenue}%</span>
                </div>
              </div>
              <DollarSign className="h-10 w-10 text-vet-success" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Novos Clientes</p>
                <p className="text-3xl font-bold text-foreground mt-1">{monthData.newClients}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-vet-success" />
                  <span className="text-sm text-vet-success">+{monthData.comparison.clients}%</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-vet-secondary" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Taxa de Retorno</p>
                <p className="text-3xl font-bold text-foreground mt-1">{monthData.returnRate}%</p>
                <Badge className="mt-2 bg-vet-success/10 text-vet-success border-vet-success/20">
                  Excelente
                </Badge>
              </div>
              <TrendingUp className="h-10 w-10 text-vet-accent" />
            </div>
          </Card>
        </div>

        {/* Appointments by Type */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Agendamentos por Tipo de Serviço</h3>
          <div className="space-y-4">
            {monthData.appointmentsByType.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.type}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-vet-neutral">{item.count} agendamentos</span>
                    <span className="text-sm font-medium text-vet-success">
                      R$ {item.revenue.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="w-32 bg-vet-primary/10 rounded-full h-2">
                  <div 
                    className="bg-vet-primary h-2 rounded-full" 
                    style={{ width: `${(item.count / monthData.totalAppointments) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Performance */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Desempenho Semanal</h3>
          <div className="space-y-4">
            {monthData.weeklyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-vet-primary/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{week.week}</p>
                  <p className="text-sm text-vet-neutral">{week.appointments} agendamentos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-vet-success">R$ {week.revenue.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-vet-neutral">receita</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyReport;
