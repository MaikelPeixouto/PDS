import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { setAuthErrorHandler } from "./services/api";
import { toast } from "sonner";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import MyPets from "./pages/MyPets";
import Vaccines from "./pages/Vaccines";
import PetHistory from "./pages/PetHistory";
import MedicalRecord from "./pages/MedicalRecord";
import ForClinics from "./pages/ForClinics";
import ClinicDashboard from "./pages/ClinicDashboard";
import ClinicDetails from "./pages/ClinicDetails";
import ClinicNotifications from "./pages/ClinicNotifications";
import ClinicSettings from "./pages/ClinicSettings";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MonthlyReport from "./pages/reports/MonthlyReport";
import ClientsReport from "./pages/reports/ClientsReport";
import FinancialReport from "./pages/reports/FinancialReport";
import GenerateReport from "./pages/reports/GenerateReport";

const queryClient = new QueryClient();

setAuthErrorHandler((message: string) => {
  toast.error(message, {
    duration: 5000,
  });
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agendar" element={<Schedule />} />
            <Route path="/meus-pets" element={<MyPets />} />
            <Route path="/vacinas" element={<Vaccines />} />
            <Route path="/historico" element={<PetHistory />} />
            <Route path="/prontuario" element={<MedicalRecord />} />
            <Route path="/para-clinicas" element={<ForClinics />} />
            <Route path="/dashboard-clinica" element={<ClinicDashboard />} />
            <Route path="/clinica/:id" element={<ClinicDetails />} />
            <Route path="/clinica/notificacoes" element={<ClinicNotifications />} />
            <Route path="/clinica/configuracoes" element={<ClinicSettings />} />
            <Route path="/visao-geral" element={<Overview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/relatorios/mensal" element={<MonthlyReport />} />
            <Route path="/relatorios/clientes" element={<ClientsReport />} />
            <Route path="/relatorios/financeiro" element={<FinancialReport />} />
            <Route path="/relatorios/gerar" element={<GenerateReport />} />
            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
