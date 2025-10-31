import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  avatar?: string;
  type: "tutor" | "clinic";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, userType: "tutor" | "clinic") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (email: string, password: string, userType: "tutor" | "clinic") => {
    // Mock de dados do usuário (será substituído por autenticação real depois)
    const mockUsers = {
      tutor: {
        name: "João Silva",
        email: email,
        avatar: undefined,
        type: "tutor" as const,
      },
      clinic: {
        name: "Clínica VetCare",
        email: email,
        avatar: undefined,
        type: "clinic" as const,
      },
    };

    setUser(mockUsers[userType]);
    
    // Redireciona para a página apropriada
    if (userType === "clinic") {
      navigate("/dashboard-clinica");
    } else {
      navigate("/meus-pets");
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
