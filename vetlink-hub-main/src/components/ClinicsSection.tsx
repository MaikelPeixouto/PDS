import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ClinicCard from "./ClinicCard";
import clinic1 from "@/assets/clinic-1.jpg";
import api from "@/services/api";

interface ClinicsSectionProps {
  searchResults?: any[] | null;
  isSearchMode?: boolean;
  onViewAll?: () => void;
}

const ClinicsSection = ({ searchResults, isSearchMode = false, onViewAll }: ClinicsSectionProps) => {
  const [allClinics, setAllClinics] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const { data: defaultClinics = [], isLoading: isLoadingDefault } = useQuery({
    queryKey: ['clinics', 'default'],
    queryFn: async () => {
      const clinics = await api.getClinics({ limit: 10 });
      return clinics;
    },
    enabled: !isSearchMode,
  });

  const handleViewAllClick = async () => {
    if (isSearchMode && onViewAll) {
      setIsLoadingAll(true);
      try {
        const clinics = await api.getClinics({ limit: 100 });
        setAllClinics(clinics);
        if (onViewAll) {
          onViewAll();
        }
      } catch (error) {
        console.error('Error loading all clinics:', error);
      } finally {
        setIsLoadingAll(false);
      }
    } else if (onViewAll) {
      onViewAll();
    }
  };

  const formatClinicForCard = (clinic: any) => {
    return {
      id: clinic.id || clinic.place_id || `clinic-${Math.random()}`,
      name: clinic.name,
      rating: clinic.rating || 0,
      reviews: clinic.total_reviews || clinic.user_ratings_total || 0,
      distance: clinic.distance || "N/A",
      address: clinic.address || clinic.vicinity || "Endereço não disponível",
      phone: clinic.phone || "Telefone não disponível",
      openUntil: clinic.hours || "Horário não disponível",
      specialties: clinic.specialties || [],
      image: clinic.photo_url || clinic1,
      isOpen: clinic.is_open !== undefined ? clinic.is_open : true,
      isRegistered: clinic.isRegistered !== undefined ? clinic.isRegistered : true
    };
  };

  const clinicsToShow = isSearchMode && searchResults
    ? searchResults.map(formatClinicForCard)
    : isSearchMode && allClinics.length > 0
    ? allClinics.map(formatClinicForCard)
    : defaultClinics.map(formatClinicForCard);

  return (
    <section id="clinics-section" className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-foreground">
            {isSearchMode ? "Resultados da busca" : "Clínicas veterinárias próximas a você"}
          </h2>
          <p className="text-xl text-vet-neutral">
            {isSearchMode ? "Clínicas encontradas na região" : "Encontre os melhores profissionais da sua região"}
          </p>
        </div>

        {isLoadingDefault && !isSearchMode ? (
          <div className="text-center py-12">
            <p className="text-vet-neutral text-lg">Carregando clínicas...</p>
          </div>
        ) : clinicsToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-vet-neutral text-lg">Nenhuma clínica encontrada</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clinicsToShow.map((clinic, index) => (
              <ClinicCard key={clinic.id || index} {...clinic} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={handleViewAllClick}
            disabled={isLoadingAll}
            className="text-vet-primary hover:text-vet-secondary font-semibold text-lg hover:underline transition-colors disabled:opacity-50"
          >
            {isLoadingAll ? "Carregando..." : isSearchMode ? "Ver todas as clínicas cadastradas →" : "Ver todas as clínicas →"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClinicsSection;
