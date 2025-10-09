import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { authService, AuthUser } from "@/lib/auth";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser && currentUser.role === 'admin') {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user && user.role === 'admin') {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const { user: authUser, error } = await authService.login({
        email,
        password
      });

      if (error) {
        setError(error);
      } else if (authUser && authUser.role === 'admin') {
        setUser(authUser);
        setIsAuthenticated(true);
      } else {
        setError("Anda tidak memiliki akses admin!");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <AdminLogin 
      onLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
};

export default Admin;
