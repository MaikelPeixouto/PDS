import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  type: "tutor" | "clinic";
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: "tutor" | "clinic") => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    cpf?: string;
  }) => Promise<void>;
  registerClinic: (data: {
    email: string;
    password: string;
    name: string;
    cnpj: string;
    phone?: string;
    address?: string;
    description?: string;
    hours?: string;
    specialties?: string[];
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.getMe();
          if (response.success && response.data) {
            const userData = response.data.user || response.data.clinic;
            const userType = response.data.type === 'user' ? 'tutor' : 'clinic';

            setUser({
              id: userData.id,
              name: userData.first_name && userData.last_name
                ? `${userData.first_name} ${userData.last_name}`
                : userData.name || userData.email,
              email: userData.email,
              avatar: userData.avatar,
              type: userType,
              ...userData,
            });
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, userType: "tutor" | "clinic") => {
    try {
      const apiUserType = userType === "tutor" ? "user" : "clinic";
      const response = await api.login(email, password, apiUserType);

      if (response.success && response.data) {
        const userData = response.data.user || response.data.clinic;
        const finalUserType = userType;

        setUser({
          id: userData.id,
          name: userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : userData.name || userData.email,
          email: userData.email,
          avatar: userData.avatar,
          type: finalUserType,
          ...userData,
        });

        if (userType === "clinic") {
          navigate("/dashboard-clinica");
        } else {
          navigate("/meus-pets");
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const registerUser = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    cpf?: string;
  }) => {
    try {
      const response = await api.registerUser(data);

      if (response.success && response.data) {
        const userData = response.data.user;

        setUser({
          id: userData.id,
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          type: "tutor",
          ...userData,
        });

        navigate("/meus-pets");
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  };

  const registerClinic = async (data: {
    email: string;
    password: string;
    name: string;
    cnpj: string;
    phone?: string;
    address?: string;
    description?: string;
    hours?: string;
    specialties?: string[];
  }) => {
    try {
      const response = await api.registerClinic(data);

      if (response.success && response.data) {
        const clinicData = response.data.clinic;

        setUser({
          id: clinicData.id,
          name: clinicData.name,
          email: clinicData.email,
          type: "clinic",
          ...clinicData,
        });

        navigate("/dashboard-clinica");
      }
    } catch (error: any) {
      console.error('Register clinic error:', error);
      throw new Error(error.message || 'Erro ao criar conta da clínica');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      login,
      logout,
      registerUser,
      registerClinic,
    }}>
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
