import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { hasRouteAccess, getAllowedRoutes } from '@/constants/roles';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export const AppIndexRedirect: React.FC = () => {
  const { role } = useRole();
  const defaultRoute = role === 'SUPPLIER_QA' ? '/app/reports' : '/app/live-inspection';
  return <Navigate to={defaultRoute} replace />;
};

export const RequireRole: React.FC = () => {
  const { role, user, isAuthenticated } = useRole();
  const location = useLocation();

  if (!isAuthenticated || !user || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle direct navigation to root /app or /app/
  if (location.pathname === '/app' || location.pathname === '/app/') {
    const defaultRoute = role === 'SUPPLIER_QA' ? '/app/reports' : '/app/live-inspection';
    return <Navigate to={defaultRoute} replace />;
  }

  const isAllowed = hasRouteAccess(role, location.pathname);

  if (!isAllowed) {
    const allowed = getAllowedRoutes(role);
    const defaultAllowed = role === 'SUPPLIER_QA' ? '/app/reports' : (allowed[0]?.path || '/app/reports');

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-[#D9DEE5] rounded-[4px] font-sans shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="w-14 h-14 rounded-[4px] bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#B91C1C] mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-2 uppercase tracking-wide font-sans">
          Access Restricted by Operator Role
        </h2>
        <p className="text-xs text-[#475569] max-w-md font-sans mb-6">
          The requested station path <code className="text-[#1D4ED8] font-mono bg-[#F5F7FA] px-1.5 py-0.5 rounded-[2px] border border-[#D9DEE5]">{location.pathname}</code> is restricted for your current profile ({user.roleTitle}).
        </p>

        <div className="flex items-center gap-3">
          <Button asChild variant="default" size="sm" className="font-sans text-xs">
            <Link to={defaultAllowed}>Go to Authorized Station</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="font-sans text-xs bg-white border-[#D9DEE5] text-[#0F172A] hover:bg-[#F5F7FA]">
            <Link to="/login">Switch Role at Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
