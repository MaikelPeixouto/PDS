import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Camera, 
  FileText,
  CreditCard,
  BarChart3,
  Shield
} from "lucide-react";

const ForClinics = () => {
  const { toast } = useToast();

  const handleClinicRegistration = () => {
    toast({
      title: "Redirecionando...",
      description: "Você será direcionado para o dashboard da clínica",
    });
    
    setTimeout(() => {
      window.location.href = '/dashboard-clinica';
    }, 1000);
  };
  const plans = [
    {
      name: "Básico",
      price: "R$ 97",
      period: "/mês",
      features: [
        "Até 500 agendamentos/mês",
        "Perfil da clínica",
        "Calendário básico",
        "Suporte por email",
        "Dashboard básico"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 197",
      period: "/mês",
      features: [
        "Agendamentos ilimitados",
        "Múltiplos veterinários",
        "Histórico médico digital",
        "Lembretes automáticos",
        "Relatórios avançados",
        "Suporte prioritário",
        "Integração WhatsApp"
      ],
      popular: true
    },
    {
      name: "Clínica Premium",
      price: "R$ 397",
      period: "/mês",
      features: [
        "Tudo do Profissional",
        "Múltiplas unidades",
        "API personalizada",
        "Gestão financeira",
        "Telemedicina",
        "Suporte 24/7",
        "Treinamento incluído"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Mais de 10.000 clientes",
      description: "Conecte-se com donos de pets ativos na sua região"
    },
    {
      icon: Calendar,
      title: "Gestão completa",
      description: "Agenda, prontuários e lembretes automáticos"
    },
    {
      icon: BarChart3,
      title: "Relatórios inteligentes",
      description: "Acompanhe o crescimento da sua clínica"
    },
    {
      icon: Shield,
      title: "Segurança total",
      description: "Dados protegidos com criptografia de ponta"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {}
      <section className="py-20 bg-gradient-to-br from-vet-primary/10 via-background to-vet-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Faça sua clínica veterinária
              <span className="bg-gradient-to-r from-vet-primary to-vet-secondary bg-clip-text text-transparent">
                {" "}crescer
              </span>
            </h1>
            <p className="text-xl text-vet-neutral mb-8 leading-relaxed">
              Conecte-se com milhares de donos de pets, gerencie agendamentos e 
              digitalize sua clínica com nossa plataforma completa
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="vet" size="lg" className="text-lg px-8">
                <Building2 className="h-5 w-5 mr-2" />
                Cadastrar Clínica Grátis
              </Button>
              <Button variant="vetOutline" size="lg" className="text-lg px-8">
                Ver Demonstração
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl mb-3 mx-auto w-fit">
                      <Icon className="h-8 w-8 text-vet-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-vet-neutral">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Cadastre sua clínica em poucos minutos
              </h2>
              <p className="text-xl text-vet-neutral">
                Preencha os dados e comece a receber novos clientes hoje mesmo
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-border/50">
                <h3 className="text-2xl font-bold text-foreground mb-6">Dados da Clínica</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="clinicName">Nome da clínica *</Label>
                    <Input placeholder="Ex: Clínica Veterinária PetCare" className="focus:border-vet-primary" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input placeholder="00.000.000/0000-00" className="focus:border-vet-primary" />
                    </div>
                    <div>
                      <Label htmlFor="crmv">CRMV *</Label>
                      <Input placeholder="Ex: CRMV-SP 12345" className="focus:border-vet-primary" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço completo *</Label>
                    <Input placeholder="Rua, número, bairro, cidade, CEP" className="focus:border-vet-primary" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input placeholder="(11) 99999-9999" className="focus:border-vet-primary" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input type="email" placeholder="contato@clinica.com.br" className="focus:border-vet-primary" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialties">Especialidades</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione as especialidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Clínica Geral</SelectItem>
                        <SelectItem value="cirurgia">Cirurgia</SelectItem>
                        <SelectItem value="cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="dermatologia">Dermatologia</SelectItem>
                        <SelectItem value="oftalmologia">Oftalmologia</SelectItem>
                        <SelectItem value="emergencia">Emergência 24h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição da clínica</Label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 border border-border rounded-md focus:border-vet-primary focus:outline-none resize-none"
                      placeholder="Conte um pouco sobre sua clínica, diferenciais e serviços..."
                    />
                  </div>

                  <Button variant="vet" size="lg" className="w-full" onClick={handleClinicRegistration}>
                    <Camera className="h-5 w-5 mr-2" />
                    Cadastrar Clínica
                  </Button>
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-vet-primary/10 to-vet-secondary/10 border-border/50">
                  <h3 className="text-xl font-bold text-foreground mb-4">Por que escolher o VetFinder?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-vet-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Aumento de 40% nos agendamentos</p>
                        <p className="text-sm text-vet-neutral">Clínicas parceiras reportam crescimento significativo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-vet-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Gestão digital completa</p>
                        <p className="text-sm text-vet-neutral">Agenda, prontuários e financeiro em um só lugar</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-vet-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Suporte especializado</p>
                        <p className="text-sm text-vet-neutral">Equipe dedicada para clínicas veterinárias</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-vet-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Sem taxa de setup</p>
                        <p className="text-sm text-vet-neutral">Comece sem custos iniciais ou taxas de configuração</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
                  <h3 className="text-xl font-bold text-foreground mb-4">Próximos Passos</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vet-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <span className="text-foreground">Cadastro da clínica (2 min)</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vet-secondary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <span className="text-foreground">Verificação dos documentos (24h)</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vet-accent text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <span className="text-foreground">Configuração do perfil</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vet-warm text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <span className="text-foreground">Primeiro agendamento! 🎉</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-gradient-to-b from-background to-vet-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Escolha o plano ideal para sua clínica
              </h2>
              <p className="text-xl text-vet-neutral">
                Todos os planos incluem 30 dias de teste grátis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`p-8 text-center relative ${
                    plan.popular 
                      ? 'border-2 border-vet-primary bg-white shadow-xl scale-105' 
                      : 'bg-white/80 backdrop-blur-sm border-border/50'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-vet-primary text-white">
                      Mais Popular
                    </Badge>
                  )}
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-vet-primary">{plan.price}</span>
                    <span className="text-vet-neutral">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-vet-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-vet-neutral">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.popular ? "vet" : "vetOutline"} 
                    size="lg" 
                    className="w-full"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Começar Agora
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForClinics;