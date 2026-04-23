import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true for initialization
  const [error, setError] = useState<string | null>(null);

  // Initialize by checking if user is logged in (via cookies)
  useEffect(() => {
    console.log('AuthContext initializing...');
    const initializeAuth = async () => {
      try {
        // Try to fetch current user - if cookies exist, browser will send them automatically
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/me`,
          {
            method: "GET",
            credentials: "include", // Include cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('User authenticated via cookies:', data.user);
          setUser(data.user);
          setToken("authenticated"); // Marker that we're authenticated
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false); // Done initializing
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
        {
          method: "POST",
          credentials: "include", // IMPORTANT: Include cookies in request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      

      const data = await response.json();
 

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log('Login successful, cookie set by server');
      setUser(data.user);
      setToken("authenticated"); // Token stored in httpOnly cookie by server
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Signup attempt for:', email);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/signup`,
        {
          method: "POST",
          credentials: "include", // IMPORTANT: Include cookies in request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();
      console.log('Signup response:', { ok: response.ok, status: response.status });

      if (!response.ok) {
        throw new Error(data.message || `Signup failed with status ${response.status}`);
      }

      console.log('User created successfully, cookie set by server');
      setUser(data.user);
      setToken("authenticated"); // Token stored in httpOnly cookie by server
      console.log('Authenticated via cookie');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      console.error('Signup error:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend to clear cookie
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless
      setUser(null);
      setToken(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
