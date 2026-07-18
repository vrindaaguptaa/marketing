import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <div className="min-h-screen grid place-items-center text-slate-600">Loading your account…</div>; if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />; if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />; return <>{children}</>; }
