import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('userRole') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const currentRole = localStorage.getItem('userRole');
    if (currentRole) {
      try {
        const res = await api.get(`/${currentRole}/profile`);
        setUser(res.data.payload || res.data);
        setRole(currentRole);
      } catch (error) {
        console.error('Session initialization failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProfile();
  }, []);

  const loginUser = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { accessToken, role: userRole } = res.data.payload;
    
    // Store core info
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userRole', userRole);
    setRole(userRole);
    
    // Fetch profile immediately after login
    const profileRes = await api.get(`/${userRole}/profile`);
    setUser(profileRes.data.payload || profileRes.data);
    
    return { role: userRole };
  };

  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    setRole(null);
    setUser(null);
  };

  const updateUserProfile = async (newData) => {
    if (!role) return;
    try {
      const res = await api.put(`/${role}/profile`, newData);
      // Update local state after successful PUT
      setUser((prev) => ({ ...prev, ...newData }));
      return res.data;
    } catch (error) {
      console.error('Failed to update profile', error);
      throw error;
    }
  };

  // We should only export what's needed
  return (
    <AuthContext.Provider value={{ role, user, loginUser, logout, updateUserProfile, loading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
