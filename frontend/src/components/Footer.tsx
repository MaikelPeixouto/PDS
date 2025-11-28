import { PawPrint, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-vet-primary to-vet-secondary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <PawPrint className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">VetFinder</h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              Conectando pets e donos aos melhores profissionais veterinários. 
              Cuidado com amor e profissionalismo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Para Donos de Pets</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Buscar Clínicas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Agendar Consulta</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cadastrar Pet</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Histórico Médico</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Emergência 24h</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Para Clínicas</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Cadastre sua Clínica</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Planos e Preços</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Painel de Gestão</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suporte Técnico</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>São Paulo, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span>(11) 0000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>contato@vetfinder.com.br</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 VetFinder. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;