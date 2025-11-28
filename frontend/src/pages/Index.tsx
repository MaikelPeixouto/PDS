import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ClinicsSection from "@/components/ClinicsSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchName, setSearchName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleNameSearch = async () => {
    if (!searchName.trim()) return;

    setIsSearching(true);
    try {
      // Use the existing api service which handles base URL and auth
      const response = await import("@/services/api").then(m => m.default.getClinics({ limit: 100 })); // Fetch all to filter client-side or add search param to getClinics

      // Since we implemented search param in backend, let's use it.
      // But api.getClinics doesn't support search param yet in the interface defined in api.ts
      // We need to update api.ts to support search param, or use direct fetch with relative path

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/clinics?search=${encodeURIComponent(searchName)}`);
      const data = await res.json();

      if (data.success) {
        setSearchResults(data.data);
        setIsSearchMode(true);
      }
    } catch (error) {
      console.error("Error searching clinics:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setIsSearchMode(true);
  };

  const handleViewAllClinics = () => {
    setSearchResults(null);
    setIsSearchMode(false);
    setSearchName("");
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Search Bar Section */}
      <div className="bg-vet-primary/5 py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-border/50 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-vet-neutral mb-1 block">Buscar por nome</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o nome da clínica..."
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSearch()}
                  />
                  <button
                    onClick={handleNameSearch}
                    disabled={isSearching}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-vet-primary text-primary-foreground hover:bg-vet-primary/90 h-10 px-4 py-2"
                  >
                    {isSearching ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              </div>
              <div className="hidden md:block w-px bg-border mx-2"></div>
              <div className="flex-1">
                {/* Existing location search is inside HeroSection, ideally we would unify them but for now adding name search above */}
                <p className="text-sm text-vet-neutral mb-2">Ou busque por localização abaixo 👇</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroSection onSearchResults={handleSearchResults} />
      <FeaturesSection />
      <ClinicsSection
        searchResults={searchResults}
        isSearchMode={isSearchMode}
        onViewAll={handleViewAllClinics}
      />
      <Footer />
    </div>
  );
};

export default Index;
