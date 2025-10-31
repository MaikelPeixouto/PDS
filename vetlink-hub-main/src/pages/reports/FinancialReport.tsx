import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Wallet,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinancialReport = () => {
  const navigate = useNavigate();

  const financialData = {
    period: "Janeiro 2025",
    totalRevenue: 48500,
    totalExpenses: 18200,
    netProfit: 30300,
    profitMargin: 62.5,
    revenueByPaymentMethod: [
      { method: "Cartão de Crédito", amount: 28500, percentage: 58.8 },
      { method: "Dinheiro", amount: 9200, percentage: 19.0 },
      { method: "PIX", amount: 7800, percentage: 16.1 },
      { method: "Cartão de Débito", amount: 3000, percentage: 6.1 }
    ],
    expensesByCategory: [
      { category: "Salários", amount: 10000, percentage: 55.0 },
      { category: "Medicamentos", amount: 4200, percentage: 23.1 },
      { category: "Equipamentos", amount: 2000, percentage: 11.0 },
      { category: "Aluguel", amount: 1500, percentage: 8.2 },
      { category: "Outros", amount: 500, percentage: 2.7 }
    ],
    dailyRevenue: [
      { date: "01/01", revenue: 1800 },
      { date: "02/01", revenue: 1600 },
      { date: "03/01", revenue: 1900 },
      { date: "04/01", revenue: 1500 },
      { date: "05/01", revenue: 2100 },
      { date: "06/01", revenue: 1700 },
      { date: "07/01", revenue: 1400 }
    ],
    comparison: {
      revenue: 8.5,
      expenses: -3.2,
      profit: 12.8
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
                <h1 className="text-2xl font-bold text-foreground">Relatório Financeiro</h1>
                <p className="text-sm text-vet-neutral">{financialData.period}</p>
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
                <p className="text-sm text-vet-neutral">Receita Total</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  R$ {(financialData.totalRevenue / 1000).toFixed(1)}K
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-vet-success" />
                  <span className="text-sm text-vet-success">+{financialData.comparison.revenue}%</span>
                </div>
              </div>
              <DollarSign className="h-10 w-10 text-vet-success" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Despesas</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  R$ {(financialData.totalExpenses / 1000).toFixed(1)}K
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="h-4 w-4 text-vet-success" />
                  <span className="text-sm text-vet-success">{financialData.comparison.expenses}%</span>
                </div>
              </div>
              <Wallet className="h-10 w-10 text-vet-warning" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Lucro Líquido</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  R$ {(financialData.netProfit / 1000).toFixed(1)}K
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-vet-success" />
                  <span className="text-sm text-vet-success">+{financialData.comparison.profit}%</span>
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-vet-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vet-neutral">Margem de Lucro</p>
                <p className="text-3xl font-bold text-foreground mt-1">{financialData.profitMargin}%</p>
                <Badge className="mt-2 bg-vet-success/10 text-vet-success border-vet-success/20">
                  Saudável
                </Badge>
              </div>
              <Calendar className="h-10 w-10 text-vet-accent" />
            </div>
          </Card>
        </div>

        {/* Revenue by Payment Method */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Receita por Método de Pagamento</h3>
          <div className="space-y-4">
            {financialData.revenueByPaymentMethod.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <CreditCard className="h-6 w-6 text-vet-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{payment.method}</p>
                    <div className="w-full bg-vet-primary/10 rounded-full h-2 mt-2">
                      <div 
                        className="bg-vet-primary h-2 rounded-full" 
                        style={{ width: `${payment.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-vet-success">R$ {payment.amount.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-vet-neutral">{payment.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Expenses by Category */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Despesas por Categoria</h3>
          <div className="space-y-4">
            {financialData.expensesByCategory.map((expense, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-vet-warning/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{expense.category}</p>
                  <div className="w-full bg-vet-warning/10 rounded-full h-2 mt-2">
                    <div 
                      className="bg-vet-warning h-2 rounded-full" 
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-vet-warning">R$ {expense.amount.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-vet-neutral">{expense.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Revenue Trend */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Tendência de Receita Diária (Últimos 7 dias)</h3>
          <div className="space-y-3">
            {financialData.dailyRevenue.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-vet-primary/5 rounded-lg">
                <span className="text-sm font-medium text-foreground">{day.date}</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-vet-primary/10 rounded-full h-2">
                    <div 
                      className="bg-vet-primary h-2 rounded-full" 
                      style={{ width: `${(day.revenue / 2500) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-vet-success min-w-[100px] text-right">
                    R$ {day.revenue.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReport;
