import { Button } from "@/components/ui/button";
import { Search, Calendar, PawPrint, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";

const Header = () => {
  const { user, isLoggedIn } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-vet-primary to-vet-secondary p-2 rounded-xl">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">VetFinder</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-vet-neutral hover:text-vet-primary transition-colors">
              <Search className="h-4 w-4" />
              Buscar Clínicas
            </Link>
            <Link to="/agendar" className="flex items-center gap-2 text-vet-neutral hover:text-vet-primary transition-colors">
              <Calendar className="h-4 w-4" />
              Agendar
            </Link>
            <Link to="/meus-pets" className="flex items-center gap-2 text-vet-neutral hover:text-vet-primary transition-colors">
              <PawPrint className="h-4 w-4" />
              Meus Pets
            </Link>
            <Link to="/para-clinicas" className="flex items-center gap-2 text-vet-neutral hover:text-vet-primary transition-colors">
              <Building2 className="h-4 w-4" />
              Para Clínicas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <UserMenu
                userType={user.type}
                userName={user.name}
                userEmail={user.email}
                avatarUrl={user.avatar}
              />
            ) : (
              <>
                <Button variant="vetOutline" size="sm" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button variant="vet" size="sm" asChild>
                  <Link to="/registro">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;