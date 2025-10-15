import { Calendar, PawPrint, MapPin, Shield, Clock, Heart } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Encontre clínicas próximas",
    description: "Localize as melhores clínicas veterinárias na sua região com base na localização e avaliações.",
    color: "from-vet-primary to-vet-primary-light"
  },
  {
    icon: Calendar,
    title: "Agendamento online",
    description: "Agende consultas diretamente pelo app sem precisar ligar. Escolha data, horário e especialista.",
    color: "from-vet-secondary to-blue-400"
  },
  {
    icon: PawPrint,
    title: "Perfil do seu pet",
    description: "Mantenha todo histórico médico, vacinas e informações importantes do seu pet organizados.",
    color: "from-vet-accent to-vet-warm"
  },
  {
    icon: Shield,
    title: "Profissionais verificados",
    description: "Todos os veterinários são verificados e credenciados pelo CRMV para sua segurança.",
    color: "from-green-500 to-emerald-400"
  },
  {
    icon: Clock,
    title: "Horários flexíveis",
    description: "Encontre clínicas com atendimento 24h, fins de semana e emergências veterinárias.",
    color: "from-purple-500 to-violet-400"
  },
  {
    icon: Heart,
    title: "Cuidado especializado",
    description: "Conecte-se com especialistas em diferentes áreas: cardiologia, dermatologia, cirurgia e mais.",
    color: "from-pink-500 to-rose-400"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-vet-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Tudo que você precisa para
            <span className="bg-gradient-to-r from-vet-primary to-vet-secondary bg-clip-text text-transparent">
              {" "}cuidar do seu pet
            </span>
          </h2>
          <p className="text-xl text-vet-neutral max-w-3xl mx-auto">
            Uma plataforma completa que conecta donos de pets com os melhores profissionais veterinários
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-full w-full text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-vet-neutral leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;