import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const MonthlyReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['monthlyReport', user?.id, selectedYear, selectedMonth],
    queryFn: async () => {
      if (!user?.id) return null;
      return await api.getMonthlyReport(selectedYear, selectedMonth);
    },
    enabled: !!user?.id,
  });

  const monthData = reportData || {
    totalAppointments: 0,
    totalRevenue: 0,
    newClients: 0,
    returnRate: 0,
    appointmentsByType: [],
    weeklyData: [],
    comparison: {
      appointments: 0,
      revenue: 0,
      clients: 0
    }
  };

  const monthName = format(new Date(selectedYear, selectedMonth - 1, 1), "MMMM yyyy", { locale: ptBR });
  const monthNameCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let yPosition = 20;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Relatório Mensal", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(monthNameCapitalized, 14, yPosition);
      yPosition += 15;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Resumo", 14, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Agendamentos: ${monthData.totalAppointments}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Receita Total: R$ ${monthData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Novos Clientes: ${monthData.newClients}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Taxa de Retorno: ${monthData.returnRate}%`, 14, yPosition);
      yPosition += 15;

      if (monthData.appointmentsByType && monthData.appointmentsByType.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Agendamentos por Tipo de Serviço", 14, yPosition);
        yPosition += 5;

        const tableData = monthData.appointmentsByType.map((item: any) => [
          item.type || 'N/A',
          (item.count || 0).toString(),
          `R$ ${(item.revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Serviço', 'Quantidade', 'Receita']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 }
        });

        yPosition = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : yPosition + 30;
      }

      if (monthData.weeklyData && monthData.weeklyData.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Desempenho Semanal", 14, yPosition);
        yPosition += 5;

        const weeklyTableData = monthData.weeklyData.map((item: any) => [
          item.week || 'N/A',
          (item.appointments || 0).toString(),
          `R$ ${(item.revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Semana', 'Agendamentos', 'Receita']],
          body: weeklyTableData,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 }
        });
      }

      const monthStr = selectedMonth.toString().padStart(2, '0');
      const fileName = `relatorio-mensal-${monthStr}-${selectedYear}.pdf`;

      const pdfDataUri = doc.output('datauristring');

      let pdfBlob = doc.output('blob');

      console.log('PDF gerado:', {
        blobSize: pdfBlob.size,
        blobType: pdfBlob.type,
        fileName: fileName,
        isValidPDF: pdfBlob.type === 'application/pdf'
      });

      if (pdfBlob.size === 0) {
        throw new Error('PDF está vazio. Não foi possível gerar o arquivo.');
      }

      if (pdfBlob.type !== 'application/pdf') {
        console.warn('Tipo MIME inesperado, corrigindo:', pdfBlob.type);
        pdfBlob = new Blob([pdfBlob], { type: 'application/pdf' });
      }

      try {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;
        link.type = 'application/pdf';
        link.style.position = 'fixed';
        link.style.left = '-9999px';
        link.style.top = '-9999px';

        document.body.appendChild(link);

        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });

        console.log('Iniciando download do arquivo:', fileName);
        link.dispatchEvent(clickEvent);

        setTimeout(() => {
          link.click();
        }, 10);

        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
          console.log('Download iniciado. Verifique sua pasta de Downloads.');
        }, 2000);

      } catch (error) {
        console.error('Erro com método blob, tentando data URI:', error);

        const link = document.createElement('a');
        link.href = pdfDataUri;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setShowExportDialog(false);

      toast.success(
        `PDF "${fileName}" gerado! Verifique sua pasta de Downloads ou pressione Ctrl+J para ver downloads recentes.`,
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setShowExportDialog(false);
      toast.error('Erro ao gerar o PDF. Por favor, tente novamente.');
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
                <p className="text-sm text-vet-neutral">{monthNameCapitalized}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {format(new Date(selectedYear, month - 1, 1), "MMMM", { locale: ptBR })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                <Button variant="vet" onClick={() => setShowExportDialog(true)} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-vet-neutral">Carregando relatório...</p>
          </div>
        ) : (
          <>
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Agendamentos</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{monthData.totalAppointments}</p>
                    {monthData.comparison && monthData.comparison.appointments !== 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {monthData.comparison.appointments > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-vet-success" />
                            <span className="text-sm text-vet-success">+{monthData.comparison.appointments}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-vet-error" />
                            <span className="text-sm text-vet-error">{monthData.comparison.appointments}%</span>
                          </>
                        )}
                      </div>
                    )}
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
                    {monthData.comparison && monthData.comparison.revenue !== 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {monthData.comparison.revenue > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-vet-success" />
                            <span className="text-sm text-vet-success">+{monthData.comparison.revenue}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-vet-error" />
                            <span className="text-sm text-vet-error">{monthData.comparison.revenue}%</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <DollarSign className="h-10 w-10 text-vet-success" />
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Novos Clientes</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{monthData.newClients}</p>
                    {monthData.comparison && monthData.comparison.clients !== 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {monthData.comparison.clients > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-vet-success" />
                            <span className="text-sm text-vet-success">+{monthData.comparison.clients}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-vet-error" />
                            <span className="text-sm text-vet-error">{monthData.comparison.clients}%</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Users className="h-10 w-10 text-vet-secondary" />
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vet-neutral">Taxa de Retorno</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{monthData.returnRate}%</p>
                    <Badge className={`mt-2 ${
                      monthData.returnRate >= 80
                        ? 'bg-vet-success/10 text-vet-success border-vet-success/20'
                        : monthData.returnRate >= 60
                        ? 'bg-vet-warning/10 text-vet-warning border-vet-warning/20'
                        : 'bg-vet-error/10 text-vet-error border-vet-error/20'
                    }`}>
                      {monthData.returnRate >= 80 ? 'Excelente' : monthData.returnRate >= 60 ? 'Bom' : 'A melhorar'}
                    </Badge>
                  </div>
                  <TrendingUp className="h-10 w-10 text-vet-accent" />
                </div>
              </Card>
            </div>

            {}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">Agendamentos por Tipo de Serviço</h3>
              {monthData.appointmentsByType && monthData.appointmentsByType.length > 0 ? (
                <div className="space-y-4">
                  {monthData.appointmentsByType.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{item.type}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-vet-neutral">{item.count} agendamentos</span>
                          <span className="text-sm font-medium text-vet-success">
                            R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="w-32 bg-vet-primary/10 rounded-full h-2">
                        <div
                          className="bg-vet-primary h-2 rounded-full"
                          style={{ width: `${monthData.totalAppointments > 0 ? (item.count / monthData.totalAppointments) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-vet-neutral text-center py-4">Nenhum agendamento neste período</p>
              )}
            </Card>

            {}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">Desempenho Semanal</h3>
              {monthData.weeklyData && monthData.weeklyData.length > 0 ? (
                <div className="space-y-4">
                  {monthData.weeklyData.map((week: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-vet-primary/5 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{week.week}</p>
                        <p className="text-sm text-vet-neutral">{week.appointments} agendamentos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-vet-success">R$ {week.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-vet-neutral">receita</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-vet-neutral text-center py-4">Nenhum dado semanal disponível</p>
              )}
            </Card>
          </>
        )}
      </div>

      {}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exportar Relatório em PDF</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a exportar o relatório mensal de <strong>{monthNameCapitalized}</strong> em formato PDF.
              O arquivo será salvo na sua pasta de Downloads com o nome <strong>relatorio-mensal-{selectedMonth.toString().padStart(2, '0')}-{selectedYear}.pdf</strong>.
              <br /><br />
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportPDF} className="bg-vet-primary hover:bg-vet-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MonthlyReport;
