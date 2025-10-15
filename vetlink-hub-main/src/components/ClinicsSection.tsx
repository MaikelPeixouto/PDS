import ClinicCard from "./ClinicCard";
import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";

const clinics = [
  {
    name: "Clínica Veterinária PetCare",
    rating: 4.9,
    reviews: 127,
    distance: "1.2 km",
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    phone: "(11) 9999-8888",
    openUntil: "22:00",
    specialties: ["Clínica Geral", "Cirurgia", "Emergência 24h"],
    image: clinic1,
    isOpen: true
  },
  {
    name: "Hospital Veterinário AnimalCare",
    rating: 4.8,
    reviews: 98,
    distance: "2.1 km",
    address: "Av. Principal, 456 - Jardins, São Paulo - SP",
    phone: "(11) 8888-7777",
    openUntil: "18:00",
    specialties: ["Cardiologia", "Dermatologia", "Oftalmologia"],
    image: clinic2,
    isOpen: true
  },
  {
    name: "Centro Veterinário Vida Animal",
    rating: 4.7,
    reviews: 156,
    distance: "3.5 km",
    address: "Rua Verde, 789 - Vila Nova, São Paulo - SP",
    phone: "(11) 7777-6666",
    openUntil: "20:00",
    specialties: ["Oncologia", "Neurologia", "Fisioterapia"],
    image: clinic3,
    isOpen: false
  }
];

const ClinicsSection = () => {
  return (
    <section className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-foreground">
            Clínicas veterinárias próximas a você
          </h2>
          <p className="text-xl text-vet-neutral">
            Encontre os melhores profissionais da sua região
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clinics.map((clinic, index) => (
            <ClinicCard key={index} {...clinic} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="text-vet-primary hover:text-vet-secondary font-semibold text-lg hover:underline transition-colors">
            Ver todas as clínicas →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClinicsSection;