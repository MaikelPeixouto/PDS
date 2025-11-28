import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-vet.jpg";
import api from "@/services/api";
import { getUserLocation } from "@/services/googleMapsService";

interface HeroSectionProps {
  onSearchResults?: (results: any[]) => void;
}

const HeroSection = ({ onSearchResults }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const performSearch = async (latitude: number, longitude: number) => {
    setIsSearching(true);
    try {
      // Import Google Maps service functions
      const { searchNearbyVeterinaryClinics, calculateDistance } = await import('@/services/googleMapsService');

      // Search both database clinics and Google Places in parallel
      const [dbResponse, googleClinics] = await Promise.all([
        api.searchClinicsByLocation(latitude, longitude, 10, 20).catch(() => ({ data: [] })),
        searchNearbyVeterinaryClinics(latitude, longitude, 5000).catch(() => [])
      ]);

      // Extract clinics array from response (handle both array and {data: []} formats)
      const dbClinics = Array.isArray(dbResponse) ? dbResponse : (dbResponse?.data || []);

      // Add distance to database clinics
      const dbClinicsWithDistance = dbClinics.map((clinic: any) => ({
        ...clinic,
        isRegistered: true,
        distance: calculateDistance(latitude, longitude, clinic.latitude || 0, clinic.longitude || 0)
      }));

      // Add distance to Google clinics  
      const googleClinicsWithDistance = googleClinics.map(clinic => ({
        ...clinic,
        distance: calculateDistance(latitude, longitude, clinic.latitude, clinic.longitude)
      }));

      // Merge and sort by distance
      const allClinics = [...dbClinicsWithDistance, ...googleClinicsWithDistance];
      const sortedClinics = allClinics.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      if (sortedClinics.length === 0) {
        toast.info("Nenhuma clínica encontrada nesta região");
      } else {
        const dbCount = dbClinicsWithDistance.length;
        const googleCount = googleClinicsWithDistance.length;
        toast.success(`${sortedClinics.length} clínica(s) encontrada(s) (${dbCount} cadastradas + ${googleCount} do Google)`);
      }

      if (onSearchResults) {
        onSearchResults(sortedClinics);
      }

      setTimeout(() => {
        const clinicsSection = document.getElementById('clinics-section');
        if (clinicsSection) {
          clinicsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error: any) {
      console.error('Error searching clinics:', error);
      toast.error(error.message || "Erro ao buscar clínicas");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseMyLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { latitude, longitude } = await getUserLocation();
      toast.success("Localização obtida com sucesso!");
      await performSearch(latitude, longitude);
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast.error(error.message || "Erro ao obter localização");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Por favor, digite um CEP");
      return;
    }

    setIsSearching(true);
    try {
      const cleanQuery = searchQuery.replace(/\D/g, '');

      if (cleanQuery.length === 8) {
        try {
          // Use frontend geocoding service instead of backend API
          const { getCoordinatesFromCep } = await import('@/services/googleMapsService');
          const coordinates = await getCoordinatesFromCep(cleanQuery);

          if (!coordinates) {
            toast.error("CEP não encontrado ou inválido");
            setIsSearching(false);
            return;
          }

          const { latitude, longitude } = coordinates;
          await performSearch(latitude, longitude);
        } catch (cepError) {
          console.error('CEP Error:', cepError);
          toast.error("Erro ao buscar CEP");
          setIsSearching(false);
        }
      } else {
        toast.error("Por favor, digite um CEP válido (8 dígitos)");
        setIsSearching(false);
      }
    } catch (error: any) {
      console.error('Error searching clinics:', error);
      toast.error(error.message || "Erro ao buscar clínicas");
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
                      placeholder="Digite seu CEP"
                      className="pl-10 h-12 border-border/50 focus:border-vet-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isSearching || isGettingLocation}
                    />
                  </div>
                  <Button
                    variant="vet"
                    size="lg"
                    className="h-12 px-8"
                    onClick={handleSearch}
                    disabled={isSearching || isGettingLocation}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/30"></div>
                  <span className="text-xs text-vet-neutral">ou</span>
                  <div className="flex-1 h-px bg-border/30"></div>
                </div>

                <Button
                  variant="vetOutline"
                  size="lg"
                  className="w-full h-12"
                  onClick={handleUseMyLocation}
                  disabled={isSearching || isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Obtendo localização...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-5 w-5 mr-2" />
                      Usar minha localização
                    </>
                  )}
                </Button>
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
