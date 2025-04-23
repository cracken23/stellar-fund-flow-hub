
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  accountNumber: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("bankEaseUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("bankEaseUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      // For demo, we'll use mock users from localStorage or create default ones
      
      // In development - create mock users if they don't exist
      let users = JSON.parse(localStorage.getItem("bankEaseUsers") || "[]");
      
      if (users.length === 0) {
        // Create default users if none exist
        users = [
          {
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            password: "password123",
            role: "user" as const,
            accountNumber: "10000001",
            balance: 5000.00,
          },
          {
            id: "2",
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            role: "admin" as const,
            accountNumber: "10000002",
            balance: 10000.00,
          }
        ];
        localStorage.setItem("bankEaseUsers", JSON.stringify(users));
      }
      
      // Find user with matching credentials
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Remove password before storing in state
      const { password: _, ...safeUser } = foundUser;
      
      // Ensure the role is properly typed
      const typedUser = {
        ...safeUser,
        role: safeUser.role as "user" | "admin"
      };
      
      setUser(typedUser);
      localStorage.setItem("bankEaseUser", JSON.stringify(typedUser));
      
      toast.success("Login successful!");
      
      // Redirect based on role
      if (typedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register the user
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem("bankEaseUsers") || "[]");
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "user" as const,
        accountNumber: `1000${(10000 + users.length).toString().slice(1)}`,
        balance: 1000.00, // Default starting balance
      };
      
      // Add to users list
      users.push(newUser);
      localStorage.setItem("bankEaseUsers", JSON.stringify(users));
      
      // Remove password before storing in state
      const { password: _, ...safeUser } = newUser;
      
      setUser(safeUser);
      localStorage.setItem("bankEaseUser", JSON.stringify(safeUser));
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bankEaseUser");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
