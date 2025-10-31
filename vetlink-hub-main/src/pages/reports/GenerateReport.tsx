import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

const GenerateReport = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const reportTypes = [
    { id: "appointments", label: "Agendamentos", description: "Lista completa de agendamentos do período" },
    { id: "revenue", label: "Receita", description: "Análise detalhada de receita e faturamento" },
    { id: "clients", label: "Clientes", description: "Relatório de clientes ativos e inativos" },
    { id: "services", label: "Serviços", description: "Performance por tipo de serviço" },
    { id: "veterinarians", label: "Veterinários", description: "Desempenho da equipe veterinária" },
    { id: "expenses", label: "Despesas", description: "Detalhamento de despesas operacionais" }
  ];

  const toggleReport = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = () => {
    // Aqui você implementaria a lógica de geração do relatório
    console.log("Gerando relatório:", { startDate, endDate, selectedReports });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard-clinica")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gerar Relatório Personalizado</h1>
              <p className="text-sm text-vet-neutral">Configure e gere relatórios customizados</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Period Selection */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-vet-primary" />
              Período do Relatório
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>

          {/* Report Type Selection */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-vet-primary" />
              Tipos de Relatório
            </h3>
            
            <div className="space-y-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-vet-primary/5 transition-colors cursor-pointer"
                  onClick={() => toggleReport(report.id)}
                >
                  <Checkbox
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => toggleReport(report.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{report.label}</h4>
                    <p className="text-sm text-vet-neutral mt-1">{report.description}</p>
                  </div>
                  {selectedReports.includes(report.id) && (
                    <CheckCircle2 className="h-5 w-5 text-vet-success" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-foreground mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-vet-neutral">Período:</span>
                <span className="font-medium text-foreground">
                  {startDate && endDate 
                    ? `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
                    : "Não definido"
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-vet-neutral">Relatórios selecionados:</span>
                <span className="font-medium text-foreground">{selectedReports.length}</span>
              </div>
            </div>

            <Button
              variant="vet"
              className="w-full mt-6"
              disabled={!startDate || !endDate || selectedReports.length === 0}
              onClick={handleGenerate}
            >
              <Download className="h-4 w-4 mr-2" />
              Gerar e Baixar Relatório
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
