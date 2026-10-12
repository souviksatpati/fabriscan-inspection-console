import React from 'react';
import { useRole } from '../../hooks/useRole';
import { getAllowedRoutes, ROLE_LABELS } from '@/constants/roles';
import { User, Shield, KeyRound, Building2, Calendar, Clock, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export const Profile: React.FC = () => {
  useDocumentTitle('Operator Profile | Maruti FabriScan');
  const { user } = useRole();

  if (!user) return null;

  const roleMeta = ROLE_LABELS[user.role];
  const allowedRoutes = getAllowedRoutes(user.role);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans pb-12">
      {/* Page Header */}
      <div>
        <div className="font-sans text-[10px] text-[#1D4ED8] uppercase tracking-wider font-bold mb-1">
          STATION PROFILE &amp; AUTHORIZATION
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Operator Profile</h1>
        <p className="text-xs text-[#475569] mt-1">
          Station credentials, role privileges, and active session telemetry.
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div className="bg-white border border-[#D9DEE5] rounded-[6px] p-6 lg:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#D9DEE5] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[6px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-mono text-xl font-bold text-[#1D4ED8] shrink-0 shadow-xs">
              {user.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {user.fullName || user.name}
                </h2>
                <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[10px] font-bold px-2 py-0.5 rounded-[3px] uppercase font-mono">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                {roleMeta?.title || user.roleTitle}
              </p>
              <div className="text-[11px] text-[#64748B] font-mono mt-1 flex items-center gap-2">
                <span>Employee ID: <strong className="text-[#0F172A]">{user.employeeId}</strong></span>
                <span>•</span>
                <span>User ID: <strong className="text-[#0F172A]">{user.userId || user.id}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1.5 rounded-[4px] text-xs text-[#15803D] font-medium self-start sm:self-auto">
            <BadgeCheck size={16} />
            <span>Authenticated Station Session</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Full Name */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <User size={14} className="text-[#1D4ED8]" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-semibold text-[#0F172A]">{user.fullName || user.name}</div>
          </div>

          {/* User ID */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <KeyRound size={14} className="text-[#1D4ED8]" />
              <span>User ID</span>
            </div>
            <div className="text-sm font-mono font-semibold text-[#0F172A]">{user.userId || user.id}</div>
          </div>

          {/* Email */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <Building2 size={14} className="text-[#1D4ED8]" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-mono text-[#0F172A] truncate">{user.email}</div>
          </div>

          {/* Role */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <Shield size={14} className="text-[#1D4ED8]" />
              <span>Role Privilege</span>
            </div>
            <div className="text-sm font-semibold text-[#0F172A]">{roleMeta?.title || user.roleTitle}</div>
          </div>

          {/* Station */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <Building2 size={14} className="text-[#1D4ED8]" />
              <span>Station Assignment</span>
            </div>
            <div className="text-sm font-semibold text-[#0F172A]">{user.station || user.stationAssignment}</div>
          </div>

          {/* Employee ID */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <BadgeCheck size={14} className="text-[#1D4ED8]" />
              <span>Employee Identifier</span>
            </div>
            <div className="text-sm font-mono font-semibold text-[#0F172A]">{user.employeeId}</div>
          </div>

          {/* Session Start */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <Clock size={14} className="text-[#1D4ED8]" />
              <span>Session Started At</span>
            </div>
            <div className="text-xs font-mono text-[#0F172A]">
              {user.sessionStartedAt
                ? new Date(user.sessionStartedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
                : 'Current Active Session'}
            </div>
          </div>

          {/* Last Login */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <Calendar size={14} className="text-[#1D4ED8]" />
              <span>Last Login Record</span>
            </div>
            <div className="text-xs font-mono text-[#0F172A]">
              {new Date(user.lastLoginAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </div>
          </div>

          {/* Password (Masked) */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <KeyRound size={14} className="text-[#1D4ED8]" />
              <span>Station Password</span>
            </div>
            <div className="text-base font-mono font-bold tracking-widest text-[#0F172A]">••••••••</div>
          </div>
        </div>
      </div>

      {/* Role Permissions Section */}
      <div className="bg-white border border-[#D9DEE5] rounded-[6px] p-6 lg:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Authorized Route Permissions
            </h3>
            <p className="text-xs text-[#64748B]">
              Subsystems and operational control panels accessible to {user.roleTitle}.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold bg-[#F5F7FA] border border-[#D9DEE5] px-2.5 py-1 rounded-[3px] text-[#0F172A]">
            {allowedRoutes.length} STATIONS AUTHORIZED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allowedRoutes.map((route) => (
            <div
              key={route.path}
              className="flex items-start gap-3 p-3.5 rounded-[4px] bg-[#F8FAFC] border border-[#E2E8F0]"
            >
              <div className="w-8 h-8 rounded bg-white border border-[#D9DEE5] flex items-center justify-center text-[#1D4ED8] shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#0F172A]">{route.name}</span>
                  <span className="font-mono text-[10px] text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.2 rounded border border-[#BFDBFE]">
                    {route.path}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                  {route.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
