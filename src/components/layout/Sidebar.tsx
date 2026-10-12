import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { authService } from '../../services/mock/auth';
import { getAllowedRoutes } from '../../lib/roles';
import { Logo } from '../common/Logo';
import {
  Radio,
  ScanSearch,
  Activity,
  Layers,
  FileText,
  Camera,
  Cpu,
  Settings,
  UserPlus,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Radio,
  ScanSearch,
  Activity,
  Layers,
  FileText,
  Camera,
  Cpu,
  Settings,
  UserPlus,
  User: UserIcon,
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  className,
}) => {
  const { role, user, logout } = useRole();
  const navigate = useNavigate();
  const routes = role ? getAllowedRoutes(role) : [];

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    authService.logout();
    logout();
    navigate('/', { replace: true });
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={`bg-white border-r border-[#D9DEE5] flex flex-col justify-between transition-all duration-300 z-40 select-none ${
          collapsed ? 'w-[4rem]' : 'w-[15rem]'
        } ${className}`}
      >
        {/* Top Header */}
        <div className="flex flex-col">
          <div className="h-14 border-b border-[#D9DEE5] px-3.5 flex items-center justify-between">
            {!collapsed && <Logo linkTo="/app/live-inspection" />}
            {collapsed && (
              <div className="w-full flex justify-center">
                <Logo linkTo="/app/live-inspection" showSubtitle={false} />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden md:flex h-7 w-7 text-[#64748B] hover:text-[#0F172A] shrink-0 ml-auto"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto">
            {!collapsed && (
              <div className="px-2.5 py-1.5 font-sans text-[0.625rem] text-[#64748B] uppercase tracking-wider font-semibold">
                OPERATIONAL CONSOLE
              </div>
            )}

            {routes.map((route) => {
              const Icon = ICON_MAP[route.icon] || Radio;

              const linkContent = (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-[0.1875rem] font-sans text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold border-l-2 border-[#1D4ED8]'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F5F7FA]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-[#1D4ED8]' : 'text-[#64748B] group-hover:text-[#0F172A]'
                        }`}
                      />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 truncate">
                          <span className="truncate">{route.name}</span>
                          {route.badge && (
                            <span
                              className={`font-mono text-[0.5625rem] px-1.5 py-0.2 rounded-[0.125rem] font-bold uppercase ${
                                route.badge === 'LIVE'
                                  ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                                  : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                              }`}
                            >
                              {route.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );

              if (collapsed) {
                return (
                  <Tooltip key={route.path}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-sans text-xs">
                      {route.name}
                      {route.badge && ` [${route.badge}]`}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </nav>
        </div>

        {/* Bottom Station / System Info */}
        <div className="p-3 border-t border-[#D9DEE5] flex flex-col gap-2">
          {!collapsed && user && (
            <div className="bg-[#F5F7FA] border border-[#D9DEE5] p-2.5 rounded-[0.1875rem] font-mono text-[0.625rem] text-[#475569]">
              <div className="text-[#64748B] uppercase tracking-wider text-[0.5625rem] font-sans font-semibold">
                ACTIVE OPERATOR
              </div>
              <div className="text-[#0F172A] font-semibold truncate text-xs font-sans mt-0.5">
                {user.fullName || user.name}
              </div>
              <div className="text-[#1D4ED8] text-[0.625rem] truncate font-medium">
                {user.roleTitle}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center gap-2 px-2.5 py-2 rounded-[0.1875rem] text-xs font-sans text-[#475569] hover:text-[#0F172A] hover:bg-[#F5F7FA] transition-colors cursor-pointer w-full text-left"
            title="Log out and return to Home"
          >
            <HomeIcon size={14} className="shrink-0 text-[#64748B]" />
            {!collapsed && <span>Home</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
