import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    FileText,
    Download,
    ArrowLeft,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const GenerateReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedReports, setSelectedReports] = useState<string[]>([]);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("pdf");

    const reportTypes = [
        {
            id: "appointments",
            label: "Agendamentos",
            description: "Lista completa de agendamentos do período",
        },
        {
            id: "revenue",
            label: "Receita",
            description: "Análise detalhada de receita e faturamento",
        },
        {
            id: "clients",
            label: "Clientes",
            description: "Relatório de clientes ativos e inativos",
        },
        {
            id: "services",
            label: "Serviços",
            description: "Performance por tipo de serviço",
        },
        {
            id: "veterinarians",
            label: "Veterinários",
            description: "Desempenho da equipe veterinária",
        },
        {
            id: "expenses",
            label: "Despesas",
            description: "Detalhamento de despesas operacionais",
        },
    ];

    const toggleReport = (id: string) => {
        setSelectedReports((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const generateReportMutation = useMutation({
        mutationFn: async () => {
            if (!startDate || !endDate || selectedReports.length === 0) {
                throw new Error(
                    "Por favor, preencha todas as informações necessárias"
                );
            }
            return await api.getCustomReport(
                startDate,
                endDate,
                selectedReports
            );
        },
        onSuccess: (data) => {
            if (exportFormat === "pdf") {
                handleExportPDF(data);
            } else {
                handleExportExcel(data);
            }
            setShowExportDialog(false);
        },
        onError: (error: any) => {
            toast.error("Erro ao gerar relatório", {
                description:
                    error.message || "Não foi possível gerar o relatório.",
            });
        },
    });

    const handleGenerate = () => {
        if (!startDate || !endDate || selectedReports.length === 0) {
            toast.error("Preencha todos os campos", {
                description:
                    "Selecione o período e pelo menos um tipo de relatório.",
            });
            return;
        }
        setShowExportDialog(true);
    };

    const handleExportPDF = (reportData: any) => {
        try {
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            let yPosition = 20;

            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text("Relatório Personalizado", 14, yPosition);
            yPosition += 10;

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const periodText =
                startDate && endDate
                    ? `${format(startDate, "dd/MM/yyyy", {
                          locale: ptBR,
                      })} - ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
                    : "Período não definido";
            doc.text(periodText, 14, yPosition);
            yPosition += 15;

            if (selectedReports.includes("appointments")) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Agendamentos", 14, yPosition);
                yPosition += 8;

                if (
                    reportData.appointments &&
                    reportData.appointments.length > 0
                ) {
                    const appointmentsData = reportData.appointments.map(
                        (apt: any) => [
                            format(new Date(apt.date), "dd/MM/yyyy"),
                            apt.time || "N/A",
                            apt.clientName || "N/A",
                            apt.petName || "N/A",
                            apt.serviceName || "N/A",
                            apt.status || "N/A",
                            `R$ ${(apt.servicePrice || 0).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`,
                        ]
                    );

                    autoTable(doc, {
                        startY: yPosition,
                        head: [
                            [
                                "Data",
                                "Hora",
                                "Cliente",
                                "Pet",
                                "Serviço",
                                "Status",
                                "Valor",
                            ],
                        ],
                        body: appointmentsData,
                        theme: "striped",
                        headStyles: {
                            fillColor: [34, 197, 94],
                            textColor: [255, 255, 255],
                            fontStyle: "bold",
                        },
                        styles: { fontSize: 8 },
                        margin: { left: 14, right: 14 },
                    });

                    yPosition = (doc as any).lastAutoTable?.finalY
                        ? (doc as any).lastAutoTable.finalY + 10
                        : yPosition + 30;
                } else {
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        "Nenhum agendamento encontrado no período.",
                        14,
                        yPosition
                    );
                    yPosition += 10;
                }
            }

            if (selectedReports.includes("revenue")) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Receita", 14, yPosition);
                yPosition += 8;

                if (reportData.revenue) {
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        `Receita Total: R$ ${(
                            reportData.revenue.totalRevenue || 0
                        ).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                        })}`,
                        14,
                        yPosition
                    );
                    yPosition += 6;
                    doc.text(
                        `Total de Agendamentos: ${
                            reportData.revenue.totalAppointments || 0
                        }`,
                        14,
                        yPosition
                    );
                    yPosition += 6;
                    doc.text(
                        `Clientes Únicos: ${
                            reportData.revenue.uniqueClients || 0
                        }`,
                        14,
                        yPosition
                    );
                    yPosition += 10;

                    if (
                        reportData.revenue.byPaymentMethod &&
                        reportData.revenue.byPaymentMethod.length > 0
                    ) {
                        const paymentData =
                            reportData.revenue.byPaymentMethod.map(
                                (pm: any) => [
                                    pm.method || "N/A",
                                    `R$ ${(pm.amount || 0).toLocaleString(
                                        "pt-BR",
                                        {
                                            minimumFractionDigits: 2,
                                        }
                                    )}`,
                                    `${pm.percentage || 0}%`,
                                ]
                            );

                        autoTable(doc, {
                            startY: yPosition,
                            head: [
                                ["Método de Pagamento", "Valor", "Percentual"],
                            ],
                            body: paymentData,
                            theme: "striped",
                            headStyles: {
                                fillColor: [34, 197, 94],
                                textColor: [255, 255, 255],
                                fontStyle: "bold",
                            },
                            styles: { fontSize: 9 },
                            margin: { left: 14, right: 14 },
                        });

                        yPosition = (doc as any).lastAutoTable?.finalY
                            ? (doc as any).lastAutoTable.finalY + 10
                            : yPosition + 30;
                    }
                } else {
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        "Nenhum dado de receita encontrado no período.",
                        14,
                        yPosition
                    );
                    yPosition += 10;
                }
            }

            if (selectedReports.includes("clients")) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Clientes", 14, yPosition);
                yPosition += 8;

                if (
                    reportData.clients &&
                    reportData.clients.clients &&
                    reportData.clients.clients.length > 0
                ) {
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text("Clientes", 14, yPosition);
                    yPosition += 8;

                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        `Total de Clientes: ${reportData.clients.total || 0}`,
                        14,
                        yPosition
                    );
                    yPosition += 10;

                    const clientsData = reportData.clients.clients
                        .slice(0, 50)
                        .map((client: any) => [
                            client.name || "N/A",
                            client.email || "N/A",
                            (client.appointments || 0).toString(),
                            `R$ ${(client.totalSpent || 0).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`,
                        ]);

                    autoTable(doc, {
                        startY: yPosition,
                        head: [
                            ["Nome", "Email", "Agendamentos", "Total Gasto"],
                        ],
                        body: clientsData,
                        theme: "striped",
                        headStyles: {
                            fillColor: [34, 197, 94],
                            textColor: [255, 255, 255],
                            fontStyle: "bold",
                        },
                        styles: { fontSize: 8 },
                        margin: { left: 14, right: 14 },
                    });

                    yPosition = (doc as any).lastAutoTable?.finalY
                        ? (doc as any).lastAutoTable.finalY + 10
                        : yPosition + 30;
                } else {
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        `Total de Clientes: ${reportData.clients?.total || 0}`,
                        14,
                        yPosition
                    );
                    yPosition += 6;
                    doc.text(
                        "Nenhum cliente encontrado no período.",
                        14,
                        yPosition
                    );
                    yPosition += 10;
                }
            }

            if (selectedReports.includes("services")) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Serviços", 14, yPosition);
                yPosition += 8;

                if (reportData.services && reportData.services.length > 0) {
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text("Serviços", 14, yPosition);
                    yPosition += 8;

                    const servicesData = reportData.services.map(
                        (service: any) => [
                            service.name || "N/A",
                            (service.appointmentsCount || 0).toString(),
                            `R$ ${(service.totalRevenue || 0).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`,
                            `R$ ${(service.avgPrice || 0).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`,
                        ]
                    );

                    autoTable(doc, {
                        startY: yPosition,
                        head: [
                            [
                                "Serviço",
                                "Agendamentos",
                                "Receita Total",
                                "Preço Médio",
                            ],
                        ],
                        body: servicesData,
                        theme: "striped",
                        headStyles: {
                            fillColor: [34, 197, 94],
                            textColor: [255, 255, 255],
                            fontStyle: "bold",
                        },
                        styles: { fontSize: 9 },
                        margin: { left: 14, right: 14 },
                    });

                    yPosition = (doc as any).lastAutoTable?.finalY
                        ? (doc as any).lastAutoTable.finalY + 10
                        : yPosition + 30;
                } else {
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        "Nenhum serviço encontrado no período.",
                        14,
                        yPosition
                    );
                    yPosition += 10;
                }
            }

            if (selectedReports.includes("veterinarians")) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Veterinários", 14, yPosition);
                yPosition += 8;

                if (
                    reportData.veterinarians &&
                    reportData.veterinarians.length > 0
                ) {
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text("Veterinários", 14, yPosition);
                    yPosition += 8;

                    const vetsData = reportData.veterinarians.map(
                        (vet: any) => [
                            vet.name || "N/A",
                            (vet.appointmentsCount || 0).toString(),
                            (vet.completedCount || 0).toString(),
                            (vet.cancelledCount || 0).toString(),
                            `${vet.completionRate || 0}%`,
                            `R$ ${(vet.totalRevenue || 0).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`,
                        ]
                    );

                    autoTable(doc, {
                        startY: yPosition,
                        head: [
                            [
                                "Veterinário",
                                "Total",
                                "Concluídos",
                                "Cancelados",
                                "Taxa Conclusão",
                                "Receita",
                            ],
                        ],
                        body: vetsData,
                        theme: "striped",
                        headStyles: {
                            fillColor: [34, 197, 94],
                            textColor: [255, 255, 255],
                            fontStyle: "bold",
                        },
                        styles: { fontSize: 8 },
                        margin: { left: 14, right: 14 },
                    });
                } else {
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text(
                        "Nenhum veterinário encontrado no período.",
                        14,
                        yPosition
                    );
                    yPosition += 10;
                }
            }

            if (selectedReports.includes("expenses")) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Despesas", 14, yPosition);
                yPosition += 8;
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(
                    "Funcionalidade de despesas ainda não implementada.",
                    14,
                    yPosition
                );
                yPosition += 10;
            }

            const startStr = startDate
                ? format(startDate, "dd-MM-yyyy")
                : "inicio";
            const endStr = endDate ? format(endDate, "dd-MM-yyyy") : "fim";
            const fileName = `relatorio-personalizado-${startStr}-${endStr}.pdf`;

            let pdfBlob = doc.output("blob");

            console.log("PDF gerado:", {
                blobSize: pdfBlob.size,
                blobType: pdfBlob.type,
                fileName: fileName,
            });

            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.type = "application/pdf";
            document.body.appendChild(link);

            const clickEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            link.dispatchEvent(clickEvent);

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success("Relatório gerado com sucesso!", {
                description: `O arquivo ${fileName} foi baixado.`,
            });
        } catch (error: any) {
            console.error("Erro ao gerar PDF:", error);
            toast.error("Erro ao gerar PDF", {
                description:
                    error.message || "Não foi possível gerar o arquivo PDF.",
            });
        }
    };

    const handleExportExcel = (reportData: any) => {
        try {
            const workbook = XLSX.utils.book_new();

            if (reportData.appointments && reportData.appointments.length > 0) {
                const appointmentsData = reportData.appointments.map(
                    (apt: any) => ({
                        Data: format(new Date(apt.date), "dd/MM/yyyy"),
                        Hora: apt.time || "N/A",
                        Cliente: apt.clientName || "N/A",
                        Email: apt.clientEmail || "N/A",
                        Telefone: apt.clientPhone || "N/A",
                        Pet: apt.petName || "N/A",
                        Serviço: apt.serviceName || "N/A",
                        Status: apt.status || "N/A",
                        "Método Pagamento": apt.paymentMethod || "N/A",
                        Valor: apt.servicePrice || 0,
                        Veterinário: apt.veterinarianName || "N/A",
                    })
                );
                const appointmentsSheet =
                    XLSX.utils.json_to_sheet(appointmentsData);
                XLSX.utils.book_append_sheet(
                    workbook,
                    appointmentsSheet,
                    "Agendamentos"
                );
            }

            if (reportData.revenue) {
                const revenueData = [
                    {
                        Métrica: "Receita Total",
                        Valor: reportData.revenue.totalRevenue || 0,
                    },
                    {
                        Métrica: "Total de Agendamentos",
                        Valor: reportData.revenue.totalAppointments || 0,
                    },
                    {
                        Métrica: "Clientes Únicos",
                        Valor: reportData.revenue.uniqueClients || 0,
                    },
                ];
                const revenueSheet = XLSX.utils.json_to_sheet(revenueData);
                XLSX.utils.book_append_sheet(workbook, revenueSheet, "Receita");

                if (
                    reportData.revenue.byPaymentMethod &&
                    reportData.revenue.byPaymentMethod.length > 0
                ) {
                    const paymentData = reportData.revenue.byPaymentMethod.map(
                        (pm: any) => ({
                            Método: pm.method || "N/A",
                            Valor: pm.amount || 0,
                            Quantidade: pm.count || 0,
                            Percentual: `${pm.percentage || 0}%`,
                        })
                    );
                    const paymentSheet = XLSX.utils.json_to_sheet(paymentData);
                    XLSX.utils.book_append_sheet(
                        workbook,
                        paymentSheet,
                        "Receita por Método"
                    );
                }
            }

            if (
                reportData.clients &&
                reportData.clients.clients &&
                reportData.clients.clients.length > 0
            ) {
                const clientsData = reportData.clients.clients.map(
                    (client: any) => ({
                        Nome: client.name || "N/A",
                        Email: client.email || "N/A",
                        Telefone: client.phone || "N/A",
                        Pets: (client.pets || []).join(", "),
                        Agendamentos: client.appointments || 0,
                        "Total Gasto": client.totalSpent || 0,
                        "Última Visita": client.lastVisit
                            ? format(new Date(client.lastVisit), "dd/MM/yyyy")
                            : "N/A",
                        "Primeira Visita": client.firstVisit
                            ? format(new Date(client.firstVisit), "dd/MM/yyyy")
                            : "N/A",
                    })
                );
                const clientsSheet = XLSX.utils.json_to_sheet(clientsData);
                XLSX.utils.book_append_sheet(
                    workbook,
                    clientsSheet,
                    "Clientes"
                );
            }

            if (reportData.services && reportData.services.length > 0) {
                const servicesData = reportData.services.map(
                    (service: any) => ({
                        Serviço: service.name || "N/A",
                        Agendamentos: service.appointmentsCount || 0,
                        "Receita Total": service.totalRevenue || 0,
                        "Preço Médio": service.avgPrice || 0,
                    })
                );
                const servicesSheet = XLSX.utils.json_to_sheet(servicesData);
                XLSX.utils.book_append_sheet(
                    workbook,
                    servicesSheet,
                    "Serviços"
                );
            }

            if (
                reportData.veterinarians &&
                reportData.veterinarians.length > 0
            ) {
                const vetsData = reportData.veterinarians.map((vet: any) => ({
                    Veterinário: vet.name || "N/A",
                    "Total Agendamentos": vet.appointmentsCount || 0,
                    Concluídos: vet.completedCount || 0,
                    Cancelados: vet.cancelledCount || 0,
                    "Taxa de Conclusão": `${vet.completionRate || 0}%`,
                    "Receita Total": vet.totalRevenue || 0,
                }));
                const vetsSheet = XLSX.utils.json_to_sheet(vetsData);
                XLSX.utils.book_append_sheet(
                    workbook,
                    vetsSheet,
                    "Veterinários"
                );
            }

            const startStr = startDate
                ? format(startDate, "dd-MM-yyyy")
                : "inicio";
            const endStr = endDate ? format(endDate, "dd-MM-yyyy") : "fim";
            const fileName = `relatorio-personalizado-${startStr}-${endStr}.xlsx`;

            XLSX.writeFile(workbook, fileName);

            toast.success("Relatório gerado com sucesso!", {
                description: `O arquivo ${fileName} foi baixado.`,
            });
        } catch (error: any) {
            console.error("Erro ao gerar Excel:", error);
            toast.error("Erro ao gerar Excel", {
                description:
                    error.message || "Não foi possível gerar o arquivo Excel.",
            });
        }
    };

    const handleConfirmExport = () => {
        generateReportMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-white border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/dashboard-clinica")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Gerar Relatório Personalizado
                            </h1>
                            <p className="text-sm text-vet-neutral">
                                Configure e gere relatórios customizados
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {}
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
                                                !startDate &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {startDate
                                                ? format(startDate, "PPP", {
                                                      locale: ptBR,
                                                  })
                                                : "Selecione a data"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
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
                                                !endDate &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {endDate
                                                ? format(endDate, "PPP", {
                                                      locale: ptBR,
                                                  })
                                                : "Selecione a data"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
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

                    {}
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
                                        checked={selectedReports.includes(
                                            report.id
                                        )}
                                        onCheckedChange={() =>
                                            toggleReport(report.id)
                                        }
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground">
                                            {report.label}
                                        </h4>
                                        <p className="text-sm text-vet-neutral mt-1">
                                            {report.description}
                                        </p>
                                    </div>
                                    {selectedReports.includes(report.id) && (
                                        <CheckCircle2 className="h-5 w-5 text-vet-success" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {}
                    <Card className="p-6 bg-white/80 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-foreground mb-4">
                            Resumo
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-vet-neutral">
                                    Período:
                                </span>
                                <span className="font-medium text-foreground">
                                    {startDate && endDate
                                        ? `${format(
                                              startDate,
                                              "dd/MM/yyyy"
                                          )} - ${format(endDate, "dd/MM/yyyy")}`
                                        : "Não definido"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-vet-neutral">
                                    Relatórios selecionados:
                                </span>
                                <span className="font-medium text-foreground">
                                    {selectedReports.length}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Label>Formato de Exportação</Label>
                            <div className="flex gap-4">
                                <Button
                                    variant={
                                        exportFormat === "pdf"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setExportFormat("pdf")}
                                    className="flex-1"
                                >
                                    PDF
                                </Button>
                                <Button
                                    variant={
                                        exportFormat === "excel"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setExportFormat("excel")}
                                    className="flex-1"
                                >
                                    Excel
                                </Button>
                            </div>
                        </div>

                        <Button
                            variant="vet"
                            className="w-full mt-6"
                            disabled={
                                !startDate ||
                                !endDate ||
                                selectedReports.length === 0 ||
                                generateReportMutation.isPending
                            }
                            onClick={handleGenerate}
                        >
                            {generateReportMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Gerando...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Gerar e Baixar Relatório
                                </>
                            )}
                        </Button>
                    </Card>
                </div>
            </div>

            {}
            <AlertDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Confirmar Geração de Relatório
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Você está prestes a gerar um relatório personalizado
                            no formato {exportFormat.toUpperCase()} com os
                            seguintes dados:
                            <br />
                            <br />
                            <strong>Período:</strong>{" "}
                            {startDate && endDate
                                ? `${format(
                                      startDate,
                                      "dd/MM/yyyy"
                                  )} - ${format(endDate, "dd/MM/yyyy")}`
                                : "Não definido"}
                            <br />
                            <strong>Tipos selecionados:</strong>{" "}
                            {selectedReports.length} tipo(s)
                            <br />
                            <strong>Formato:</strong>{" "}
                            {exportFormat.toUpperCase()}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmExport}>
                            Gerar Relatório
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default GenerateReport;
