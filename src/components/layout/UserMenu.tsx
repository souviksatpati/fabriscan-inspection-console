import React from 'react';
import { useRole } from '../../hooks/useRole';
import { ROLE_LABELS } from '../../lib/roles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, logout } = useRole();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const roleMeta = ROLE_LABELS[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 p-1.5 rounded-[0.1875rem] border border-[#D9DEE5] hover:border-[#CBD5E1] bg-white hover:bg-[#F5F7FA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] cursor-pointer">
        <div className="w-7 h-7 rounded-[0.125rem] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-mono text-xs font-bold text-[#1D4ED8]">
          {user.avatarInitials}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#0F172A] truncate max-w-[7.5rem]">
            {user.fullName || user.name}
          </span>
          <span className="font-mono text-[0.5625rem] text-[#64748B] uppercase">
            {roleMeta?.title || user.roleTitle}
          </span>
        </div>
        <ChevronDown size={14} className="text-[#64748B] ml-1" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[16rem] font-sans text-xs bg-white border border-[#D9DEE5] shadow-[0_4px_12px_rgba(15,23,42,0.08)] p-1">
        {/* Dropdown Header: Avatar initials, full name, role, email, user ID */}
        <DropdownMenuLabel className="font-sans p-3 bg-[#F8FAFC] rounded-[0.25rem] mb-1 border border-[#E2E8F0]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-[0.25rem] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-mono text-xs font-bold text-[#1D4ED8] shrink-0">
              {user.avatarInitials}
            </div>
            <div className="overflow-hidden">
              <div className="text-[#0F172A] font-bold text-xs truncate">
                {user.fullName || user.name}
              </div>
              <div className="text-[0.625rem] text-[#1D4ED8] font-semibold truncate">
                {roleMeta?.title || user.roleTitle}
              </div>
            </div>
          </div>
          <div className="space-y-0.5 pt-1.5 border-t border-[#E2E8F0] text-[0.625rem] text-[#64748B] font-mono">
            <div className="truncate">Email: {user.email}</div>
            <div>User ID: <span className="text-[#0F172A] font-semibold">{user.userId || user.id}</span></div>
          </div>
        </DropdownMenuLabel>

        {/* My Profile Link */}
        <DropdownMenuItem
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-2.5 py-2 px-3 text-xs text-[#0F172A] hover:bg-[#F5F7FA] rounded-[0.1875rem] cursor-pointer"
        >
          <User size={14} className="text-[#1D4ED8]" />
          <span className="font-medium">My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-[#DC2626] focus:text-[#B91C1C] focus:bg-[#FEF2F2] flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-[0.1875rem] text-xs font-medium"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
