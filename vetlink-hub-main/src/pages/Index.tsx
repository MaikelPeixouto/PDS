import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ClinicsSection from "@/components/ClinicsSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setIsSearchMode(true);
  };

  const handleViewAllClinics = () => {
    setSearchResults(null);
    setIsSearchMode(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
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
