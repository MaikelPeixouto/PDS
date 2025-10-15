import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star } from "lucide-react";
import heroImage from "@/assets/hero-vet.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-vet-primary/5 to-vet-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Encontre a melhor
                <span className="bg-gradient-to-r from-vet-primary to-vet-secondary bg-clip-text text-transparent">
                  {" "}clínica veterinária{" "}
                </span>
                para seu pet
              </h1>
              <p className="text-xl text-vet-neutral leading-relaxed">
                Conectamos você aos melhores profissionais veterinários da sua região. 
                Agende consultas, gerencie a saúde do seu pet e tenha tudo em um só lugar.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Buscar clínicas próximas
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vet-neutral h-5 w-5" />
                    <Input 
                      placeholder="Digite sua cidade ou CEP" 
                      className="pl-10 h-12 border-border/50 focus:border-vet-primary"
                    />
                  </div>
                  <Button variant="vet" size="lg" className="h-12 px-8">
                    <Search className="h-5 w-5 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-vet-neutral">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-vet-accent text-vet-accent" />
                  ))}
                </div>
                <span>4.9/5 avaliação média</span>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-vet-primary">500+</div>
                <div>Clínicas parceiras</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-vet-primary">10k+</div>
                <div>Pets cadastrados</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Veterinário cuidando de um pet" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="bg-vet-accent/10 p-3 rounded-xl">
                  <div className="text-2xl">🐕</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Próxima consulta</div>
                  <div className="text-sm text-vet-neutral">Zeus - Checkup</div>
                  <div className="text-sm text-vet-primary font-medium">Hoje, 15:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;