import { createContext, useContext, useEffect, useState } from 'react';
import { authMe, logout as apiLogout } from './api';

export type AuthUser = { id: string; name: string; email: string; role: 'user' | 'admin'; createdAt?: string };
type AuthContextValue = { user: AuthUser | null; loading: boolean; setUser: (user: AuthUser | null) => void; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { authMe().then((result) => setUser(result.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const logout = async () => { await apiLogout().catch(() => undefined); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, setUser, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; };
